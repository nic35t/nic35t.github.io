#!/usr/bin/env node
/**
 * Tests the diagnostic itself against fixtures with known-good and known-bad
 * layouts. A checker tuned until it reports nothing is worse than no checker,
 * so every heuristic gets a case that must fire and a case that must not.
 *
 *   node scripts/selftest.mjs
 */

import { chromium } from "playwright";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PNG } from "pngjs";
import { AUDIT, MIN_TAP_TARGET } from "./diagnose.mjs";
import { compare as compareVisual } from "./lib/visual.mjs";
import { entryOf, partitionKnown } from "./lib/known.mjs";
import { findRenderBlocking, COLLECTOR, READ_VITALS, exerciseInteractions } from "./lib/vitals.mjs";

const BASE_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 16px sans-serif; }
  .screen-reader-shortcut {
    position: absolute; top: 0; left: 0;
    width: 1px; height: 1px; overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }
`;

const FIXTURES = [
  {
    name: "clean page",
    html: `<nav><a href="#main" class="screen-reader-shortcut">Skip to content</a></nav>
           <main><p>Hello <a href="/x">inline link</a></p>
           <button style="width:48px;height:48px">OK</button></main>`,
    expect: { fire: [], quiet: ["overflow", "click-blocked", "tap-target"] },
  },
  {
    name: "button covered by a higher stacking context",
    html: `<div style="position:relative">
             <button id="cta" style="position:relative;z-index:1;width:200px;height:60px">Buy</button>
             <div id="veil" style="position:absolute;inset:0;z-index:99;background:rgba(0,0,0,.01)"></div>
           </div>`,
    expect: { fire: ["click-blocked"], quiet: [] },
  },
  {
    name: "child wider than the viewport",
    html: `<div style="width:900px;height:40px;background:#eee">too wide</div>`,
    expect: { fire: ["overflow"], quiet: [] },
  },
  {
    name: "undersized tap target",
    html: `<button style="width:20px;height:20px">x</button>`,
    expect: { fire: ["tap-target"], quiet: [] },
  },
  {
    name: "image far larger than its rendered box",
    html: `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'%3E%3Crect width='1000' height='1000' fill='%23ccc'/%3E%3C/svg%3E" style="width:50px;height:50px" width="1000" height="1000" alt="big">`,
    expect: { fire: ["oversized-image"], quiet: ["image-dimensions"] },
  },
  {
    name: "right-sized image with intrinsic dimensions",
    html: `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23ccc'/%3E%3C/svg%3E" width="60" height="60" alt="ok">`,
    expect: { fire: [], quiet: ["oversized-image", "image-dimensions"] },
  },
  {
    name: "image without width/height reserves no space",
    html: `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23ccc'/%3E%3C/svg%3E" alt="no dims">`,
    expect: { fire: ["image-dimensions"], quiet: ["oversized-image"] },
  },
  {
    name: "offscreen skip link is not a blocked click",
    html: `<a href="#main" class="screen-reader-shortcut">Skip to content</a>
           <header style="position:sticky;top:0;z-index:100;height:60px;background:#fff">Site</header>`,
    expect: { fire: [], quiet: ["click-blocked", "overflow"] },
  },
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
const page = await context.newPage();

let failures = 0;

for (const fixture of FIXTURES) {
  await page.setContent(`<style>${BASE_CSS}</style>${fixture.html}`);
  // naturalWidth is 0 until the image decodes, which would hide image findings.
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {})))));
  const { findings } = await page.evaluate(AUDIT, { minTapTarget: MIN_TAP_TARGET });
  const fired = new Set(findings.map((f) => f.check));

  const missing = fixture.expect.fire.filter((c) => !fired.has(c));
  const spurious = fixture.expect.quiet.filter((c) => fired.has(c));

  if (missing.length || spurious.length) {
    failures += 1;
    console.log(`FAIL  ${fixture.name}`);
    if (missing.length) console.log(`        expected but did not fire: ${missing.join(", ")}`);
    if (spurious.length) console.log(`        fired but should not have: ${spurious.join(", ")}`);
    console.log(`        actual: ${[...fired].join(", ") || "(nothing)"}`);
  } else {
    console.log(`ok    ${fixture.name}`);
  }
}

