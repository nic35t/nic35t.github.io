#!/usr/bin/env node
/**
 * Runtime diagnostics for the built site.
 *
 * Loads pages in a real browser at several viewports and reports the failure
 * modes that a Jekyll build never catches: JS errors, dead requests, broken
 * images, horizontal overflow, and interactive elements that something else is
 * sitting on top of.
 *
 *   node scripts/diagnose.mjs [--url http://127.0.0.1:4000] [--out debug-report]
 *                             [--paths /,/investment-test/] [--viewport mobile]
 *                             [--external]   also report third-party request failures
 *
 * Exits non-zero when any ERROR-level finding is reported.
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = parseArgs(process.argv.slice(2));
const BASE_URL = (args.url ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const OUT_DIR = args.out ?? "debug-report";
const SHOT_DIR = path.join(OUT_DIR, "screenshots");

const ALL_VIEWPORTS = [
  { name: "mobile", width: 375, height: 667, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: false },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const VIEWPORTS = args.viewport
  ? ALL_VIEWPORTS.filter((v) => args.viewport.split(",").includes(v.name))
  : ALL_VIEWPORTS;

/** Minimum comfortable tap target, per the WCAG 2.2 target-size guidance. */
export const MIN_TAP_TARGET = 44;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i += 1;
    } else {
      out[key] = true;
    }
  }
  return out;
}

/** Pages to visit: an explicit --paths list, else a sample drawn from the sitemap. */
async function resolvePaths() {
  if (args.paths) return args.paths.split(",").map((p) => p.trim()).filter(Boolean);

  const always = ["/", "/investment-test/", "/categories/", "/tags/"];
  let fromSitemap = [];
  try {
    const xml = await readFile("_site/sitemap.xml", "utf8");
    fromSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""))
      .filter((p) => p && !always.includes(p));
  } catch {
    // No sitemap yet — the always-list is still worth checking.
  }

  // A couple of real posts exercise the article layout without a long crawl.
  const posts = fromSitemap.filter((p) => p.split("/").filter(Boolean).length >= 2).slice(0, 3);
  return [...always, ...posts];
}

/**
 * Everything below runs inside the page. It walks the rendered DOM, so it sees
 * the same stacking and layout the reader sees.
 */
