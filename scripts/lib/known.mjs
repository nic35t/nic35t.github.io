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
 *
 * Fixing something is not punished — a known issue that stops occurring simply
 * stops matching. Re-record to drop it from the list for good.
 */

import { readFile, writeFile } from "node:fs/promises";

/**
 * Findings carry live measurements (`LCP 12624ms is poor`), so matching on the
 * literal message would make every run a new issue. Numbers collapse to `#`,
 * leaving the shape of the problem as the identity.
 */
export function signature(pagePath, viewport, finding) {
  const shape = finding.message.replace(/\d+(\.\d+)?/g, "#");
  return `${finding.check}|${pagePath}|${viewport}|${shape}${identity(finding)}`;
}

/**
 * Collapsing numbers is right for a measurement but wrong for a count: an axe
 * message reads "2 blocking violations", so on its own a jump from 2 to 20
 * would keep matching and the new rule would pass unnoticed. Where a finding
 * names what is wrong, that goes in the signature instead.
 */
function identity(finding) {
  if (!finding.details) return "";
  const details = [].concat(finding.details);
  const rules = details.map((d) => d && d.rule).filter(Boolean);
  if (rules.length) return `|rules=${[...new Set(rules)].sort().join(",")}`;
  return "";
}

export async function loadKnown(file) {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return new Set(parsed.signatures ?? []);
  } catch {
    return new Set();
  }
}

export function partitionKnown(results, knownSignatures) {
  const unexpected = [];
  const known = [];
  for (const result of results) {
    for (const finding of result.findings) {
      if (finding.level !== "error") continue;
      const target = knownSignatures.has(signature(result.path, result.viewport, finding))
        ? known
        : unexpected;
      target.push(finding);
    }
  }
  return { unexpected, known };
}

export async function writeKnown(file, results) {
  const signatures = [];
  for (const result of results) {
    for (const finding of result.findings) {
      if (finding.level !== "error") continue;
      signatures.push(signature(result.path, result.viewport, finding));
    }
  }
  const payload = {
    note: "Errors already present when the gate was introduced. Regenerate with --update-known after fixing some.",
    recorded: new Date().toISOString().slice(0, 10),
    signatures: [...new Set(signatures)].sort(),
  };
  await writeFile(file, JSON.stringify(payload, null, 2) + "\n");
}
