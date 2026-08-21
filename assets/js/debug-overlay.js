/*
 * On-page debug overlay.
 *
 * Loaded only when the URL carries ?debug=1 (or #debug). Sticks a panel on the
 * page that reports the things that are invisible when a layout bug shows up on
 * a real phone: what is overflowing, what is covering the control you cannot
 * tap, the stacking order, and any JavaScript that threw.
 *
 * Enable for a whole session from the console:  localStorage.debugOverlay = "1"
 */
(function () {
  "use strict";

  var MIN_TAP_TARGET = 44;
  var errors = [];
  var outlined = false;

  window.addEventListener("error", function (event) {
    errors.push({
      message: event.message,
      source: (event.filename || "").split("/").pop() + ":" + event.lineno,
    });
  });
  window.addEventListener("unhandledrejection", function (event) {
    errors.push({ message: "Unhandled promise rejection: " + event.reason, source: "" });
  });

  function describe(el) {
    if (!el) return "(none)";
    var id = el.id ? "#" + el.id : "";
    var cls = typeof el.className === "string" && el.className.trim()
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    return el.tagName.toLowerCase() + id + cls;
  }

  function isVisible(el) {
    var style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function isScreenReaderOnly(el) {
    if (el.closest(".screen-reader-text, .screen-reader-shortcut, .sr-only, .visually-hidden")) return true;
    var style = getComputedStyle(el);
    return style.clipPath === "inset(100%)" || (style.clip && style.clip !== "auto");
  }

  function inPanel(el) {
    return !!el.closest("#debug-overlay");
  }

  function findOverflow() {
    var vw = window.innerWidth;
    var overhang = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (overhang <= 1) return { overhang: 0, culprits: [] };

    var culprits = [];
    var all = document.querySelectorAll("body *");
    for (var i = 0; i < all.length; i += 1) {
      var el = all[i];
      if (inPanel(el) || !isVisible(el) || isScreenReaderOnly(el)) continue;
      if (getComputedStyle(el).position === "fixed") continue;
      var rect = el.getBoundingClientRect();
      if (rect.right <= vw + 1 && rect.left >= -1) continue;
      // Report the outermost offender; its children are along for the ride.
      var nested = false;
      for (var j = 0; j < culprits.length; j += 1) {
        if (culprits[j].el.contains(el)) { nested = true; break; }
      }
      if (nested) continue;
      culprits.push({ el: el, overhang: Math.round(rect.right - vw) });
    }
    return { overhang: overhang, culprits: culprits };
  }

  function findBlocked() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var blocked = [];
    var controls = document.querySelectorAll("a[href], button, [role='button'], input, select, textarea, summary");

    for (var i = 0; i < controls.length; i += 1) {
      var el = controls[i];
      if (inPanel(el) || !isVisible(el) || isScreenReaderOnly(el)) continue;
      var rect = el.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      // Only judge a control whose own centre is on screen right now.
      if (x < 0 || x > vw || y < 0 || y > vh) continue;

      var hit = document.elementFromPoint(x, y);
      if (!hit || hit === el || el.contains(hit) || hit.contains(el) || inPanel(hit)) continue;
      blocked.push({ el: el, blocker: hit, z: getComputedStyle(hit).zIndex });
    }
    return blocked;
  }

  function findSmallTargets() {
    if (window.innerWidth > 480) return [];
    var small = [];
    var controls = document.querySelectorAll(
      "button, [role='button'], input, select, textarea, summary, .btn, .site-logo, .back-to-top, nav a, .greedy-nav a, .pagination a"
    );
    for (var i = 0; i < controls.length; i += 1) {
      var el = controls[i];
      if (inPanel(el) || !isVisible(el) || isScreenReaderOnly(el)) continue;
      var rect = el.getBoundingClientRect();
      if (rect.width >= MIN_TAP_TARGET && rect.height >= MIN_TAP_TARGET) continue;
      small.push({ el: el, size: Math.round(rect.width) + "x" + Math.round(rect.height) });
    }
    return small;
  }

  function findStacking() {
    var stack = [];
    var all = document.querySelectorAll("body *");
    for (var i = 0; i < all.length; i += 1) {
      var el = all[i];
      if (inPanel(el)) continue;
      var style = getComputedStyle(el);
      if (style.position === "static") continue;
      var z = parseInt(style.zIndex, 10);
      if (isNaN(z)) continue;
      stack.push({ el: el, z: z, position: style.position });
    }
    stack.sort(function (a, b) { return b.z - a.z; });
    return stack.slice(0, 12);
  }

  function section(title, count, body) {
    var status = count === 0 ? "ok" : "bad";
    return '<div class="dbg-section dbg-' + status + '">' +
      '<div class="dbg-h">' + title + ' <span class="dbg-count">' + count + "</span></div>" +
      (body ? '<div class="dbg-b">' + body + "</div>" : "") +
      "</div>";
  }

  function list(items) {
    return "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
  }

  function esc(str) {
    return String(str).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function scan() {
    var body = document.getElementById("debug-overlay-body");
    if (!body) return;

    var overflow = findOverflow();
    var blocked = findBlocked();
    var small = findSmallTargets();
    var stack = findStacking();

    var html = "";

    html += '<div class="dbg-meta">' +
      window.innerWidth + "&times;" + window.innerHeight +
      " &middot; dpr " + (window.devicePixelRatio || 1) +
      " &middot; scroll " + document.documentElement.scrollWidth + "px" +
      "</div>";

    html += section("Horizontal overflow", overflow.culprits.length,
      overflow.culprits.length
        ? list(overflow.culprits.map(function (c) {
            return esc(describe(c.el)) + ' <b>+' + c.overhang + "px</b>";
          }))
        : "");

    html += section("Covered controls", blocked.length,
      blocked.length
        ? list(blocked.map(function (b) {
            return esc(describe(b.el)) + " &larr; covered by " +
              esc(describe(b.blocker)) + " <b>z:" + esc(b.z) + "</b>";
          }))
        : "");

    html += section("Small tap targets", small.length,
      small.length
        ? list(small.map(function (s) { return esc(describe(s.el)) + " <b>" + s.size + "</b>"; }))
        : "");

    html += section("JS errors", errors.length,
      errors.length
        ? list(errors.map(function (e) { return esc(e.message) + " <i>" + esc(e.source) + "</i>"; }))
        : "");

    html += section("Stacking order", stack.length,
      list(stack.map(function (s) {
        return "z:<b>" + s.z + "</b> (" + esc(s.position) + ") " + esc(describe(s.el));
      })));

    body.innerHTML = html;
  }

  function toggleOutlines() {
    outlined = !outlined;
    var overflow = findOverflow();
    document.querySelectorAll("[data-dbg-outline]").forEach(function (el) {
      el.style.outline = "";
      el.removeAttribute("data-dbg-outline");
    });
    if (!outlined) return;
    overflow.culprits.forEach(function (c) {
      c.el.style.outline = "3px solid #ff2d55";
      c.el.setAttribute("data-dbg-outline", "1");
    });
    findBlocked().forEach(function (b) {
      b.blocker.style.outline = "3px dashed #ffcc00";
      b.blocker.setAttribute("data-dbg-outline", "1");
    });
  }

  function build() {
    var style = document.createElement("style");
    style.textContent = [
      "#debug-overlay{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;",
      "background:#11131a;color:#e6e8ee;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;",
      "max-height:60vh;display:flex;flex-direction:column;box-shadow:0 -2px 12px rgba(0,0,0,.5)}",
      "#debug-overlay header{display:flex;gap:6px;align-items:center;padding:6px 8px;background:#1b1f2b;flex:0 0 auto}",
      "#debug-overlay header strong{margin-right:auto;font-weight:600;color:#7dd3fc}",
      "#debug-overlay button{background:#2b3242;color:#e6e8ee;border:0;border-radius:4px;padding:4px 8px;font:inherit;cursor:pointer}",
      "#debug-overlay button:hover{background:#3a4356}",
      "#debug-overlay-body{overflow:auto;padding:8px;-webkit-overflow-scrolling:touch}",
      "#debug-overlay.dbg-collapsed #debug-overlay-body{display:none}",
      ".dbg-meta{color:#9aa3b5;margin-bottom:8px}",
      ".dbg-section{margin-bottom:8px;border-left:3px solid #2b3242;padding-left:8px}",
      ".dbg-section.dbg-bad{border-left-color:#ff2d55}",
      ".dbg-section.dbg-ok{border-left-color:#22c55e}",
      ".dbg-h{font-weight:600}",
      ".dbg-count{display:inline-block;min-width:18px;text-align:center;border-radius:9px;padding:0 5px;background:#2b3242}",
      ".dbg-bad .dbg-count{background:#ff2d55;color:#fff}",
      ".dbg-b ul{margin:4px 0 0;padding-left:16px}",
      ".dbg-b li{word-break:break-all;color:#c7cddb}",
      ".dbg-b b{color:#fbbf24}",
      ".dbg-b i{color:#9aa3b5}",
    ].join("");
    document.head.appendChild(style);

    var panel = document.createElement("div");
    panel.id = "debug-overlay";
    panel.innerHTML =
      "<header><strong>debug</strong>" +
      '<button type="button" data-dbg="scan">rescan</button>' +
      '<button type="button" data-dbg="outline">outline</button>' +
      '<button type="button" data-dbg="collapse">&minus;</button>' +
      '<button type="button" data-dbg="close">&times;</button>' +
      "</header><div id='debug-overlay-body'></div>";
    document.body.appendChild(panel);

    panel.addEventListener("click", function (event) {
      var action = event.target.getAttribute("data-dbg");
      if (action === "scan") scan();
      if (action === "outline") toggleOutlines();
      if (action === "collapse") panel.classList.toggle("dbg-collapsed");
      if (action === "close") {
        localStorage.removeItem("debugOverlay");
        panel.remove();
      }
    });

    scan();
    // Layout settles after fonts and images land; re-scan rather than report
    // numbers measured mid-load.
    window.addEventListener("load", scan);
    window.addEventListener("resize", scan);
    window.addEventListener("orientationchange", function () { setTimeout(scan, 300); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
