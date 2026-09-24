/*
 * Theme toggle (spec 4.3, motion M3).
 *
 * The button is server-rendered in the masthead (no insertion, so no shift),
 * and it is a toggle for "dark theme", not a switch between named states: its
 * label is always "어두운 테마" and aria-pressed says whether dark is showing,
 * whether chosen here or inherited from a dark system. The icon (moon or sun)
 * is swapped by CSS from the same state, so this script never writes text.
 *
 * Three states in effect: follow the system (no data-theme, nothing stored),
 * forced light, forced dark. A press flips what is showing. When the flip
 * lands on what the system already prefers, the override is removed rather
 * than stored, so a reader can always get back to following the system (and
 * a later change of the system setting is followed again).
 *
 * head/theme-init.html applies a stored choice before first paint; this file
 * only runs after the page has been parsed.
 */
(function () {
  "use strict";

  var button = document.querySelector(".theme-toggle");
  if (!button) { return; }

  var root = document.documentElement;
  var STORAGE_KEY = "theme";
  // --nav-bg-solid in each theme, so the phone's status bar and the bar agree.
  var CHROME_DARK = "#161617";
  var CHROME_LIGHT = "#fbfbfd";
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function system() {
    return darkQuery && darkQuery.matches ? "dark" : "light";
  }

  function effective() {
    return root.getAttribute("data-theme") || system();
  }

  function store(value) {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      /* Private mode can throw; the choice then lasts for this page only. */
    }
  }

  // Reflect the current state: aria-pressed, and the browser chrome colour.
  // A forced theme sets both theme-color metas (whichever one the browser
  // picks by its media query must match the page). Following the system,
  // each meta goes back to the colour for its own media query.
  function sync() {
    var forced = root.getAttribute("data-theme");
    button.setAttribute("aria-pressed", effective() === "dark" ? "true" : "false");
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var colour;
      if (forced === "dark" || forced === "light") {
        colour = forced === "dark" ? CHROME_DARK : CHROME_LIGHT;
      } else {
        colour = /dark/.test(metas[i].getAttribute("media") || "") ? CHROME_DARK : CHROME_LIGHT;
      }
      metas[i].setAttribute("content", colour);
    }
  }

  function apply() {
    var next = effective() === "dark" ? "light" : "dark";
    if (next === system()) {
      root.removeAttribute("data-theme");
      store(null);
    } else {
      root.setAttribute("data-theme", next);
      store(next);
    }
    sync();
  }

  // theme-switching (styled in _motion.scss) turns every transition off for
  // the one frame the tokens change, so the page swaps at once instead of each
  // element fading on its own schedule. Reading a computed style forces that
  // frame's style to resolve before the class comes off again.
  function swap() {
    root.classList.add("theme-switching");
    apply();
    void window.getComputedStyle(root).color;
    window.requestAnimationFrame(function () {
      root.classList.remove("theme-switching");
    });
  }

  // Run fn once the browser has painted the frame that answers the click. The
  // swap restyles the whole page, and done inside the click handler that work
  // sits between the tap and the next paint: at 4x CPU the click measured
  // 72ms of INP with the crossfade and 56-72ms with a plain swap, over the
  // 60ms budget either way. Yielding first, the click measures 24-32ms and
  // the theme changes one frame (about 16ms) later, which nobody can see.
  function afterNextPaint(fn) {
    if (!window.requestAnimationFrame) {
      window.setTimeout(fn, 0);
      return;
    }
    window.requestAnimationFrame(function () {
      window.setTimeout(fn, 0);
    });
  }

  button.addEventListener("click", function () {
    afterNextPaint(function () {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // A 200ms crossfade of the whole page (M3), the same one used between
      // pages, where the browser supports it; otherwise, or when the reader
      // has asked for less motion, the swap is instant.
      if (document.startViewTransition && !reduce) {
        document.startViewTransition(swap);
      } else {
        swap();
      }
    });
  });

  // While following the system, the CSS already tracks a change of the system
  // setting; only aria-pressed and the chrome colours need to catch up.
  function onSystemChange() {
    if (!root.getAttribute("data-theme")) { sync(); }
  }
  if (darkQuery) {
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", onSystemChange);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(onSystemChange);
    }
  }

  sync();
})();
