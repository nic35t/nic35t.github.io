/**
 * Accessibility audit via axe-core.
 *
 * Replaces hand-rolled guesses with the same rule engine Lighthouse and most
 * CI accessibility gates run. Scoped to WCAG 2.2 AA, the level most public
 * sites are now held to.
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

let axeSource = null;

async function loadAxe() {
  if (axeSource) return axeSource;
  axeSource = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
  return axeSource;
}

/**
 * axe grades findings critical > serious > moderate > minor. The top two are
 * things that block a user outright, so they fail the run; the rest are
 * reported without failing it.
 */
const BLOCKING = new Set(["critical", "serious"]);

export async function runAxe(page) {
  // `content-visibility: auto` lets the browser skip rendering off-screen
  // sections, and while a subtree is skipped Chromium reports stale computed
  // styles for it. axe then reports colour-contrast failures for colours the
  // reader never sees — on /tags/ that was 3 phantom findings, all of which
  // resolve correctly the moment the section is scrolled into view.
  //
  // Forcing everything to render gives axe the values that actually apply.
  const marker = await page.evaluate(() => {
    const style = document.createElement("style");
    style.id = "axe-force-render";
    style.textContent = "*{content-visibility:visible !important;contain-intrinsic-size:auto !important}";
    document.head.appendChild(style);
    return style.id;
  });
  // One frame for the forced layout to settle before anything is measured.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

  await page.evaluate(await loadAxe());

  const results = await page.evaluate(async (tags) => {
    const run = await window.axe.run(document, {
      runOnly: { type: "tag", values: tags },
      resultTypes: ["violations"],
    });
    return run.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.slice(0, 3).map((n) => ({
        target: n.target.join(" "),
        summary: (n.failureSummary || "").split("\n").slice(1).join(" ").trim().slice(0, 160),
      })),
      total: v.nodes.length,
    }));
  }, WCAG_TAGS);

  await page.evaluate((id) => {
    const style = document.getElementById(id);
    if (style) style.remove();
  }, marker);

  return results;
}

export function toFindings(violations) {
  const blocking = violations.filter((v) => BLOCKING.has(v.impact));
  const advisory = violations.filter((v) => !BLOCKING.has(v.impact));
  const findings = [];

  if (blocking.length) {
    findings.push({
      level: "error",
      check: "a11y",
      message: `${blocking.length} blocking accessibility violation(s) (WCAG 2.2 AA)`,
      details: blocking.map((v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        elements: v.total,
        example: v.nodes[0]?.target,
      })),
    });
  }
  if (advisory.length) {
    findings.push({
      level: "warning",
      check: "a11y-advisory",
      message: `${advisory.length} moderate/minor accessibility issue(s)`,
      details: advisory.map((v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        elements: v.total,
      })),
    });
  }
  return findings;
}
