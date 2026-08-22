#!/usr/bin/env node
/**
 * Tests the diagnostic itself against fixtures with known-good and known-bad
 * layouts. A checker tuned until it reports nothing is worse than no checker,
 * so every heuristic gets a case that must fire and a case that must not.
 *
 *   node scripts/selftest.mjs
 */

import { chromium } from "playwright";
import { AUDIT, MIN_TAP_TARGET } from "./diagnose.mjs";

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

await browser.close();

console.log(failures ? `\n${failures} fixture(s) failed` : `\nAll ${FIXTURES.length} fixtures passed`);
process.exit(failures ? 1 : 0);
