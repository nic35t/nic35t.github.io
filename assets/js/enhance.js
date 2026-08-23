/*
 * Progressive enhancements. Everything here is additive: with this file blocked
 * the page still reads and navigates exactly as before.
 */
(function () {
  "use strict";

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
        var text = code.innerText.replace(/\s+$/, "");
        var done = function (ok) {
          button.textContent = ok ? "복사됨" : "실패";
          button.classList.toggle("is-done", ok);
          setTimeout(function () {
            button.textContent = "복사";
            button.classList.remove("is-done");
          }, 1600);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
          return;
        }
        // execCommand is deprecated but it is the only path on plain http,
        // which is what a local preview runs on.
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
   * Reading progress
   * ------------------------------------------------------------------ */
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

  function init() {
    addLanguageLabels();
    addCopyButtons();
    addReadingProgress();
    makeScrollableCodeFocusable();
    // Layout settles after fonts land, which changes what overflows.
    window.addEventListener("load", makeScrollableCodeFocusable);
    window.addEventListener("resize", makeScrollableCodeFocusable);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
