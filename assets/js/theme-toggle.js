/*
 * Theme toggle. Three states in effect: follow the system (nothing stored),
 * forced light, forced dark. The button reflects what is currently applied and
 * flips to the other, which is what people expect from a single control.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "theme";

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode */ }
  }

  function build() {
    var nav = document.querySelector(".greedy-nav");
    if (!nav || document.querySelector(".theme-toggle")) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    var label = function () {
      var dark = currentTheme() === "dark";
      button.setAttribute("aria-label", dark ? "밝은 테마로 전환" : "어두운 테마로 전환");
      button.setAttribute("title", button.getAttribute("aria-label"));
      button.setAttribute("aria-pressed", String(dark));
      button.textContent = dark ? "☀" : "☾";
    };

    button.addEventListener("click", function () {
      apply(currentTheme() === "dark" ? "light" : "dark");
      label();
    });

    // While the reader has made no choice, keep following the system.
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!root.getAttribute("data-theme")) label();
      });
    }

    label();
    // Before the greedy-nav toggle so it does not get swept into the overflow
    // menu when the navigation runs out of room.
    var overflowToggle = nav.querySelector(".greedy-nav__toggle");
    nav.insertBefore(button, overflowToggle || null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