// --- INP -------------------------------------------------------------------
// The metric is defined over interactions — clicks, taps, key presses — and
// nothing else. Reading the widest `event` entry instead measured a hover: on
// this runner the first pointerover into a page takes hundreds of milliseconds
// under CPU throttling, and that was being reported as INP on pages where
// nothing had been clicked. Both directions are pinned here, plus the case
// that made the bug invisible.
const INP_CASES = [
  {
    // The floor is the point: durationThreshold is clamped to 16ms, so an
    // interaction faster than that is invisible. Reading null here as "no
    // interaction" would invert the conclusion — this page is the fast one.
    name: "an interaction under the 16ms floor reports as fast, not as missing",
    html: `<button id="b" style="min-width:44px;min-height:44px">Press</button>`,
    expect: (v, driven) => driven > 0 && v.INP == null,
    describe: (v, driven) => `INP ${v.INP === null ? "null" : v.INP}, ${driven} driven`,
  },
  {
    name: "a blocking click handler is caught",
    html: `<button id="b" style="min-width:44px;min-height:44px">Press</button>
           <script>document.addEventListener("click", () => {
             const end = performance.now() + 400; while (performance.now() < end);
           }, true);<\/script>`,
    expect: (v) => v.INP != null && v.INP > 300,
    describe: (v) => `INP ${v.INP} from ${v.interactionCount} timed interaction(s)`,
  },
  {
    name: "hovering alone is not an interaction",
    html: `<div id="hoverable" style="width:200px;height:200px">Hover me</div>`,
    hoverOnly: true,
    expect: (v, driven) => v.INP == null && v.interactionCount === 0 && driven === 0,
    describe: (v, driven) => `INP ${v.INP === null ? "null" : v.INP}, ${v.interactionCount} timed, ${driven} driven`,
  },
];

for (const c of INP_CASES) {
  const inpPage = await context.newPage();
  await inpPage.addInitScript(COLLECTOR);
  await inpPage.goto("about:blank");
  await inpPage.setContent(`<style>${BASE_CSS}</style>${c.html}`);
  let driven = 0;
  if (c.hoverOnly) {
    await inpPage.hover("#hoverable");
    await inpPage.mouse.move(20, 20);
    await inpPage.waitForTimeout(200);
  } else {
    driven = await exerciseInteractions(inpPage);
  }
  const vitals = await inpPage.evaluate(READ_VITALS);
  await inpPage.close();
  if (c.expect(vitals, driven)) {
    console.log(`ok    ${c.name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${c.name}`);
    console.log(`        got ${c.describe(vitals, driven)}`);
  }
}

await browser.close();

// --- visual regression -----------------------------------------------------
// A pixel baseline is only worth keeping if an unchanged page stays silent and
// a changed one does not. Both directions are asserted here, along with the
// condition guard that stops a throttled baseline being judged against an
// unthrottled run.

function solidPng(width, height, [r, g, b]) {
  const png = new PNG({ width, height });
  for (let i = 0; i < width * height; i += 1) {
    png.data[i * 4] = r;
    png.data[i * 4 + 1] = g;
    png.data[i * 4 + 2] = b;
    png.data[i * 4 + 3] = 255;
  }
  return PNG.sync.write(png);
}

const THROTTLED = { width: 375, height: 667, dpr: 1, throttled: true };
const UNTHROTTLED = { width: 375, height: 667, dpr: 1, throttled: false };

const tmp = await mkdtemp(path.join(tmpdir(), "visual-selftest-"));
const dirs = { baselineDir: path.join(tmp, "baseline"), diffDir: path.join(tmp, "diff") };

const white = solidPng(40, 40, [255, 255, 255]);
const offWhite = solidPng(40, 40, [255, 255, 254]); // within anti-aliasing tolerance
const red = solidPng(40, 40, [255, 0, 0]);
const tall = solidPng(40, 80, [255, 255, 255]);

const VISUAL_CASES = [
  { name: "first run records a baseline", key: "a", buffer: white, conditions: THROTTLED, expect: "created" },
  { name: "identical page stays silent", key: "a", buffer: white, conditions: THROTTLED, expect: "unchanged" },
  { name: "imperceptible difference stays silent", key: "a", buffer: offWhite, conditions: THROTTLED, expect: "unchanged" },
  { name: "changed page is reported", key: "a", buffer: red, conditions: THROTTLED, expect: "changed" },
  { name: "resized page is reported", key: "a", buffer: tall, conditions: THROTTLED, expect: "size-changed" },
  { name: "mismatched conditions are skipped, not failed", key: "a", buffer: red, conditions: UNTHROTTLED, expect: "conditions-differ" },
  { name: "--update-baseline re-records", key: "a", buffer: red, conditions: THROTTLED, expect: "updated", updateBaseline: true },
];

for (const testCase of VISUAL_CASES) {
  const result = await compareVisual({ ...dirs, ...testCase });
  if (result.status === testCase.expect) {
    console.log(`ok    ${testCase.name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${testCase.name}`);
    console.log(`        expected status "${testCase.expect}", got "${result.status}"`);
  }
}

await rm(tmp, { recursive: true, force: true });

// --- known-issue ratchet ---------------------------------------------------
// The ratchet must forgive what was already broken and still catch what breaks
// next. Both halves are load-bearing: forgive too much and the gate is decor.

