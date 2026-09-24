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
 * three device contexts (a touch phone, a tablet, a desktop), and the results
 * are unioned — a blog's templates differ enough that critical CSS taken from
 * the home page alone leaves an article unstyled.
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
  // A category landing (layout: category, the four topic pages the nav links
  // to) is the one template none of the pages above renders. The redesign
  // gives it its own header and tile grid (spec 4.6), and a rule only this
  // template matches can only be collected from a page that has it.
  "/categories/ai/",
  // Home pages 2..N share the home layout but not its hero: they open straight
  // on the wide tile band (.home-posts__page), which page 1 never renders. Left
  // out, /page2/ painted unstyled tiles and jumped when main.css landed (CLS
  // 0.36 at 768).
  "/page2/",
];

// Three device contexts. The phone is a real touch device (isMobile honours the
// viewport meta, hasTouch makes `pointer: coarse` and `hover: none` match), so
// the touch-only rules that decide first-paint sizes (the 44px TOC rows) are
// collected; a 375px desktop window never matched them. 768 is the tablet step
// (spec 3.1 `tablet-up`): the nav turns inline and grids go 2-up there, and a
// rule scoped to the 768-1023 band, or an element only shown in it, was never
// seen by a pass at 375 or 1440.
const CONTEXTS = [
  { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true },
  { viewport: { width: 768, height: 1024 } },
  { viewport: { width: 1440, height: 900 } },
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
  //
  // The redesign (spec 7.5 u0) replaced most of those containers, and forcing
  // whole families pushed the block past its 40KB budget, so the list is
  // pruned and then extended:
  //  - Retired: .page__related, .page__inner-wrap, .page__hero, .sidebar and
  //    .entries-* (the author rail, the old related grid and the hero are gone;
  //    their replacements are listed below or picked by position). The one
  //    exception, .page__related while a page still renders it, is below.
  //  - Narrowed: `.archive` only as the bare container or `.archive-header`,
  //    not every `.archive__item-*`; `.page__content` only as the bare
  //    container (optionally with an attribute, `[itemprop=text]`), so the
  //    ~100 prose and Rouge rules under it are picked by position like any
  //    other; `.taxonomy__` only for the section and index wrappers.
  //  - Added: the new layout primitives and the chrome every page paints at
  //    the top (nav, masthead, toggle, home header and hero, chip rows, tile
  //    grids, the post shell, header, byline and both TOC forms), plus the
  //    `hidden` utilities, which must hide things from the first frame rather
  //    than after main.css lands.
  //  - Deliberately NOT forced: below-the-fold families (.post-related,
  //    .post-pager, .author-card, .footer-, .home-series, .home-posts). The
  //    1.5-viewport cutoff already picks them up where they are visible.
  const FORCE = new RegExp(
    "(^|[\\s,>+~])(" +
      [
        "#main", "\\.page__footer", "\\.initial-content", "\\.layout--",
        "\\.archive(?![_-])", "\\.archive-header",
        "\\.page__content(\\[[^\\]]*\\])?$",
        "\\.taxonomy__(section|index)\\b",
        "\\.l-container", "\\.l-band", "\\.l-section",
        "\\.masthead", "\\.site-nav", "\\.site-title", "\\.site-logo", "\\.theme-toggle",
        "\\.home-intro", "\\.home-topics", "\\.home-hero",
        "\\.chip-row", "\\.tile-grid",
        "\\.post-shell", "\\.post-header", "\\.post-byline", "\\.toc-rail", "\\.toc-disclosure",
        "\\.hidden\\b", "\\[hidden\\]",
      ].join("|") +
      ")"
  );

  // One retired family is still forced, but only on a page that renders it.
  // The legacy article floats its whole body (.page__inner-wrap) and relies on
  // .page__related, far below the fold, to clear that float. Unstyled, the
  // related block sits in normal flow at the top of #main, its heading margin
  // collapses through #main and pushes the floated article down 34px; when
  // main.css lands everything jumps back (throttled CLS 0.8-0.9 on every
  // post). Keyed to the markup, so once the redesigned article (u4) stops
  // rendering .page__related, nothing is forced and the prune above holds.
  const FORCE_WHILE_RENDERED = document.querySelector(".page__related")
    ? /(^|[\s,>+~])\.page__related/
    : null;

  // Reach past the fold. Content just below it is unstyled at first paint and
  // then jumps into place when the real sheet lands — on an article that showed
  // up as the related-posts block briefly flowing into the sidebar. Half a
  // screen of margin costs a little size and removes the reflow.
  const CUTOFF = window.innerHeight * 1.5;

  // A pseudo-element is tested through the element that generates it.
  // querySelectorAll() matches nothing for `.x::after` (it neither throws nor
  // matches), so every ::before/::after rule used to be dropped unless FORCE
  // happened to cover its class. The clearfixes are the ones that bite: without
  // `.sidebar::after { clear: both }` the author card's float spilled and moved
  // everything below it 16-32px when main.css landed. Pruning FORCE exposed
  // this, so position now decides for pseudo-elements too.
  const PSEUDO_ELEMENT = /::?(before|after|marker|placeholder|selection|backdrop|first-line|first-letter|file-selector-button|-webkit-[\w-]+|-moz-[\w-]+)(\([^)]*\))?/g;

  const inViewport = (selector) => {
    let nodes;
    try {
      nodes = document.querySelectorAll(selector.replace(PSEUDO_ELEMENT, "") || "*");
    } catch {
      // Vendor pseudo-elements and the like cannot be queried. Keeping them is
      // cheap; dropping something load-bearing is not.
      return true;
    }
    for (const node of nodes) {
      // An element this width hides (display: none) has no box, so the rule
      // that hides it used to be dropped, and the element showed at first
      // paint until main.css hid it again: the author card's "Follow" button
      // pushed the links below it down 44px at 1440. It is placed by its
      // nearest ancestor that has a box instead.
      let box = node;
      let rect = box.getBoundingClientRect();
      while (rect.width === 0 && rect.height === 0 && box.parentElement) {
        box = box.parentElement;
        rect = box.getBoundingClientRect();
      }
      if (rect.top < CUTOFF && rect.bottom > -1 && rect.width > 0) return true;
    }
    return false;
  };

  // `wrappers` is the chain of at-rule preludes a rule sits in, outermost
  // first. It used to be a single string that each level replaced, so a rule
  // in `@supports (…) { @media (…) { … } }` came out wrapped in the @media
  // only: its @supports guard was lost and it applied in browsers the guard
  // was there to exclude. Composing the chain keeps every level.
  const wrap = (css, wrappers) => wrappers.reduceRight((inner, w) => `${w}{${inner}}`, css);

  const visit = (rules, wrappers) => {
    for (const rule of rules) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const selector = rule.selectorText;
        if (!selector) continue;
        // A selector list is kept whole if any part of it qualifies; splitting
        // it would change specificity ordering.
        const parts = selector.split(",").map((s) => s.trim());
        const forced = (p) => ALWAYS.test(p) || FORCE.test(p) || (FORCE_WHILE_RENDERED && FORCE_WHILE_RENDERED.test(p));
        if (parts.some(forced) || parts.some(inViewport)) {
          keep.add(wrap(rule.cssText, wrappers));
        }
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        // Only media queries that currently apply can affect this paint, with
        // one exception: the colour scheme. The extractor runs in a light
        // browser, so a `prefers-color-scheme: dark` block never matched and
        // OS-dark readers got a white first paint (tokens, body, masthead)
        // until main.css landed. Those blocks are kept whatever the extractor's
        // own scheme; the browser still applies them only when they match.
        if (!window.matchMedia(rule.conditionText).matches && !/prefers-color-scheme/.test(rule.conditionText)) continue;
        visit(rule.cssRules, [...wrappers, `@media ${rule.conditionText}`]);
      } else if (rule.type === CSSRule.SUPPORTS_RULE) {
        visit(rule.cssRules, [...wrappers, `@supports ${rule.conditionText}`]);
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
      visit(sheet.cssRules, []);
    } catch {
      // Cross-origin sheet, nothing readable.
    }
  }

  return [...keep];
};

const browser = await chromium.launch();
const collected = new Set();

for (const options of CONTEXTS) {
  const { viewport } = options;
  const context = await browser.newContext({ ...options, deviceScaleFactor: 1 });
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
// tidy; this only removes the joins. Whitespace BEFORE a colon is kept: there
// it is a descendant combinator, and `@include dark-mode` inside a pseudo-class
// rule prints exactly that (`:root:not(...) :focus-visible`). Eating it turned
// the rule into `:root:not(...):focus-visible`, which matches only <html>.
const css = [...collected].join("").replace(/\s*([{};,])\s*/g, "$1").replace(/:\s+/g, ":").replace(/;}/g, "}");

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
  on a touch phone, a tablet and a desktop and keeps what lands in the first
  viewport.
{%- endcomment -%}
<style>${css}</style>
`;

await writeFile(OUT, banner);
console.log(`\n${collected.size} rules → ${OUT} (${Math.round(css.length / 1024)}KB inlined)`);