export const AUDIT = ({ minTapTarget }) => {
  const findings = [];
  const vw = window.innerWidth;

  const isVisible = (el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  // Skip links and other screen-reader-only controls are deliberately parked
  // off-screen or clipped to nothing until focused. They are not layout bugs.
  const isScreenReaderOnly = (el) => {
    if (el.closest(".screen-reader-text, .screen-reader-shortcut, .sr-only, .visually-hidden")) return true;
    const style = getComputedStyle(el);
    if (style.clipPath === "inset(100%)" || (style.clip && style.clip !== "auto")) return true;
    return false;
  };

  const describe = (el) => {
    if (!el) return "(none)";
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
      : "";
    const text = (el.textContent ?? "").trim().slice(0, 30);
    return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
  };

  // --- horizontal overflow -------------------------------------------------
  // The page scrolling sideways on mobile is almost always one wide child.
  const docOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (docOverflow > 1) {
    const culprits = [];
    for (const el of document.querySelectorAll("body *")) {
      if (!isVisible(el) || isScreenReaderOnly(el)) continue;
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue;
      const rect = el.getBoundingClientRect();
      // Report the outermost offender, not every nested child of it.
      if (rect.right > vw + 1 || rect.left < -1) {
        if (culprits.some((c) => c.el.contains(el))) continue;
        culprits.push({ el, rect });
      }
    }
    findings.push({
      level: "error",
      check: "overflow",
      message: `page scrolls horizontally by ${docOverflow}px`,
      details: culprits.slice(0, 5).map((c) => ({
        element: describe(c.el),
        left: Math.round(c.rect.left),
        right: Math.round(c.rect.right),
        overhang: Math.round(c.rect.right - vw),
      })),
    });
  }

  // --- covered interactive elements ---------------------------------------
  // The z-index / overflow class of bug: the control is on screen and looks
  // fine, but a sibling is painted over it and swallows the tap.
  const interactive = document.querySelectorAll(
    "a[href], button, [role='button'], input, select, textarea, summary, label[for]"
  );
  const covered = [];
  for (const el of interactive) {
    if (!isVisible(el) || isScreenReaderOnly(el)) continue;
    const rect = el.getBoundingClientRect();

    // Probe the element's own centre. Clamping the point into the viewport
    // would hit-test a spot the element does not occupy and report a phantom
    // blocker, so anything whose centre is off-screen is simply not judged.
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (x < 0 || x > vw || y < 0 || y > window.innerHeight) continue;

    const hit = document.elementFromPoint(x, y);
    if (!hit) continue;
    if (hit === el || el.contains(hit) || hit.contains(el)) continue;

    const hitStyle = getComputedStyle(hit);
    covered.push({
      element: describe(el),
      blockedBy: describe(hit),
      blockerZIndex: hitStyle.zIndex,
      blockerPosition: hitStyle.position,
      at: { x: Math.round(x), y: Math.round(y) },
    });
  }
  if (covered.length) {
    findings.push({
      level: "error",
      check: "click-blocked",
      message: `${covered.length} interactive element(s) are covered by another element`,
      details: covered.slice(0, 8),
    });
  }

  // --- tap targets ---------------------------------------------------------
  if (vw <= 480) {
    // Only chrome — buttons, nav, share links. Prose links are text-sized by
    // definition and flagging them buries the controls that actually matter.
    const controls = document.querySelectorAll(
      "button, [role='button'], input, select, textarea, summary, .btn, .site-logo, .back-to-top, nav a, .greedy-nav a, .pagination a"
    );
    const small = [];
    for (const el of controls) {
      if (!isVisible(el) || isScreenReaderOnly(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width >= minTapTarget && rect.height >= minTapTarget) continue;
      small.push({
        element: describe(el),
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      });
    }
    if (small.length) {
      findings.push({
        level: "warning",
        check: "tap-target",
        message: `${small.length} tap target(s) smaller than ${minTapTarget}px`,
        details: small.slice(0, 8),
      });
    }
  }

  // --- broken images -------------------------------------------------------
  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => ({ src: img.getAttribute("src"), sameOrigin: new URL(img.src, location.href).origin === location.origin }))
    .filter((img) => img.sameOrigin)
    .map((img) => img.src);
  if (brokenImages.length) {
    findings.push({
      level: "error",
      check: "broken-image",
      message: `${brokenImages.length} local image(s) failed to render`,
      details: brokenImages.slice(0, 10),
    });
  }

  // --- stacking context map ------------------------------------------------
  // Not a failure on its own, but the map is what you need in hand the moment
  // a z-index bug shows up.
  const stacking = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.position === "static") continue;
    const z = parseInt(style.zIndex, 10);
    if (Number.isNaN(z)) continue;
    stacking.push({ element: describe(el), zIndex: z, position: style.position });
  }
  stacking.sort((a, b) => b.zIndex - a.zIndex);

  return { findings, stacking: stacking.slice(0, 15) };
};