const a11yTwo = { level: "error", check: "a11y", message: "2 blocking accessibility violation(s)", details: [{ rule: "color-contrast" }, { rule: "link-name" }] };
const a11yThree = { level: "error", check: "a11y", message: "3 blocking accessibility violation(s)", details: [{ rule: "color-contrast" }, { rule: "link-name" }, { rule: "aria-alt" }] };
const lcpSlow = { level: "error", check: "web-vitals", message: "LCP 12624ms is poor (good \u2264 2500)" };
const lcpSlower = { level: "error", check: "web-vitals", message: "LCP 13901ms is poor (good \u2264 2500)" };

const onePage = (findings) => [{ path: "/", viewport: "mobile", findings }];
const baseline = [entryOf("/", "mobile", a11yTwo), entryOf("/", "mobile", lcpSlow)];

const RATCHET_CASES = [
  {
    name: "recorded issue does not fail the build",
    results: onePage([a11yTwo]),
    expect: { unexpected: 0, known: 1 },
  },
  {
    name: "same metric, different measurement, still known",
    results: onePage([lcpSlower]),
    expect: { unexpected: 0, known: 1 },
  },
  {
    name: "an additional axe rule is caught",
    results: onePage([a11yThree]),
    expect: { unexpected: 1, known: 0 },
  },
  {
    name: "an unrecorded check is caught",
    results: onePage([{ level: "error", check: "click-blocked", message: "1 interactive element(s) are covered" }]),
    expect: { unexpected: 1, known: 0 },
  },
  {
    name: "fixing one of two rules is not punished",
    results: onePage([{ level: "error", check: "a11y", message: "1 blocking accessibility violation(s)", details: [{ rule: "color-contrast" }] }]),
    expect: { unexpected: 0, known: 1 },
  },
  {
    name: "warnings are never ratcheted",
    results: onePage([{ level: "warning", check: "tap-target", message: "3 tap target(s) smaller than 44px" }]),
    expect: { unexpected: 0, known: 0 },
  },
];

for (const testCase of RATCHET_CASES) {
  const { unexpected, known } = partitionKnown(testCase.results, baseline);
  if (unexpected.length === testCase.expect.unexpected && known.length === testCase.expect.known) {
    console.log(`ok    ${testCase.name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${testCase.name}`);
    console.log(`        expected ${testCase.expect.unexpected} new / ${testCase.expect.known} known,`
      + ` got ${unexpected.length} new / ${known.length} known`);
  }
}

// --- render-blocking detection ---------------------------------------------
// This check reads the delivered HTML rather than the live DOM, because the
// very pattern that stops a stylesheet blocking — preload plus an onload that
// flips rel to "stylesheet" — leaves the DOM looking like it blocked. It also
// has to ignore the <noscript> fallback that pairs with it, which is a plain
// stylesheet link that only applies when scripts are off.

const ORIGIN = "https://x.test";
const BLOCKING_CASES = [
  { name: "plain third-party stylesheet blocks", html: `<link rel="stylesheet" href="https://cdn.test/a.css">`, expect: 1 },
  { name: "synchronous third-party script blocks", html: `<script src="https://cdn.test/a.js"></script>`, expect: 1 },
  { name: "preload with onload swap does not", html: `<link rel="preload" as="style" href="https://cdn.test/a.css" onload="this.rel='stylesheet'">`, expect: 0 },
  { name: "media=print does not", html: `<link rel="stylesheet" media="print" href="https://cdn.test/a.css">`, expect: 0 },
  { name: "async script does not", html: `<script async src="https://cdn.test/a.js"></script>`, expect: 0 },
  { name: "same-origin stylesheet is not third-party", html: `<link rel="stylesheet" href="https://x.test/a.css">`, expect: 0 },
  { name: "noscript fallback is not counted", html: `<link rel="preload" as="style" href="https://cdn.test/a.css"><noscript><link rel="stylesheet" href="https://cdn.test/a.css"></noscript>`, expect: 0 },
  { name: "a real blocker outside noscript still counts", html: `<noscript><link rel="stylesheet" href="https://cdn.test/a.css"></noscript><link rel="stylesheet" href="https://cdn.test/b.css">`, expect: 1 },
];

for (const testCase of BLOCKING_CASES) {
  const found = findRenderBlocking(testCase.html, ORIGIN).length;
  if (found === testCase.expect) {
    console.log(`ok    ${testCase.name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${testCase.name}`);
    console.log(`        expected ${testCase.expect}, got ${found}`);
  }
}

const total = FIXTURES.length + INP_CASES.length + VISUAL_CASES.length + RATCHET_CASES.length + BLOCKING_CASES.length;
console.log(failures ? `\n${failures} check(s) failed` : `\nAll ${total} checks passed`);
process.exit(failures ? 1 : 0);
