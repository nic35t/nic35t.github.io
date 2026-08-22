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
  window.__vitals = { lcp: null, cls: 0, inp: null, fcp: null, shifts: [], longTasks: 0 };

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

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const current = window.__vitals.inp ?? 0;
        if (entry.duration > current) window.__vitals.inp = entry.duration;
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

  return {
    LCP: v.lcp == null ? null : Math.round(v.lcp),
    CLS: Math.round(cls * 1000) / 1000,
    INP: v.inp == null ? null : Math.round(v.inp),
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
  const targets = await page.$$("button:visible, [role='button']:visible, nav a:visible");
  for (const target of targets.slice(0, 3)) {
    try {
      await target.hover({ timeout: 1000 });
      await target.click({ timeout: 1000, trial: true });
    } catch {
      // A control that cannot be driven is the click-blocked check's problem.
    }
  }
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
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

/** Render-blocking third-party resources in the document, as authored. */
export const FIND_RENDER_BLOCKING = () => {
  const blocking = [];
  for (const link of document.querySelectorAll("link[rel='stylesheet']")) {
    const href = link.getAttribute("href") || "";
    if (!/^https?:\/\//.test(href)) continue;
    if (new URL(href, location.href).origin === location.origin) continue;
    if (link.media && link.media !== "all" && link.media !== "screen") continue;
    blocking.push({ type: "stylesheet", href: href.slice(0, 90) });
  }
  for (const script of document.querySelectorAll("script[src]")) {
    if (script.defer || script.async || script.type === "module") continue;
    const src = script.getAttribute("src") || "";
    if (!/^https?:\/\//.test(src)) continue;
    if (new URL(src, location.href).origin === location.origin) continue;
    blocking.push({ type: "script", href: src.slice(0, 90) });
  }
  return blocking;
};