async function auditPage(context, urlPath, viewport) {
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on("pageerror", (err) => consoleErrors.push({ type: "pageerror", text: String(err) }));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push({ type: "console", text: msg.text() });
  });
  page.on("requestfailed", (req) => {
    failedRequests.push({ url: req.url(), reason: req.failure()?.errorText ?? "unknown" });
  });
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push({ url: res.url(), reason: `HTTP ${res.status()}` });
  });

  const url = `${BASE_URL}${urlPath}`;
  const result = {
    path: urlPath,
    viewport: viewport.name,
    findings: [],
    stacking: [],
    screenshot: null,
  };

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    if (response && response.status() >= 400) {
      result.findings.push({
        level: "error",
        check: "http",
        message: `${urlPath} returned HTTP ${response.status()}`,
      });
    }
  } catch (err) {
    result.findings.push({ level: "error", check: "navigation", message: `${urlPath}: ${err.message}` });
    await page.close();
    return result;
  }

  const audit = await page.evaluate(AUDIT, { minTapTarget: MIN_TAP_TARGET });
  result.findings.push(...audit.findings);
  result.stacking = audit.stacking;

  // A console "Failed to load resource" line is the echo of a request the
  // network checks below already report. Keep only real script errors.
  const scriptErrors = consoleErrors.filter((e) => !/Failed to load resource/i.test(e.text));
  if (scriptErrors.length) {
    result.findings.push({
      level: "error",
      check: "js-error",
      message: `${scriptErrors.length} JavaScript error(s)`,
      details: scriptErrors.slice(0, 10),
    });
  }

  // Only same-origin requests are this repo's responsibility. Third-party CDNs,
  // fonts and analytics are reported separately and, since they are unreachable
  // from a sandbox, stay quiet unless --external is passed.
  const origin = new URL(BASE_URL).origin;
  const firstParty = failedRequests.filter((r) => r.url.startsWith(origin));
  const thirdParty = failedRequests.filter((r) => !r.url.startsWith(origin));

  if (firstParty.length) {
    result.findings.push({
      level: "error",
      check: "request-failed",
      message: `${firstParty.length} same-origin request(s) failed`,
      details: firstParty.slice(0, 10),
    });
  }
  if (thirdParty.length && args.external) {
    result.findings.push({
      level: "warning",
      check: "third-party",
      message: `${thirdParty.length} third-party request(s) failed`,
      details: thirdParty.slice(0, 10),
    });
  }

  const slug = urlPath.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
  const shotPath = path.join(SHOT_DIR, `${slug}.${viewport.name}.png`);
  await page.screenshot({ path: shotPath, fullPage: true });
  result.screenshot = shotPath;

  await page.close();
  return result;
}

function renderMarkdown(results) {
  const lines = [`# Site diagnostics`, ``, `- Base URL: ${BASE_URL}`, `- Run: ${new Date().toISOString()}`, ``];

  const errors = results.flatMap((r) => r.findings.filter((f) => f.level === "error"));
  const warnings = results.flatMap((r) => r.findings.filter((f) => f.level === "warning"));
  lines.push(`**${errors.length} error(s), ${warnings.length} warning(s)** across ${results.length} page/viewport combinations.`, ``);

  for (const result of results) {
    if (!result.findings.length) continue;
    lines.push(`## ${result.path} — ${result.viewport}`, ``);
    for (const finding of result.findings) {
      const icon = finding.level === "error" ? "❌" : "⚠️";
      lines.push(`- ${icon} **[${finding.check}]** ${finding.message}`);
      if (finding.details) {
        for (const detail of [].concat(finding.details)) {
          lines.push(`  - \`${typeof detail === "string" ? detail : JSON.stringify(detail)}\``);
        }
      }
    }
    if (result.stacking.length) {
      lines.push(``, `<details><summary>Stacking order (highest z-index first)</summary>`, ``);
      for (const entry of result.stacking) {
        lines.push(`  - z:${entry.zIndex} (${entry.position}) ${entry.element}`);
      }
      lines.push(``, `</details>`);
    }
    lines.push(``);
  }

  const clean = results.filter((r) => !r.findings.length);
  if (clean.length) {
    lines.push(`## Clean`, ``);
    for (const result of clean) lines.push(`- ${result.path} — ${result.viewport}`);
    lines.push(``);
  }

  lines.push(`Screenshots: \`${SHOT_DIR}/\``, ``);
  return lines.join("\n");
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true });
  const paths = await resolvePaths();

  const browser = await chromium.launch();
  const results = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
      deviceScaleFactor: viewport.isMobile ? 2 : 1,
    });
    for (const urlPath of paths) {
      process.stdout.write(`  ${viewport.name.padEnd(8)} ${urlPath}\n`);
      results.push(await auditPage(context, urlPath, viewport));
    }
    await context.close();
  }

  await browser.close();

  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(results, null, 2));
  await writeFile(path.join(OUT_DIR, "report.md"), renderMarkdown(results));

  const errors = results.flatMap((r) => r.findings.filter((f) => f.level === "error"));
  const warnings = results.flatMap((r) => r.findings.filter((f) => f.level === "warning"));

  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  console.log(`Report: ${path.join(OUT_DIR, "report.md")}`);

  for (const finding of errors.slice(0, 10)) {
    console.log(`  ❌ [${finding.check}] ${finding.message}`);
  }

  process.exit(errors.length ? 1 : 0);
}

// Importing this module (scripts/selftest.mjs does) must not start a crawl.
const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
