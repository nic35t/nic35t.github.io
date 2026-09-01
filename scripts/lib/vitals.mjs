/**
 * Core Web Vitals measurement.
 *
 * The three metrics Google ranks on as of 2024: LCP, CLS and INP (INP replaced
 * FID in March 2024). FCP and TTFB come along as diagnostics — they explain a
 * bad LCP rather than being targets in themselves.
 *
 * Thresholds are the official "good / needs improvement / poor" boundaries.
 */

export const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000, unit: "ms", label: "Largest Contentful Paint" },
  CLS: { good: 0.1, poor: 0.25, unit: "", label: "Cumulative Layout Shift" },
  INP: { good: 200, poor: 500, unit: "ms", label: "Interaction to Next Paint" },
  FCP: { good: 1800, poor: 3000, unit: "ms", label: "First Contentful Paint" },
  TTFB: { good: 800, poor: 1800, unit: "ms", label: "Time to First Byte" },
};

/**
 * Slow 4G with a 4x CPU slowdown — the profile Lighthouse uses for its mobile
 * runs. Without it every metric measured against localhost looks perfect and
 * the numbers mean nothing.
 */
export const SLOW_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};
export const CPU_SLOWDOWN = 4;

export function rate(metric, value) {
  const t = THRESHOLDS[metric];
  if (!t || value == null) return "unknown";
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}

/**
 * Installed via addInitScript so the observers are running before the document
 * starts painting — registering them after load would miss every entry.
 */
export const COLLECTOR = () => {
  window.__vitals = { lcp: null, cls: 0, fcp: null, shifts: [], longTasks: 0, interactions: {} };

  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // The last LCP candidate wins; earlier ones are superseded.
      window.__vitals.lcp = entries[entries.length - 1].startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue; // user-initiated shifts do not count
        window.__vitals.shifts.push({ value: entry.value, time: entry.startTime });
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") window.__vitals.fcp = entry.startTime;
      }
    }).observe({ type: "paint", buffered: true });
  } catch {}

  // INP is defined over *interactions* — a click, a tap, a key press — not over
  // every timed event. An entry only belongs to an interaction when the browser
  // gives it an interactionId; hovering does not get one.
  //
  // Taking the widest entry regardless of that was measuring the wrong thing
  // entirely. The first time a mouse enters the page the browser does a hover
  // hit-test and style recalc, and under a 4x CPU throttle that pointerover ran
  // 368ms. That number was being reported as INP on a page where nothing had
  // been clicked at all.
  //
  // Latency for one interaction is the longest of the events sharing its id
  // (pointerdown, pointerup and click are one interaction, not three).
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.interactionId) continue;
        const seen = window.__vitals.interactions[entry.interactionId] ?? 0;
        window.__vitals.interactions[entry.interactionId] = Math.max(seen, entry.duration);
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      window.__vitals.longTasks += list.getEntries().length;
    }).observe({ type: "longtask", buffered: true });
  } catch {}
};

/**
 * CLS is not a plain sum. It is the largest "session window": shifts group
 * together while they are within 1s of each other and the window is under 5s,
 * and the score is the worst window, not the total.
 */
export const READ_VITALS = () => {
  const v = window.__vitals ?? { shifts: [] };

  let cls = 0;
  let windowValue = 0;
  let windowStart = 0;
  let windowLast = 0;

  for (const shift of v.shifts) {
    if (windowValue && (shift.time - windowLast > 1000 || shift.time - windowStart > 5000)) {
      cls = Math.max(cls, windowValue);
      windowValue = 0;
    }
    if (!windowValue) windowStart = shift.time;
    windowLast = shift.time;
    windowValue += shift.value;
  }
  cls = Math.max(cls, windowValue);

  const nav = performance.getEntriesByType("navigation")[0];

  // With fewer than 50 interactions the metric is the worst one; the 98th
  // percentile rule only starts discarding outliers above that. Nothing here
  // drives a page anywhere near 50, but the rule is cheap to state correctly.
  const latencies = Object.values(v.interactions ?? {}).sort((a, b) => b - a);
  const inp = latencies.length
    ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length / 50))]
    : null;

  return {
    LCP: v.lcp == null ? null : Math.round(v.lcp),
    CLS: Math.round(cls * 1000) / 1000,
    INP: inp == null ? null : Math.round(inp),
    interactionCount: latencies.length,
    FCP: v.fcp == null ? null : Math.round(v.fcp),
    TTFB: nav ? Math.round(nav.responseStart) : null,
    longTasks: v.longTasks,
    shiftCount: v.shifts.length,
    transferBytes: performance.getEntriesByType("resource").reduce((sum, r) => sum + (r.transferSize || 0), 0),
    heaviest: performance
      .getEntriesByType("resource")
      .filter((r) => (r.transferSize || 0) > 0)
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 6)
      .map((r) => ({
        url: r.name.replace(location.origin, "").slice(0, 80),
        kb: Math.round(r.transferSize / 1024),
        type: r.initiatorType,
      })),
  };
};

