/**
 * Visual regression: compare each screenshot against a stored baseline.
 *
 * This repo's history is a run of UI fixes followed by reverts. A pixel
 * baseline is what turns "I think that looks right" into a yes or no, and it
 * catches the change you did not intend alongside the one you did.
 *
 *   scripts/diagnose.mjs --update-baseline   # accept current state as truth
 *   scripts/diagnose.mjs                     # compare against it
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/** Anti-aliasing and sub-pixel text rendering jitter between runs. */
const PIXEL_THRESHOLD = 0.15;
/** Below this share of changed pixels, treat the page as unchanged. */
const DIFF_TOLERANCE = 0.001;

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/**
 * A screenshot only means something next to one taken the same way. Throttled
 * and unthrottled runs of the same unchanged page differ by ~9% of pixels, so
 * comparing across profiles reports a regression that is not there — and a
 * check that cries wolf is a check people learn to ignore. The conditions are
 * recorded alongside the image and a mismatch asks for a re-baseline instead.
 */
async function readManifest(baselineDir) {
  try {
    return JSON.parse(await readFile(path.join(baselineDir, "manifest.json"), "utf8"));
  } catch {
    return {};
  }
}

async function writeManifest(baselineDir, manifest) {
  await writeFile(path.join(baselineDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}

function describeConditions(c) {
  // Platform is part of the identity: font rasterisation differs between a
  // local container and a CI runner, so the same page renders different pixels
  // on each. Without this the first CI run would flag every page as changed.
  return `${c.platform ?? "unknown"} ${c.width}x${c.height} dpr${c.dpr} ${c.throttled ? "throttled" : "unthrottled"}`;
}

export async function compare({ baselineDir, diffDir, key, buffer, updateBaseline, conditions }) {
  const baselinePath = path.join(baselineDir, `${key}.png`);
  await mkdir(baselineDir, { recursive: true });

  const manifest = await readManifest(baselineDir);

  if (updateBaseline || !(await exists(baselinePath))) {
    await writeFile(baselinePath, buffer);
    manifest[key] = conditions;
    await writeManifest(baselineDir, manifest);
    return { status: updateBaseline ? "updated" : "created", ratio: 0 };
  }

  const recorded = manifest[key];
  if (recorded && describeConditions(recorded) !== describeConditions(conditions)) {
    return {
      status: "conditions-differ",
      ratio: 0,
      note: `baseline captured as ${describeConditions(recorded)}, this run is ${describeConditions(conditions)}`,
    };
  }

  const baseline = PNG.sync.read(await readFile(baselinePath));
  const current = PNG.sync.read(buffer);

  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      status: "size-changed",
      ratio: 1,
      note: `${baseline.width}x${baseline.height} → ${current.width}x${current.height}`,
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const changed = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: PIXEL_THRESHOLD }
  );

  const ratio = changed / (baseline.width * baseline.height);
  if (ratio <= DIFF_TOLERANCE) return { status: "unchanged", ratio };

  await mkdir(diffDir, { recursive: true });
  await writeFile(path.join(diffDir, `${key}.png`), PNG.sync.write(diff));
  return { status: "changed", ratio, changedPixels: changed };
}

export function toFinding(key, result) {
  if (result.status === "unchanged" || result.status === "created" || result.status === "updated") {
    return null;
  }
  if (result.status === "conditions-differ") {
    return {
      level: "warning",
      check: "visual-regression",
      message: "skipped — baseline was captured under different conditions",
      details: [result.note, "re-run with --update-baseline to re-record under this profile"],
    };
  }
  const percent = (result.ratio * 100).toFixed(2);
  return {
    level: "warning",
    check: "visual-regression",
    message:
      result.status === "size-changed"
        ? `page dimensions changed (${result.note})`
        : `${percent}% of pixels changed against the baseline`,
    details: [`diff image: visual/diff/${key}.png`],
  };
}
