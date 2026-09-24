/*
 * Progressive enhancements. Everything here is additive: with this file blocked
 * the page still reads and navigates exactly as before.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * Press feedback on iOS
   * ------------------------------------------------------------------ */
  // iOS Safari only applies :active to a touched element when a touchstart
  // listener exists on it or an ancestor. Without one, every press state on
  // the site (pills .97, options .98, tiles .99; spec M8) is dead on an
  // iPhone. The listener does nothing, and passive, so it never delays a
  // scroll. Registered at once rather than after DOMContentLoaded: it has no
  // DOM to wait for.
  document.addEventListener("touchstart", function () {}, { passive: true });

  /* ---------------------------------------------------------------------
   * Clipboard
   * ------------------------------------------------------------------ */
  // Shared by the code-block copy button and the share row's "링크 복사".
  // The async clipboard API first; execCommand when the API is missing (plain
  // http, which is what a local preview runs on) or refuses (no permission,
  // document not focused). execCommand is deprecated but still the only
  // fallback that works everywhere.
  function copyText(text, done) {
    var legacy = function () {
      var scratch = document.createElement("textarea");
      scratch.value = text;
      scratch.setAttribute("readonly", "");
      scratch.style.cssText = "position:absolute;left:-9999px";
      document.body.appendChild(scratch);
      scratch.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(scratch);
      done(ok);
    };

    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, legacy);
      return;
    }
    legacy();
  }

  /* ---------------------------------------------------------------------
   * Copy button on code blocks
   * ------------------------------------------------------------------ */
  // This is a blog largely made of SQL and Python samples, and the only way to
  // take one was to select it by hand — awkward on a phone, and easy to catch
  // the line numbers or a stray character.
  function addCopyButtons() {
    var blocks = document.querySelectorAll(".page__content div.highlighter-rouge, .page__content figure.highlight, .page__content pre.highlight");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.querySelector(".code-copy")) return;
      // Rouge nests pre.highlight inside div.highlighter-rouge, so both match
      // and the inner one would get a second button. Only the outermost wraps.
      var ancestor = block.parentElement && block.parentElement.closest(".highlighter-rouge, figure.highlight");
      if (ancestor) return;
      var code = block.querySelector("code, pre");
      if (!code) return;

      var button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = "복사";
      button.setAttribute("aria-label", "코드 복사");

      button.addEventListener("click", function () {
        copyText(code.innerText.replace(/\s+$/, ""), function (ok) {
          button.textContent = ok ? "복사됨" : "실패";
          button.classList.toggle("is-done", ok);
          setTimeout(function () {
            button.textContent = "복사";
            button.classList.remove("is-done");
          }, 1600);
        });
      });

      block.classList.add("has-copy");
      block.appendChild(button);
    });
  }

  /* ---------------------------------------------------------------------
   * Language label on code blocks
   * ------------------------------------------------------------------ */
  // Rouge puts the language in a class; surfacing it saves the reader guessing
  // whether a snippet is SQL or Python.
  var LANGUAGE_NAMES = {
    sql: "SQL", python: "Python", py: "Python", javascript: "JavaScript",
    js: "JavaScript", bash: "Bash", shell: "Shell", console: "Console",
    html: "HTML", css: "CSS", scss: "SCSS", json: "JSON", yaml: "YAML",
    ruby: "Ruby", java: "Java", plaintext: "", text: "",
  };

  function addLanguageLabels() {
    var blocks = document.querySelectorAll(".page__content div.highlighter-rouge[class*='language-']");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.getAttribute("data-lang")) return;
      var match = block.className.match(/language-([\w+#-]+)/);
      if (!match) return;
      var name = LANGUAGE_NAMES[match[1].toLowerCase()];
      if (name === undefined) name = match[1].toUpperCase();
      if (!name) return;
      block.setAttribute("data-lang", name);
    });
  }

  /* ---------------------------------------------------------------------
   * Reading progress (spec 5, M13)
   * ------------------------------------------------------------------ */
  // Where CSS can drive the bar from a view timeline (_motion.scss), it runs
  // off the main thread and these listeners would only fight it. Both
  // features are needed: the bar lives on <body>, outside the article, so it
  // reaches the article's timeline only through timeline-scope. The same two
  // checks gate the CSS, so exactly one of the two paths is ever live.
  var CSS_DRIVES_PROGRESS = !!(window.CSS && window.CSS.supports &&
    window.CSS.supports("animation-timeline: view()") &&
    window.CSS.supports("timeline-scope: --a"));

  // Only on articles, and only when there is enough of one to be worth showing.
  function addReadingProgress() {
    var article = document.querySelector(".page__content[itemprop='text']");
    if (!article) return;
    if (article.getBoundingClientRect().height < window.innerHeight * 2) return;

    var bar = document.createElement("div");
    bar.className = "reading-progress";
    // Decorative: a screen reader announcing a percentage on every scroll tick
    // would be noise, and the information is already in the scrollbar.
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    if (CSS_DRIVES_PROGRESS) return;

    var ticking = false;
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var seen = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      bar.style.transform = "scaleX(" + (total > 0 ? seen / total : 0) + ")";
      ticking = false;
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------------
   * Keyboard access to scrolling code
   * ------------------------------------------------------------------ */
  // A block that scrolls sideways is unreachable by keyboard unless it can take
  // focus — you can see there is more code but cannot get to it without a
  // mouse. Only blocks that actually overflow get a tab stop, so the tab order
  // does not fill up with stops that go nowhere.
  function makeScrollableCodeFocusable() {
    var blocks = document.querySelectorAll(".page__content pre, .page__content div.highlighter-rouge");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.hasAttribute("tabindex")) return;
      if (block.scrollWidth <= block.clientWidth) return;
      block.setAttribute("tabindex", "0");
      block.setAttribute("role", "region");
      block.setAttribute("aria-label", (block.getAttribute("data-lang") || "코드") + " 코드 블록");
    });
  }

  /* ---------------------------------------------------------------------
   * Keyboard access to wide tables
   * ------------------------------------------------------------------ */
  // The theme makes every content table its own sideways scroller (display
  // block, overflow-x auto). The pandas posts print DataFrames far wider than
  // a phone, and a scroller that cannot take focus cannot be scrolled from the
  // keyboard: axe's scrollable-region-focusable, 3 serious on /ai/Pandas_2/.
  // Only tables that really overflow get the tab stop (the 1px of slack
  // absorbs subpixel rounding), and it is never taken away again on a wider
  // window: a tab stop that comes and goes with the window size is worse than
  // one spare stop. No role or label is added: the element is already a
  // table and says so.
  function makeWideTablesFocusable() {
    var tables = document.querySelectorAll(".page__content table");
    Array.prototype.forEach.call(tables, function (table) {
      if (table.hasAttribute("tabindex")) return;
      if (table.scrollWidth > table.clientWidth + 1) table.setAttribute("tabindex", "0");
    });
  }

  function makeOverflowFocusable() {
    makeScrollableCodeFocusable();
    makeWideTablesFocusable();
  }

  // Each check reads scrollWidth, which forces layout; once the window has
  // stopped changing size is enough.
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  /* ---------------------------------------------------------------------
   * Share row: copy link (spec 4.5.1, M16)
   * ------------------------------------------------------------------ */
  // The button is server-rendered by social-share.html, visible, so the row
  // wraps at first paint exactly as it will after this runs; this only binds
  // it. Nothing is inserted, removed or relabelled except the 1.6s "복사됨"
  // confirmation, and for that the pill keeps its width (min-width pinned to
  // what it measured), so the shorter label cannot let the row re-wrap under
  // the reader's finger. The visually hidden [data-share-status] span is
  // aria-live="polite", so screen readers hear the result too; a trailing
  // no-break space toggles on a repeat so the same message is announced
  // again. On failure the label stays and only the status speaks: both
  // clipboard paths failing is rare, and a label that reads as a result
  // should not claim one.
  var SHARE_COPIED = "링크를 복사했습니다";
  var SHARE_FAILED = "링크를 복사하지 못했습니다";

  function bindShareCopy() {
    var sections = document.querySelectorAll(".page__share[data-share-url]");
    Array.prototype.forEach.call(sections, function (section) {
      var button = section.querySelector("button[data-share-copy]");
      if (!button) return;
      var status = section.querySelector("[data-share-status]");
      var label = button.textContent;
      var timer = null;

      var announce = function (message) {
        if (!status) return;
        status.textContent = status.textContent === message ? message + " " : message;
      };

      button.addEventListener("click", function () {
        copyText(section.getAttribute("data-share-url"), function (ok) {
          announce(ok ? SHARE_COPIED : SHARE_FAILED);
          if (!ok) return;
          clearTimeout(timer);
          if (!button.style.minWidth) button.style.minWidth = button.offsetWidth + "px";
          button.textContent = "복사됨";
          timer = setTimeout(function () {
            button.textContent = label;
            button.style.minWidth = "";
            if (status) status.textContent = "";
            timer = null;
          }, 1600);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * /tags/: open the section a link points at (spec 4.6)
   * ------------------------------------------------------------------ */
  // Each tag section shows five posts and folds the rest into
  // details.taxonomy__overflow. A link to one tag (the home series tile, a
  // tag chip in a post) means "show me this tag's posts", so the targeted
  // section opens in full, on arrival and when the hash changes in place.
  // The details sits below the section's own heading, so opening it grows
  // the page under the target and the target does not move.
  function openTargetedOverflow() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* keep it as typed */ }
    var target = document.getElementById(id);
    if (!target || !target.closest) return;
    var section = target.closest("section.taxonomy__section");
    if (!section) return;
    var overflow = section.querySelector("details.taxonomy__overflow");
    if (overflow && !overflow.open) overflow.open = true;
  }

  function init() {
    addLanguageLabels();
    addCopyButtons();
    addReadingProgress();
    makeOverflowFocusable();
    bindShareCopy();
    openTargetedOverflow();
    // Layout settles after fonts land, which changes what overflows.
    window.addEventListener("load", makeOverflowFocusable);
    window.addEventListener("resize", debounce(makeOverflowFocusable, 150));
    window.addEventListener("hashchange", openTargetedOverflow);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