/**
 * Page-weight budget. A blog article page has no business shipping megabytes;
 * these are the mobile figures most performance budgets settle around.
 */
export const WEIGHT_BUDGET_KB = 1500;

/**
 * INP needs real interactions to have anything to measure, so drive a few of
 * the page's own controls and let the event observer time them.
 */
export async function exerciseInteractions(page) {
  // Real clicks, not trial ones. The previous version used Playwright's
  // `trial: true`, which runs the actionability checks and then does not
  // dispatch anything — so no interaction ever happened and INP had nothing to
  // measure. That was invisible because the observer was reading hover events.
  //
  // Real clicks change the page, which is why this now runs after the
  // accessibility audit and the screenshots rather than before them.
  //
  // Buttons only, and never an anchor: activating a link navigates, and the
  // audit would then be measuring a different page.
  let driven = 0;
  const buttons = await page.$$("button:visible, [role='button']:visible");
  for (const button of buttons.slice(0, 3)) {
    try {
      await button.click({ timeout: 1000 });
      driven += 1;
      await page.waitForTimeout(120);
    } catch {
      // A control that cannot be driven is the click-blocked check's problem.
    }
  }

  // Keyboard interactions count too, and Tab is the one key that is guaranteed
  // to do nothing but move focus — no page here binds it.
  for (let i = 0; i < 3; i += 1) {
    await page.keyboard.press("Tab");
    driven += 1;
    await page.waitForTimeout(80);
  }

  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);

  // How many interactions were actually dispatched. The observer cannot stand
  // in for this: `durationThreshold` is clamped to a 16ms floor by the event
  // timing spec, so an interaction faster than that produces no entry at all.
  // Without this count a null INP is ambiguous — it could mean every
  // interaction was quick, or that nothing was ever clicked, and those are
  // opposite conclusions.
  return driven;
}

/**
 * Third-party CSS and fonts are render-blocking: the browser will not paint
 * until they resolve. In a sandbox or CI runner they are unreachable, which
 * suppresses paint timing entirely and makes LCP/FCP unmeasurable.
 *
 * Stubbing them with empty 200s removes that dependency and makes a run
 * deterministic — the same page measured twice gives the same number. Pass
 * --external to exercise the real network instead.
 */
export async function stubThirdParty(page, origin) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:")) {
      return route.continue();
    }
    const type = route.request().resourceType();
    const body = { stylesheet: "", script: "", font: "", image: "" }[type];
    if (body === undefined) return route.abort();
    return route.fulfill({
      status: 200,
      contentType: { stylesheet: "text/css", script: "text/javascript", font: "font/woff2", image: "image/png" }[type],
      body,
    });
  });
}

/**
 * Render-blocking third-party resources, read from the delivered HTML.
 *
 * This used to walk the live DOM, which is wrong for exactly the pattern that
 * fixes the problem: a `rel="preload" ... onload="this.rel='stylesheet'"` link
 * does not block parsing, but by the time the page is idle its rel *is*
 * "stylesheet", so the DOM says it blocked when it did not. The bytes the
 * browser parsed are the only honest source.
 */
export function findRenderBlocking(html, origin) {
  const blocking = [];

  // A <noscript> copy is the fallback that pairs with a non-blocking load. It
  // is a plain rel="stylesheet", but it only applies when scripts are off, so
  // counting it reports the very pattern that removes the blocking as blocking.
  html = html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");

  const linkTag = /<link\b[^>]*>/gi;
  for (const [tag] of html.matchAll(linkTag)) {
    const rel = (tag.match(/\brel=["']?([^"'\s>]+)/i) || [])[1];
    if (!rel || rel.toLowerCase() !== "stylesheet") continue;      // preload does not block
    const href = (tag.match(/\bhref=["']([^"']+)/i) || [])[1];
    if (!href || !/^https?:\/\//.test(href)) continue;
    if (href.startsWith(origin)) continue;
    const media = (tag.match(/\bmedia=["']([^"']+)/i) || [])[1];
    if (media && !/^(all|screen)$/i.test(media.trim())) continue;  // media="print" does not block
    blocking.push({ type: "stylesheet", href: href.slice(0, 90) });
  }

  const scriptTag = /<script\b[^>]*>/gi;
  for (const [tag] of html.matchAll(scriptTag)) {
    if (/\b(defer|async|type=["']module["'])/i.test(tag)) continue;
    const src = (tag.match(/\bsrc=["']([^"']+)/i) || [])[1];
    if (!src || !/^https?:\/\//.test(src)) continue;
    if (src.startsWith(origin)) continue;
    blocking.push({ type: "script", href: src.slice(0, 90) });
  }

  return blocking;
}
