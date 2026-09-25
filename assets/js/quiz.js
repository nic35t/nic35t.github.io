/* Self-check test engine for pages built by _layouts/quiz.html.
 *
 * Everything test-specific comes from the page's #quiz-data JSON (the page's
 * front matter): questions, concepts and results. This file only knows the
 * shape, so a new test is a new data file, written in the CMS or by hand.
 *
 *   question: { q, axis: "a" | "b", options: [{ text, score, concept? }] }
 *   concept:  { key, label, desc }
 *   result:   { quadrant: "low-low" | "low-high" | "high-low" | "high-high"
 *               | "middle", emoji, type, name, desc, checks: [] }
 *
 * Quadrant names read axis a first, then axis b: "high-low" is high on a and
 * low on b. Both axes between 35 and 65 is "middle"; saying so is more honest
 * than rounding a centre answer into a corner.
 *
 * Behaviour carried over from the hand-written /investment-test/: focus moves
 * to each new question (and to the result) without scrolling, questions after
 * the first slide in (skipped under reduced motion), and the result appears
 * straight away, inside the browser's after-input window, so the swap never
 * counts as layout shift. */
(function () {
  var dataEl = document.getElementById("quiz-data");
  if (!dataEl) return;
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var questions = data.questions || [];
  var concepts = {};
  (data.concepts || []).forEach(function (c) { concepts[c.key] = c; });
  var results = {};
  (data.results || []).forEach(function (r) { results[r.quadrant] = r; });

  var $ = function (id) { return document.getElementById(id); };
  var step = 0;
  var totals = { a: 0, b: 0 };
  var maxima = { a: 0, b: 0 };
  var tally = {};

  questions.forEach(function (q) {
    q.max = Math.max.apply(null, (q.options || []).map(function (o) { return Number(o.score) || 0; })) || 1;
    maxima[q.axis === "b" ? "b" : "a"] += 1;
  });

  function show(id) {
    ["start-screen", "quiz-screen", "result-screen"].forEach(function (s) {
      $(s).classList.toggle("active", s === id);
    });
  }

  function start() {
    show("quiz-screen");
    render();
  }

  function render() {
    var q = questions[step];
    $("question-text").innerText = "Q" + (step + 1) + ". " + q.q;
    $("progress-bar").style.width = (step / questions.length) * 100 + "%";
    var box = $("options-container");
    box.innerHTML = "";
    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-option";
      btn.innerText = opt.text;
      btn.onclick = function () { choose(q, opt); };
      box.appendChild(btn);
    });
    enter();
  }

  function enter() {
    var heading = $("question-text");
    heading.focus({ preventScroll: true });
    if (step === 0 || !heading.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var items = [heading].concat(Array.prototype.slice.call(document.querySelectorAll("#options-container .btn-option")));
    items.forEach(function (el, i) {
      el.animate(
        [{ opacity: 0, transform: "translateX(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 220, delay: i * 40, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" }
      );
    });
  }

  function choose(q, opt) {
    totals[q.axis === "b" ? "b" : "a"] += (Number(opt.score) || 0) / q.max;
    if (opt.concept) tally[opt.concept] = (tally[opt.concept] || 0) + 1;
    step++;
    if (step < questions.length) render(); else result();
  }

  function pick(a, b) {
    if (a > 35 && a < 65 && b > 35 && b < 65 && results.middle) return results.middle;
    return results[(a >= 50 ? "high" : "low") + "-" + (b >= 50 ? "high" : "low")] || results.middle;
  }

  function list(id, items) {
    var ul = $(id);
    if (!ul) return;
    ul.innerHTML = "";
    items.forEach(function (node) { ul.appendChild(node); });
  }

  function li(text, bold) {
    var el = document.createElement("li");
    if (bold) {
      var b = document.createElement("b");
      b.innerText = bold + " — ";
      el.appendChild(b);
    }
    el.appendChild(document.createTextNode(text));
    return el;
  }

  function result() {
    show("result-screen");
    var a = maxima.a ? Math.round((totals.a / maxima.a) * 100) : 0;
    var b = maxima.b ? Math.round((totals.b / maxima.b) * 100) : 0;
    var res = pick(a, b) || {};
    $("result-emoji").innerText = res.emoji || "";
    $("result-type").innerText = res.type || "";
    $("result-name").innerText = res.name || "";
    $("result-desc").innerText = res.desc || "";
    $("axis-a-value").innerText = a;
    $("axis-b-value").innerText = b;
    /* Next frame, so the bars animate from zero instead of appearing full. */
    requestAnimationFrame(function () {
      $("axis-a-bar").style.width = a + "%";
      $("axis-b-bar").style.width = b + "%";
    });

    var ranked = Object.keys(tally).filter(function (k) { return concepts[k]; })
      .sort(function (x, y) { return tally[y] - tally[x]; }).slice(0, 3);
    list("result-biases", ranked.length
      ? ranked.map(function (k) { return li(concepts[k].desc, concepts[k].label); })
      : [li(data.conceptsEmpty || "이번 답변에서는 두드러진 항목이 없었습니다.")]);
    list("result-advice", (res.checks || []).map(function (t) { return li(t); }));

    $("result-name").focus({ preventScroll: true });
  }

  function share() {
    var url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: data.title, text: data.shareText, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        alert("링크가 복사되었습니다. 친구들에게 공유해보세요!");
      });
    }
  }

  document.querySelector("[data-quiz-start]").addEventListener("click", start);
  document.querySelector("[data-quiz-share]").addEventListener("click", share);
  document.querySelector("[data-quiz-restart]").addEventListener("click", function () { location.reload(); });
})();
