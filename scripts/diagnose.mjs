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
 *                             [--external]          also report third-party request failures
 *                             [--throttle]         emulate Slow 4G + 4x CPU (real vitals)
 *                             [--update-baseline]  accept current screenshots as the baseline
 *                             [--skip-a11y] [--skip-visual] [--skip-vitals]
 *                             [--known <file>]   do not fail on already-recorded issues
 *                             [--update-known]   re-record the current issues as known
 *
 * Exits non-zero when any ERROR-level finding is reported.
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTOR, READ_VITALS, THRESHOLDS, SLOW_4G, CPU_SLOWDOWN, rate, exerciseInteractions, stubThirdParty, findRenderBlocking, WEIGHT_BUDGET_KB } from "./lib/vitals.mjs";
import { runAxe, toFindings as axeFindings } from "./lib/a11y.mjs";
import { compare as compareVisual, toFinding as visualFinding } from "./lib/visual.mjs";
import { loadKnown, signature, partitionKnown, writeKnown } from "./lib/known.mjs";

const args = parseArgs(process.argv.slice(2));
const BASE_URL = (args.url ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const OUT_DIR = args.out ?? "debug-report";
const SHOT_DIR = path.join(OUT_DIR, "screenshots");
const BASELINE_DIR = path.join("debug-baseline");
const DIFF_DIR = path.join(OUT_DIR, "visual", "diff");

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

  // --- oversized images ----------------------------------------------------
  // Shipping a 1024px asset into a 32px slot is the single most common cause
  // of a bad LCP on an otherwise light page.
  const oversized = [];
  const undimensioned = [];
  // Phones are DPR 2-3; judge against that rather than the capture DPR.
  const dpr = vw <= 480 ? 2 : 1;
  for (const img of document.images) {
    if (!img.naturalWidth) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width < 1) continue;

    const needed = Math.ceil(rect.width * dpr);
    if (img.naturalWidth > needed * 2) {
      oversized.push({
        src: (img.getAttribute("src") || "").slice(0, 70),
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        displayed: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        factor: `${(img.naturalWidth / needed).toFixed(1)}x wider than needed`,
      });
    }

    // Without intrinsic dimensions the browser cannot reserve space, so the
    // page reflows when the image lands. That is CLS.
    if (!img.getAttribute("width") && !img.getAttribute("height") && !img.style.aspectRatio) {
      undimensioned.push((img.getAttribute("src") || "").slice(0, 70));
    }
  }
  if (oversized.length) {
    findings.push({
      level: "warning",
      check: "oversized-image",
      message: `${oversized.length} image(s) far larger than their rendered size`,
      details: oversized.slice(0, 6),
    });
  }
  if (undimensioned.length) {
    findings.push({
      level: "warning",
      check: "image-dimensions",
      message: `${undimensioned.length} image(s) without width/height — a layout-shift risk`,
      details: undimensioned.slice(0, 6),
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

/**
 * One vitals metric against its threshold, or null when there is nothing to
 * report. Shared so INP — measured at the end of the pass — is judged by
 * exactly the same rule as the load metrics.
 */
function rateVitals(metric, value) {
  if (value == null) return null;
  const verdict = rate(metric, value);
  if (verdict === "good") return null;
  // Unthrottled timings measured against a local server are not evidence of
  // anything, so only CLS — which is layout, not speed — can fail a run.
  const timing = metric !== "CLS";
  const meaningful = args.throttle || !timing;
  return {
    level: verdict === "poor" && meaningful ? "error" : "warning",
    check: "web-vitals",
    message: `${metric} ${value}${THRESHOLDS[metric].unit} is ${verdict} (good \u2264 ${THRESHOLDS[metric].good})`,
    details: [THRESHOLDS[metric].label + (meaningful ? "" : " \u2014 unthrottled local timing, indicative only")],
  };
}

async function auditPage(context, urlPath, viewport) {
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  // Observers must exist before the first paint or every entry is missed.
  if (!args["skip-vitals"]) await page.addInitScript(COLLECTOR);

  // Unreachable third-party CSS blocks paint indefinitely, which suppresses
  // paint timing altogether. Stub it unless the run is explicitly testing the
  // real network.
  if (!args.external) await stubThirdParty(page, new URL(BASE_URL).origin);

  // Throttling is what makes the numbers mean anything: unthrottled localhost
  // makes every page look instant regardless of how heavy it is.
  let cdp = null;
  if (args.throttle) {
    cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", SLOW_4G);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_SLOWDOWN });
  }

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
  let deliveredHtml = "";
  const result = {
    path: urlPath,
    viewport: viewport.name,
    findings: [],
    stacking: [],
    screenshot: null,
    vitals: null,
    visual: null,
    throttled: false,
  };

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    // The HTML as delivered, before scripts rewrite any of it.
    if (response) deliveredHtml = await response.text().catch(() => "");
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

  // --- Core Web Vitals ------------------------------------------------------
  if (!args["skip-vitals"]) {
    // Load metrics are read before the page is touched. Driving controls to
    // give INP something to measure can itself provoke a first paint entry that
    // the browser had not emitted yet, and the timestamp then reflects when the
    // page was poked rather than when it painted — on this runner that turned a
    // page measuring 1.6s at mobile width into a fictional 5.1s at desktop.
    const vitals = await page.evaluate(READ_VITALS);
    result.vitals = vitals;
    result.throttled = Boolean(args.throttle);

    const blocking = findRenderBlocking(deliveredHtml, new URL(BASE_URL).origin);
    if (blocking.length) {
      result.findings.push({
        level: "warning",
        check: "render-blocking",
        message: `${blocking.length} render-blocking third-party resource(s) delay first paint`,
        details: blocking.map((b) => `${b.type}: ${b.href}`),
      });
    }
    if (vitals.LCP == null && vitals.FCP == null) {
      result.findings.push({
        level: "warning",
        check: "web-vitals",
        message: "paint timing unavailable — the browser never recorded a contentful paint",
        details: blocking.length
          ? ["likely the render-blocking resources above; re-run without --external to stub them"]
          : [
              "the page does render, so this is the browser not emitting paint entries rather than a slow page.",
              "headless Chromium does this intermittently, more often at wider viewports. Treat the metric as",
              "unmeasured, not as fast. CLS and INP are unaffected.",
            ],
      });
    }

    const totalKb = Math.round(vitals.transferBytes / 1024);
    if (totalKb > WEIGHT_BUDGET_KB) {
      result.findings.push({
        level: "warning",
        check: "page-weight",
        message: `${totalKb}KB transferred, over the ${WEIGHT_BUDGET_KB}KB budget`,
        details: vitals.heaviest.map((r) => `${r.kb}KB  ${r.type}  ${r.url}`),
      });
    }

    // INP is deliberately absent here: it is measured after the audit, once
    // driving the page can no longer affect what the audit and the screenshots
    // see. It is judged in rateVitals below.
    for (const metric of ["LCP", "CLS", "FCP", "TTFB"]) {
      const finding = rateVitals(metric, vitals[metric]);
      if (finding) result.findings.push(finding);
    }
  }

  // --- accessibility --------------------------------------------------------
  if (!args["skip-a11y"]) {
    // The audit runs against the page at rest. This used to matter because the
    // INP probe ran first and scrolled the page, and a sticky masthead then
    // covered the first row of any list under it — which axe correctly reported
    // as an obscured tap target, an artefact of the probe rather than the page.
    // The probe has moved to the end of the pass, so nothing has touched the
    // page by now; the reset stays as a guard for whatever runs here next.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    try {
      const violations = await runAxe(page);
      result.findings.push(...axeFindings(violations));
    } catch (err) {
      result.findings.push({ level: "warning", check: "a11y", message: `axe failed: ${err.message}` });
    }
  }

  const slug = urlPath.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
  const key = `${slug}.${viewport.name}`;
  const shotPath = path.join(SHOT_DIR, `${key}.png`);

  // Two captures with different jobs: the full-page shot is for a human to
  // look at (local artifact, never committed), while the baseline is clipped
  // to the viewport so the committed set stays a few MB rather than tens.
  await page.screenshot({ path: shotPath, fullPage: true, animations: "disabled", caret: "hide" });
  result.screenshot = shotPath;
  const buffer = await page.screenshot({ fullPage: false, animations: "disabled", caret: "hide" });

  // --- visual regression ----------------------------------------------------
  if (!args["skip-visual"]) {
    try {
      const visual = await compareVisual({
        baselineDir: BASELINE_DIR,
        diffDir: DIFF_DIR,
        key,
        buffer,
        updateBaseline: Boolean(args["update-baseline"]),
        conditions: {
          width: viewport.width,
          height: viewport.height,
          dpr: 1,
          throttled: Boolean(args.throttle),
          platform: process.env.CI ? "ci" : process.platform,
        },
      });
      result.visual = visual;
      const finding = visualFinding(key, visual);
      if (finding) result.findings.push(finding);
    } catch (err) {
      result.findings.push({ level: "warning", check: "visual-regression", message: err.message });
    }
  }

  // --- INP ------------------------------------------------------------------
  // Last, on purpose. Measuring it means clicking things, and a clicked page is
  // not the page the accessibility audit and the visual baseline are supposed
  // to see — an opened overflow menu or a flipped theme would be recorded as if
  // it were the resting state. Nothing below observes the page, so the probe
  // can finally use real clicks.
  if (!args["skip-vitals"] && result.vitals) {
    try {
      const driven = await exerciseInteractions(page);
      const probed = await page.evaluate(READ_VITALS);
      result.vitals.INP = probed.INP;
      result.vitals.interactionCount = probed.interactionCount;
      result.vitals.interactionsDriven = driven;
      const finding = rateVitals("INP", probed.INP);
      if (finding) result.findings.push(finding);

      // Pages share one browser context per viewport, and one of the controls
      // the probe clicks is the theme toggle, which persists the choice. Left
      // behind, it renders every later page in this viewport dark and the
      // baselines record that as the site's resting appearance — nine false
      // visual regressions, the first time this ran. Storage goes back to the
      // state a first visit sees.
      await page.evaluate(() => {
        try { localStorage.clear(); sessionStorage.clear(); } catch {}
      });
    } catch (err) {
      result.findings.push({ level: "warning", check: "web-vitals", message: `INP probe failed: ${err.message}` });
    }
  }

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
    if (result.vitals) {
      const cells = ["LCP", "CLS", "INP", "FCP", "TTFB"].map((m) => {
        const value = result.vitals[m];
        if (value == null) {
          // A null INP is not missing data when the page was actually driven:
          // the event timing spec floors durationThreshold at 16ms, so an
          // interaction quicker than that is never reported. Say which case
          // this is rather than printing "n/a" for both.
          if (m !== "INP") return `${m}: n/a`;
          return result.vitals.interactionsDriven
            ? `\u{1F7E2} INP <16ms (${result.vitals.interactionsDriven} interactions, none slow enough to time)`
            : `INP: no interaction driven`;
        }
        const icon = { good: "\u{1F7E2}", "needs-improvement": "\u{1F7E1}", poor: "\u{1F534}" }[rate(m, value)] ?? "";
        const suffix = m === "INP" ? ` (worst of ${result.vitals.interactionCount} timed)` : "";
        return `${icon} ${m} ${value}${THRESHOLDS[m].unit}${suffix}`;
      });
      lines.push(``, `Vitals${result.throttled ? " (Slow 4G, 4x CPU)" : " (unthrottled)"}: ` + cells.join(" \u00B7 "), ``);
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
      // DPR 1 everywhere: baselines stay small and reproducible across machines.
      deviceScaleFactor: 1,
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

  let errors = results.flatMap((r) => r.findings.filter((f) => f.level === "error"));
  const warnings = results.flatMap((r) => r.findings.filter((f) => f.level === "warning"));

  // A gate dropped onto an existing site is red from the first run and stays
  // red, which teaches everyone to ignore it. Recording what is already broken
  // lets the build fail on what gets broken next.
  let known = [];
  if (args.known) {
    if (args["update-known"]) {
      await writeKnown(args.known, results);
      console.log(`\nRecorded ${errors.length} known issue(s) to ${args.known}`);
      process.exit(0);
    }
    const knownSignatures = await loadKnown(args.known);
    const split = partitionKnown(results, knownSignatures);
    known = split.known;
    errors = split.unexpected;
  }

  const visualChanged = results.filter((r) => r.visual && r.visual.status === "changed");
  const baselinesWritten = results.filter((r) => r.visual && (r.visual.status === "created" || r.visual.status === "updated"));

  console.log(`\n${errors.length} new error(s), ${warnings.length} warning(s)` + (args.known ? `, ${known.length} known` : ""));
  if (baselinesWritten.length) console.log(`  \u{1F4F8} ${baselinesWritten.length} visual baseline(s) written`);
  if (visualChanged.length) console.log(`  \u{1F441}  ${visualChanged.length} page(s) changed visually \u2014 see ${DIFF_DIR}/`);
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
