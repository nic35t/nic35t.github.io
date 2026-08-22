/**
 * Known-issue ratchet.
 *
 * Turning a quality gate on over an existing site means it fails on day one
 * and keeps failing, and a permanently red build is one everybody learns to
 * scroll past. Recording today's failures lets the gate do the only job that
 * matters day to day: catching the thing that broke since.
 *
 *   node scripts/diagnose.mjs --known known-issues.json --update-known
 *   node scripts/diagnose.mjs --known known-issues.json
 */

import { readFile, writeFile } from "node:fs/promises";

/**
 * Findings carry live measurements (`LCP 12624ms is poor`), so matching on the
 * literal message would make every run a new issue. Numbers collapse to `#`,
 * leaving the shape of the problem as the identity.
 */
function shapeOf(finding) {
  return finding.message.replace(/\d+(\.\d+)?/g, "#");
}

/**
 * Where a finding names what is wrong — axe reports the rules it violated —
 * those names are part of the identity. Collapsing the count alone would let
 * "2 blocking violations" become 20 without the gate noticing.
 */
function rulesOf(finding) {
  if (!finding.details) return [];
  const rules = [].concat(finding.details).map((d) => d && d.rule).filter(Boolean);
  return [...new Set(rules)].sort();
}

export function entryOf(pagePath, viewport, finding) {
  return {
    check: finding.check,
    path: pagePath,
    viewport,
    shape: shapeOf(finding),
    rules: rulesOf(finding),
  };
}

/** Stable text form, used for de-duplicating the recorded list. */
export function signature(pagePath, viewport, finding) {
  const e = entryOf(pagePath, viewport, finding);
  return `${e.check}|${e.path}|${e.viewport}|${e.shape}${e.rules.length ? `|rules=${e.rules.join(",")}` : ""}`;
}

/**
 * A finding is already known when a recorded entry covers it. Coverage is
 * subset, not equality: fixing one of two axe rules leaves a finding whose
 * rules are a subset of what was recorded, and failing the build for that
 * would punish the fix. Adding a rule is not a subset, so it still fails.
 */
function isCovered(entry, recorded) {
  return recorded.some(
    (r) =>
      r.check === entry.check &&
      r.path === entry.path &&
      r.viewport === entry.viewport &&
      r.shape === entry.shape &&
      entry.rules.every((rule) => r.rules.includes(rule))
  );
}

export async function loadKnown(file) {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return parsed.issues ?? [];
  } catch {
    return [];
  }
}

export function partitionKnown(results, recorded) {
  const unexpected = [];
  const known = [];
  for (const result of results) {
    for (const finding of result.findings) {
      if (finding.level !== "error") continue;
      const entry = entryOf(result.path, result.viewport, finding);
      (isCovered(entry, recorded) ? known : unexpected).push(finding);
    }
  }
  return { unexpected, known };
}

export async function writeKnown(file, results) {
  const seen = new Map();
  for (const result of results) {
    for (const finding of result.findings) {
      if (finding.level !== "error") continue;
      seen.set(signature(result.path, result.viewport, finding), entryOf(result.path, result.viewport, finding));
    }
  }
  const issues = [...seen.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, entry]) => entry);
  const payload = {
    note: "Errors already present when the gate was introduced. Regenerate with --update-known after fixing some.",
    recorded: new Date().toISOString().slice(0, 10),
    issues,
  };
  await writeFile(file, JSON.stringify(payload, null, 2) + "\n");
}
