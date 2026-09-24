/*
 * Global nav (spec 4.3, motion M6-M7).
 *
 * Below 768px the server-rendered link list becomes a full-height sheet under
 * the bar, opened by the menu button. From 768px the same list sits inline and
 * nothing here runs except the listener that closes a sheet left open when the
 * window widens. Without this script the links simply stay on the page.
 *
 * State lives in two attributes on nav.site-nav, which the CSS reads:
 *   data-open     the sheet is showing (set for the whole close, too)
 *   data-closing  the 180ms exit animation is running
 * The close is finished by the sheet's animationend or, if that never comes
 * (reduced motion, a hidden tab, a browser without animations), by a 250ms
 * timer. Both handles are kept so a tap during the close can cancel it: the
 * sheet then stays open instead of closing and reopening.
 *
 * Plain ES5 on purpose: it ships unbundled to every browser the theme supports.
 */
(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  if (!nav) { return; }
  var toggle = nav.querySelector(".site-nav__toggle");
  var list = nav.querySelector(".site-nav__list");
  if (!toggle || !list) { return; }

  var root = document.documentElement;
  // Longer than the 180ms exit, so the timer only wins when animationend is
  // not coming.
  var FALLBACK_MS = 250;
  var fallbackTimer = null;
  var endListener = null;

  // Everything behind the sheet. inert takes it out of the tab order and the
  // accessibility tree while the sheet covers it, so focus and a screen
  // reader's cursor stay in the menu and the bar.
  function setBackgroundInert(on) {
    var parts = [document.querySelector(".initial-content"), document.getElementById("footer")];
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) { continue; }
      if (on) {
        parts[i].setAttribute("inert", "");
      } else {
        parts[i].removeAttribute("inert");
      }
    }
  }

  function isOpen() {
    return nav.hasAttribute("data-open");
  }

  function isClosing() {
    return nav.hasAttribute("data-closing");
  }

  function cancelPendingClose() {
    if (fallbackTimer !== null) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    if (endListener) {
      list.removeEventListener("animationend", endListener);
      endListener = null;
    }
  }

  // The end of a close, or an instant close (no animation).
  function finishClose() {
    cancelPendingClose();
    nav.removeAttribute("data-open");
    nav.removeAttribute("data-closing");
    toggle.setAttribute("aria-expanded", "false");
    root.classList.remove("nav-open");
    setBackgroundInert(false);
  }

  // A tap during the close reopens the sheet. Dropping data-closing swaps the
  // exit keyframes back for the enter ones, and a new CSS animation starts at
  // its first frame, fully transparent: the sheet would blink out and fade in
  // again. Instead, seek the enter animation to the frame that looks like what
  // is on screen now. Both keyframes move opacity and translateY together, so
  // matching the opacity matches the position too, and the sheet simply turns
  // round where it is. Best effort: without getAnimations the restart stands.
  function resumeFrom(shownOpacity) {
    if (!list.getAnimations || !(shownOpacity >= 0)) { return; }
    try {
      var running = list.getAnimations();
      var enter = null;
      for (var i = 0; i < running.length; i++) {
        if (running[i].animationName === "nav-sheet-in") { enter = running[i]; }
      }
      if (!enter || !enter.effect || !enter.effect.getComputedTiming) { return; }
      var lo = 0;
      var hi = enter.effect.getComputedTiming().duration;
      if (!(hi > 0)) { return; }
      // Opacity only rises along the enter animation, so bisect on time.
      for (var n = 0; n < 10; n++) {
        var mid = (lo + hi) / 2;
        enter.currentTime = mid;
        if (parseFloat(window.getComputedStyle(list).opacity) < shownOpacity) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      enter.currentTime = hi;
    } catch (e) {
      /* An engine that will not seek CSS animations: the restart stands. */
    }
  }

  function open() {
    if (isClosing()) {
      // Cancel the pending close; the sheet stays open and aria-expanded is
      // still "true", because it only changes when a close finishes.
      var shown = parseFloat(window.getComputedStyle(list).opacity);
      cancelPendingClose();
      nav.removeAttribute("data-closing");
      resumeFrom(shown);
      return;
    }
    if (isOpen()) { return; }
    nav.setAttribute("data-open", "");
    toggle.setAttribute("aria-expanded", "true");
    root.classList.add("nav-open");
    setBackgroundInert(true);
    // Into the menu, so the next Tab or swipe is the first link.
    var first = list.querySelector("a");
    if (first) { first.focus({ preventScroll: true }); }
  }

  function close() {
    if (!isOpen() || isClosing()) { return; }
    nav.setAttribute("data-closing", "");
    // animationend bubbles, and the rows have their own (nav-item-in); only the
    // sheet's own exit finishes the close.
    endListener = function (e) {
      if (e.target === list && e.animationName === "nav-sheet-out") { finishClose(); }
    };
    list.addEventListener("animationend", endListener);
    fallbackTimer = window.setTimeout(finishClose, FALLBACK_MS);
  }

  // Close with no animation: the layout has changed under the sheet, or the
  // page came back from the back/forward cache with the sheet still open.
  function closeNow() {
    if (isOpen()) { finishClose(); }
  }

  toggle.addEventListener("click", function () {
    if (isOpen() && !isClosing()) {
      close();
    } else {
      open();
    }
  });

  // Escape closes and hands focus back to the button that opened the sheet.
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Escape" || e.key === "Esc") && isOpen() && !isClosing()) {
      close();
      toggle.focus();
    }
  });

  // A link in the sheet closes it on the way to its page, so a same-page link
  // (the Archive link on /categories/) does not leave the sheet covering it.
  list.addEventListener("click", function (e) {
    var link = e.target && e.target.closest ? e.target.closest("a") : null;
    if (link && isOpen() && !isClosing()) { close(); }
  });

  // At 768px and up the list is inline again; a sheet open at that moment
  // would leave the page scroll-locked and inert.
  if (window.matchMedia) {
    var wide = window.matchMedia("(min-width: 768px)");
    if (wide.addEventListener) {
      wide.addEventListener("change", closeNow);
    } else if (wide.addListener) {
      wide.addListener(closeNow);
    }
  }

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { closeNow(); }
  });
})();
