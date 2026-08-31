#!/usr/bin/env node
/**
 * Extracts the CSS needed to paint the top of the page, so the full stylesheet
 * no longer has to arrive before anything renders.
 *
 *   node scripts/critical-css.mjs [--url http://127.0.0.1:4000]
 *
 * Writes _includes/head/critical-css.html, which head.html inlines.
 *
 * The rules are chosen by asking the browser, not by guessing: every rule in
 * the compiled stylesheet is tested against the live DOM, and kept if anything
 * it matches sits inside the first viewport. That runs over several pages and
 * two widths, and the results are unioned — a blog's templates differ enough
 * that critical CSS taken from the home page alone leaves an article unstyled.
 *
 * Regenerate whenever the styles change: `npm run critical`. The visual
 * regression baselines will catch it if you forget.
 */

import { chromium } from "playwright";
import { writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { glob } from "node:fs/promises";

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) =>
    a.startsWith("--") ? [[a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]] : []
  )
);

const BASE_URL = (args.url ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const OUT = "_includes/head/critical-css.html";

/** Representative of every template the site actually uses. */
const PAGES = [
  "/",
  "/tags/",
  "/categories/",
  "/investment-test/",
  "/business%20strategy/AI-Business-Planning-Havruta-Method/",
];

const VIEWPORTS = [
  { width: 375, height: 667 },
  { width: 1440, height: 900 },
];

/**
 * Runs in the page. Walks the real CSSOM rather than parsing text, so nesting,
 * media queries and shorthand all come back exactly as the browser understands
 * them.
 */
const EXTRACT = () => {
  const keep = new Set();

  // Rules that must survive regardless of what they match: they set up the
  // page's own surface, and dropping them causes a flash of unstyled or
  // wrongly-coloured background before the real sheet lands.
  const ALWAYS = /^(:root|html|body|\*|::?selection|\*::?before|\*::?after)\b/;

  // Layout containers are forced in wherever they sit. They decide which column
  // something lands in, so a missing one does not merely look unstyled — it
  // puts content in the wrong place until the real sheet arrives. The related-
  // posts block was flowing into the author sidebar on articles for exactly
  // this reason: its rules live far below the fold in the styled page, so
  // position-based selection never reached them.
  const FORCE = /(^|[\s,>+~])(#main|\.page__related|\.page__footer|\.page__content|\.page__inner-wrap|\.page__hero|\.sidebar|\.archive|\.initial-content|\.layout--|\.entries-|\.taxonomy__)/;

  // Reach past the fold. Content just below it is unstyled at first paint and
  // then jumps into place when the real sheet lands — on an article that showed
  // up as the related-posts block briefly flowing into the sidebar. Half a
  // screen of margin costs a little size and removes the reflow.
  const CUTOFF = window.innerHeight * 1.5;

  const inViewport = (selector) => {
    let nodes;
    try {
      nodes = document.querySelectorAll(selector);
    } catch {
      // Vendor pseudo-elements and the like cannot be queried. Keeping them is
      // cheap; dropping something load-bearing is not.
      return true;
    }
    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      if (rect.top < CUTOFF && rect.bottom > -1 && rect.width > 0) return true;
    }
    return false;
  };

  const visit = (rules, wrapper) => {
    for (const rule of rules) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const selector = rule.selectorText;
        if (!selector) continue;
        // A selector list is kept whole if any part of it qualifies; splitting
        // it would change specificity ordering.
        const parts = selector.split(",").map((s) => s.trim());
        if (parts.some((p) => ALWAYS.test(p) || FORCE.test(p)) || parts.some(inViewport)) {
          keep.add(wrapper ? `${wrapper}{${rule.cssText}}` : rule.cssText);
        }
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        // Only media queries that currently apply can affect this paint.
        if (!window.matchMedia(rule.conditionText).matches) continue;
        visit(rule.cssRules, `@media ${rule.conditionText}`);
      } else if (rule.type === CSSRule.SUPPORTS_RULE) {
        visit(rule.cssRules, `@supports ${rule.conditionText}`);
      } else if (rule.type === CSSRule.FONT_FACE_RULE) {
        keep.add(rule.cssText);
      }
    }
  };

  for (const sheet of document.styleSheets) {
    // Only this site's own stylesheet. The earlier form of this test skipped a
    // sheet when its href pointed elsewhere, which let every inline <style>
    // through, since those have no href at all. Two things rode in that way:
    // the previous critical block, re-collected from the page it was inlined
    // into, and the investment-test quiz's page-local styles, which then
    // shipped inside the critical CSS of every other page on the site.
    if (!sheet.href || !sheet.href.includes("/assets/css/main.css")) continue;
    try {
      visit(sheet.cssRules, null);
    } catch {
      // Cross-origin sheet, nothing readable.
    }
  }

  return [...keep];
};

const browser = await chromium.launch();
const collected = new Set();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  for (const path of PAGES) {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle", timeout: 30000 });
      for (const rule of await page.evaluate(EXTRACT)) collected.add(rule);
    } catch (err) {
      console.error(`  ! ${path} @${viewport.width}: ${err.message}`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();

// Light minification. The stylesheet is already Sass-compressed, so cssText is
// tidy; this only removes the joins.
const css = [...collected].join("").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}");

// The inlined copy silently goes stale if someone edits the styles and forgets
// to regenerate — nothing in the final rendering changes, so visual regression
// cannot see it; only the flash before main.css lands is wrong. Fingerprinting
// the sources lets `doctor` say so. A content hash rather than a timestamp,
// because git does not preserve mtimes.
const sources = [];
for await (const file of glob("_sass/**/*.scss")) sources.push(file);
sources.push("assets/css/main.scss");
sources.sort();

const hash = createHash("sha256");
for (const file of sources) hash.update(await readFile(file));
const fingerprint = hash.digest("hex").slice(0, 16);

const banner = `{%- comment -%}
  GENERATED — do not edit. Regenerate with \`npm run critical\`.
  sources-sha256: ${fingerprint}

  Above-the-fold CSS, inlined so first paint does not wait on a network round
  trip for the full stylesheet. Extracted by scripts/critical-css.mjs, which
  tests every rule in main.css against the live DOM across the site's templates
  at mobile and desktop widths and keeps what lands in the first viewport.
{%- endcomment -%}
<style>${css}</style>
`;

await writeFile(OUT, banner);
console.log(`\n${collected.size} rules → ${OUT} (${Math.round(css.length / 1024)}KB inlined)`);
