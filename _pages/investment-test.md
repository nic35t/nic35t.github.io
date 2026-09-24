---
layout: single
title: "투자 성향 테스트"
description: "위험을 얼마나 견디는가, 그리고 무엇을 근거로 결정하는가. 두 축으로 나누어 보는 10문항"
permalink: /investment-test/
classes: wide
author_profile: false
sidebar:
  nav: false
# This is an interactive widget, not an article. The automatic contents list
# counts headings and was picking up the quiz's own placeholders — it rendered
# a table of contents reading "질문 내용, 결과 이름".
toc: false
# The start screen draws its own title (h1.test-title), so the layout's
# header is left out (spec 4.8; single.html honours hide_header). The title
# above still names the page: <title>, og:title and the footer's link label.
hide_header: true
---

<style>
  /* Investment test (spec 4.8). Everything here is scoped to
     .investment-test-container and coloured only with the site's tokens, so
     both dark paths (system and toggle) come for free and the old local
     palette with its two dark copies is gone. Contrast figures are light /
     dark, from spec 3.3.

     The theme gives every .page__content h2 a bottom rule and padding, and
     every .page__content p a bottom margin, at (0,1,1). Each heading and
     paragraph below is therefore written at (0,2,1) or more, with margin,
     padding, border, size, leading and weight all explicit, so neither the
     theme nor the article prose rules can reach into the quiz. */

  .investment-test-container,
  .investment-test-container * {
    box-sizing: border-box;
  }

  /* The page's one feature surface: --bg-alt, the 28px radius, no shadow
     (elevation belongs to tiles in a band). Its type is UI, not prose:
     1rem / 1.5 / --text, the same values the prose partial hands back at
     this widget's root. The min-height is a floor, not a size: without it
     the card shrank to each screen's content and the footer jumped up
     between screens. 560px holds the start and question screens; the
     result screen is taller and grows past it. Hangul breaks between words,
     never inside one: the site sets keep-all on body, and the widget repeats
     it so its lines hold on their own. */
  .investment-test-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    min-height: 560px;
    margin: 0 auto;
    padding: 40px 32px;
    border-radius: var(--r-lg);
    background-color: var(--bg-alt);
    box-shadow: none;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text);
    text-align: center;
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  /* One screen shows at a time. Start, loading and result centre in the
     floor; the question screen hangs from the top instead, so the progress
     bar and the question stay put while the number of options and the
     length of the question change from one step to the next. Each screen
     enters with a short rise (M14): opacity and transform only, so it never
     counts as layout shift. */
  .investment-test-container .screen {
    display: none;
    width: 100%;
    animation: fadeIn 300ms var(--ease-out);
  }

  .investment-test-container .screen.active {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto 0;
  }

  .investment-test-container #quiz-screen.active {
    align-items: stretch;
    margin: 0 0 auto;
  }

  /* A heading that receives focus from script (each new question, the
     result) is a place to read from, not a control, so it takes no ring.
     Keyboard users land on it and Tab on to the options. */
  .investment-test-container [tabindex="-1"]:focus {
    outline: none;
  }

  /* ---------- type ---------- */

  /* The page's only visible heading, at the site's page-title role (title1,
     700), like a post's H1. */
  .investment-test-container h1.test-title {
    margin: 0 0 16px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-title1);
    line-height: var(--lh-title1);
    font-weight: var(--fw-title1);
    letter-spacing: var(--track-title1);
    color: var(--text);
    word-break: keep-all;
    text-wrap: balance;
  }

  /* The question (#question-text). Title2 at 600, the site's section
     heading: it is the screen's headline but a sentence, not a title.
     Left-aligned, because it reads straight on into the left-aligned
     options under it. */
  .investment-test-container h2.test-title {
    margin: 0 0 24px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-title2);
    line-height: var(--lh-title2);
    font-weight: var(--fw-heading);
    letter-spacing: var(--track-title2);
    color: var(--text);
    text-align: left;
    word-break: keep-all;
  }

  /* Secondary on --bg-alt: 4.66 / 7.03. */
  .investment-test-container p.test-desc {
    margin: 0 0 32px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-title3);
    line-height: 1.5;
    font-weight: 400;
    color: var(--text-secondary);
    word-break: keep-all;
  }

  /* Kept for the owner: the delay in showLoading() is 0, so this screen
     shows for at most one frame, but a delay can come back as one number
     and the screen should then look like the rest. */
  .investment-test-container h2.loading-title {
    margin: 0 0 12px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-title3);
    line-height: var(--lh-title3);
    font-weight: var(--fw-heading);
    color: var(--text);
  }

  .investment-test-container p.loading-step {
    margin: 0;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-subhead);
    line-height: 1.6;
    font-weight: 400;
    color: var(--text-secondary);
  }

  /* Small print. The top margin keeps it clear of the CTA above it (the old
     18px let the pill's glow sit on the first line); 34em keeps the lines
     short enough to read as one block under a 300px button. Secondary on
     --bg-alt: 4.66 / 7.03. */
  .investment-test-container p.test-disclaimer {
    max-width: 34em;
    margin: 24px auto 0;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-footnote);
    line-height: 1.55;
    font-weight: 400;
    color: var(--text-secondary);
    text-align: center;
    word-break: keep-all;
  }

  /* ---------- controls ---------- */

  /* Primary CTA: the site's primary pill. White on --accent 4.70. No glow and
     no hover lift (spec 5: hover lift on buttons is rejected); the hover
     darkens only where a pointer can hover, and a press shrinks it to .97 at
     100ms, releasing over 200ms (M8). 52px tall: the one big action on the
     screen. */
  .investment-test-container .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 300px;
    min-height: 52px;
    margin: 0;
    padding: 0 32px;
    border: 0;
    border-radius: var(--r-pill);
    background-color: var(--accent);
    box-shadow: none;
    color: var(--on-accent);
    font: inherit;
    font-size: var(--fs-headline);
    font-weight: var(--fw-strong);
    line-height: 1.2;
    cursor: pointer;
    transition: background-color var(--dur-hover) var(--ease-standard), transform var(--dur-hover) var(--ease-out);
  }

  /* White on --accent-hover 5.38. */
  @media (hover: hover) and (pointer: fine) {
    .investment-test-container .btn-primary:hover {
      background-color: var(--accent-hover);
    }
  }

  .investment-test-container .btn-primary:active {
    transform: scale(0.97);
    transition-duration: var(--dur-press);
  }

  /* "결과 공유": the secondary pill, so "다시하기" stays the one blue action.
     Text on --fill 13.78 / 12.80, on --fill-hover 12.32 / 10.42. */
  .investment-test-container .btn-primary.btn-secondary {
    background-color: var(--fill);
    color: var(--text);
  }

  @media (hover: hover) and (pointer: fine) {
    .investment-test-container .btn-primary.btn-secondary:hover {
      background-color: var(--fill-hover);
    }
  }

  .investment-test-container .result-actions {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-top: 24px;
  }

  .investment-test-container .result-actions .btn-primary {
    flex: 1 1 0;
    max-width: none;
    padding: 0 16px;
  }

  /* Answer tiles, as Apple's selector tiles: plain text on --card with a
     control boundary. --separator-strong clears 3:1 against both of its
     neighbours (WCAG 1.4.11): 3.62 on the white card and 3.33 on the
     #f5f5f7 container in light, 3.32 on #1d1d1f and 3.57 on #161617 in
     dark. Text 16.83 / 15.46. Hover darkens the boundary to --text on fine
     pointers only (a tap would leave it stuck). A press shrinks to .98 and
     draws a 2px accent ring inside the edge, so the choice registers even
     though the next question replaces it at once. Named properties only: the
     old `transition: all` animated padding and colour on every tap. */
  .investment-test-container .btn-option {
    display: block;
    width: 100%;
    min-height: 56px;
    margin: 0 0 12px;
    padding: 16px 20px;
    border: 1px solid var(--separator-strong);
    border-radius: var(--r-sm);
    background-color: var(--card);
    color: var(--text);
    font: inherit;
    font-size: var(--fs-callout);
    font-weight: 500;
    line-height: 1.5;
    text-align: left;
    word-break: keep-all;
    overflow-wrap: break-word;
    cursor: pointer;
    touch-action: manipulation;
    transition: border-color var(--dur-hover) var(--ease-standard), box-shadow var(--dur-hover) var(--ease-standard), transform var(--dur-hover) var(--ease-out);
  }

  .investment-test-container .btn-option:last-child {
    margin-bottom: 0;
  }

  @media (hover: hover) and (pointer: fine) {
    .investment-test-container .btn-option:hover {
      border-color: var(--text);
    }
  }

  .investment-test-container .btn-option:active {
    transform: scale(0.98);
    box-shadow: inset 0 0 0 2px var(--accent);
    transition-duration: var(--dur-press);
  }

  /* Progress: a 4px pill. Its width is set by the quiz script, so width is
     what animates; 300ms ease-out, the length of one step's arrival. */
  .investment-test-container .progress-container {
    width: 100%;
    height: 4px;
    margin: 0 0 32px;
    border-radius: var(--r-pill);
    background-color: var(--fill);
    overflow: hidden;
  }

  .investment-test-container .progress-bar {
    width: 0;
    height: 100%;
    border-radius: inherit;
    background-color: var(--accent);
    transition: width 300ms var(--ease-out);
  }

  /* ---------- result ---------- */

  /* The five result animals are the page's one illustration. They arrive
     once with a small pop from .9 (never from 0) and then hold still: the
     old version bounced for as long as the page stayed open. */
  .investment-test-container .result-emoji {
    margin: 0 0 16px;
    font-size: 5rem;
    line-height: 1.1;
    animation: result-pop 480ms var(--ease-out) both;
  }

  /* An eyebrow over the result name. Link colour as the one tinted label:
     on --bg-alt 5.11 / 6.00. */
  .investment-test-container .result-type {
    margin: 0 0 8px;
    font-size: var(--fs-callout);
    line-height: 1.4;
    font-weight: var(--fw-heading);
    color: var(--link);
  }

  .investment-test-container h2.result-name {
    margin: 0 0 32px;
    padding-bottom: 0;
    border: 0;
    font-size: 1.8rem;
    line-height: 1.3;
    font-weight: var(--fw-title1);
    letter-spacing: var(--track-title2);
    color: var(--text);
    word-break: keep-all;
    text-wrap: balance;
  }

  /* Nested surfaces: --card inside the --bg-alt container, 18px radius. */
  .investment-test-container .result-box {
    width: 100%;
    margin: 0 0 12px;
    padding: 24px;
    border-radius: var(--r-md);
    background-color: var(--card);
    color: var(--text);
    text-align: left;
  }

  /* The accent box used a blue tint; tinting one box of three read as a
     warning. It stays a plain card, and keeps the class for its markup. */
  .investment-test-container .result-box--accent {
    background-color: var(--card);
  }

  .investment-test-container .result-box h3 {
    margin: 0 0 12px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-headline);
    line-height: 1.45;
    font-weight: var(--fw-heading);
    color: var(--text);
  }

  /* Lists read as body text: --text on --card, 16.83 / 15.46. */
  .investment-test-container .result-box ul {
    margin: 0;
    padding-left: 20px;
    font-size: var(--fs-subhead);
    line-height: 1.6;
    color: var(--text);
  }

  .investment-test-container .result-box li {
    margin: 0 0 8px;
  }

  .investment-test-container .result-box li:last-child {
    margin-bottom: 0;
  }

  .investment-test-container .bias-list b {
    color: var(--text);
  }

  /* Secondary on --card: 5.07 / 6.54. */
  .investment-test-container p.result-desc {
    margin: 16px 0 0;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-subhead);
    line-height: 1.6;
    font-weight: 400;
    color: var(--text-secondary);
    text-align: left;
  }

  .investment-test-container p.bias-intro {
    margin: 0 0 12px;
    padding-bottom: 0;
    border: 0;
    font-size: var(--fs-footnote);
    line-height: 1.5;
    font-weight: 400;
    color: var(--text-secondary);
    text-align: left;
  }

  /* The link's look (colour, 44px height, the chevron) comes from the
     site's .link-arrow; this only places it under the list. */
  .investment-test-container a.recommend-link {
    margin-top: 12px;
  }

  /* Two-axis readout. Label --text on --card 16.83 / 15.46, value --link
     5.57 / 5.58, end labels secondary 5.07 / 6.54. The fills are widths the
     script sets a frame after the screen appears, so they grow from zero
     over 700ms: slower than UI feedback on purpose, it is the result being
     read out. */
  .investment-test-container .axis {
    margin: 0 0 20px;
    text-align: left;
  }

  .investment-test-container .axis-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
    font-size: var(--fs-subhead);
    font-weight: var(--fw-strong);
    color: var(--text);
  }

  .investment-test-container .axis-head span:last-child {
    color: var(--link);
    font-variant-numeric: tabular-nums;
  }

  .investment-test-container .axis-track {
    height: 8px;
    border-radius: var(--r-pill);
    background-color: var(--fill);
    overflow: hidden;
  }

  .investment-test-container .axis-fill {
    width: 0;
    height: 100%;
    border-radius: inherit;
    background-color: var(--accent);
    transition: width 700ms var(--ease-out);
  }

  .investment-test-container .axis-ends {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: var(--fs-caption);
    color: var(--text-secondary);
  }

  /* ---------- motion (M14) ---------- */

  /* Only the start state is written; each ends at the element's own style.
     Reduced motion is handled by the site-wide blanket (0.01ms), which
     reaches these; the script's question swap checks it itself. */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  @keyframes result-pop {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /* ---------- phones ---------- */

  /* The 32px side padding would leave a 375px phone about 270px of line;
     20px gives the options room for two lines instead of three. The floor
     drops with it, still clear of the start and question screens. */
  @media (max-width: 600px) {
    .investment-test-container {
      min-height: 480px;
      padding: 28px 20px;
    }

    .investment-test-container .result-box {
      padding: 20px;
    }

    /* At title3 (19px) the description's first line, "위험을 얼마나
       견디는가, 그리고", no longer fit before its own <br> and broke into
       a ragged four lines; one step down keeps the author's three. */
    .investment-test-container p.test-desc {
      font-size: var(--fs-body);
    }

    .investment-test-container h2.result-name {
      font-size: 1.5rem;
    }
  }
</style>

<div class="investment-test-container">
  <!-- 1. Start Screen -->
  <div id="start-screen" class="screen active">
    <h1 class="test-title">투자 성향 테스트</h1>
    <p class="test-desc">위험을 얼마나 견디는가, 그리고<br>무엇을 근거로 결정하는가.<br>두 축으로 나누어 보는 10문항</p>
    <button class="btn-primary" onclick="startTest()">테스트 시작하기</button>
    <p class="test-disclaimer">행동경제학에서 다루는 편향을 소재로 한 자기 점검용 테스트입니다. 투자 자문이나 권유가 아니며, 결과가 특정 상품의 적합성을 판단해 주지 않습니다.</p>
  </div>

  <!-- 2. Quiz Screen -->
  <div id="quiz-screen" class="screen">
    <div class="progress-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>
    <h2 id="question-text" class="test-title" tabindex="-1">질문 내용</h2>
    <div id="options-container" style="width: 100%;">
      <!-- Options will be injected here -->
    </div>
  </div>

  <!-- 3. Loading Screen (delay 0: see showLoading) -->
  <div id="loading-screen" class="screen">
    <h2 class="loading-title">응답 분석 중...</h2>
    <p class="loading-step">위험 감내도 계산 중...</p>
    <p class="loading-step">판단 근거 유형 분류 중...</p>
  </div>

  <!-- 4. Result Screen -->
  <div id="result-screen" class="screen">
    <!-- Filled in by showResult(). aria-hidden: the name under it already says which animal, so a screen reader need not hear "lion face" first. -->
    <div id="result-emoji" class="result-emoji" aria-hidden="true"></div>
    <div id="result-type" class="result-type">TYPE A</div>
    <h2 id="result-name" class="result-name" tabindex="-1">결과 이름</h2>

    <div class="result-box">
      <h3>두 축으로 본 나의 위치</h3>
      <div class="axis">
        <div class="axis-head"><span>위험 감내도</span><span id="axis-risk-value">0</span></div>
        <div class="axis-track"><div id="axis-risk-bar" class="axis-fill"></div></div>
        <div class="axis-ends"><span>원금 보존 우선</span><span>변동성 수용</span></div>
      </div>
      <div class="axis">
        <div class="axis-head"><span>판단 근거</span><span id="axis-basis-value">0</span></div>
        <div class="axis-track"><div id="axis-basis-bar" class="axis-fill"></div></div>
        <div class="axis-ends"><span>원칙·데이터</span><span>직관·분위기</span></div>
      </div>
      <p id="result-desc" class="result-desc">설명</p>
    </div>

    <div class="result-box result-box--accent">
      <h3>답변에서 자주 보인 편향</h3>
      <p class="bias-intro">모두가 가진 사고 습관입니다. 있다는 걸 아는 것만으로 영향이 줄어듭니다.</p>
      <ul id="result-biases" class="bias-list"></ul>
    </div>

    <div class="result-box">
      <h3>스스로 점검해 볼 것</h3>
      <ul id="result-advice"></ul>
      <a href="{{ '/categories/' | relative_url }}" class="link-arrow recommend-link">다른 글 둘러보기</a>
    </div>

    <p class="test-disclaimer">이 결과는 응답 패턴을 요약한 것일 뿐, 투자 실력이나 성과를 예측하지 않습니다. 투자 판단과 그 결과는 본인에게 귀속됩니다.</p>

    <div class="result-actions">
      <button class="btn-primary btn-secondary" onclick="shareTest()">결과 공유</button>
      <button class="btn-primary" onclick="location.reload()">다시하기</button>
    </div>
  </div>
</div>

<script>
  /* Two axes, not one score.
     The previous version added every answer into a single 7-35 total, which
     forced two unrelated things onto one line: how much volatility someone can
     hold, and what they decide on. A cautious person who follows tips and a
     bold person who follows a written rule are nothing alike, but a single
     total puts them in the same band.

       risk  — 원금 보존 우선 ...... 변동성 수용
       basis — 원칙·데이터 ......... 직관·분위기

     Each option also names the bias it leans on, and the biases that came up
     most are reported back. That is the part worth reading: the archetype is
     a label, the bias is something to actually notice. */
  const questions = [
    {
      q: "보유 종목이 하루 만에 20% 넘게 빠졌다. 찾아봐도 특별한 악재는 없다.",
      axis: "risk",
      a: [
        { text: "이유는 나중에. 일단 전량 팔아 현금으로 옮긴다.", score: 0, bias: "loss_aversion" },
        { text: "불안하지만 비중을 절반으로 줄여 놓는다.", score: 1 },
        { text: "원래 계획대로 둔다. 이 정도 변동은 감안했다.", score: 2 },
        { text: "계획에 있던 추가 매수 구간이라 더 산다.", score: 3 }
      ]
    },
    {
      q: "수익 중인 종목과 손실 중인 종목이 있다. 급히 목돈이 필요해 하나를 팔아야 한다.",
      axis: "basis",
      a: [
        { text: "어느 쪽이든 지금 기준에 안 맞는 것을 판다.", score: 0 },
        { text: "손실 난 쪽을 팔아 세금이라도 아낀다.", score: 1 },
        { text: "수익 난 쪽을 판다. 확정된 이익이 안전하다.", score: 2, bias: "disposition" }
      ]
    },
    {
      q: "친구가 어떤 종목으로 두 배를 벌었다며 인증을 보내왔다.",
      axis: "basis",
      a: [
        { text: "축하하고 넘어간다. 내 기준과는 상관없다.", score: 0 },
        { text: "종목명을 적어 두고 나중에 직접 확인해 본다.", score: 1 },
        { text: "지금 안 사면 나만 뒤처질 것 같아 조바심이 난다.", score: 2, bias: "herding" }
      ]
    },
    {
      q: "종목을 고를 때, 실제로 결정을 좌우하는 것은?",
      axis: "basis",
      a: [
        { text: "재무제표·사업 구조 등 직접 확인한 자료.", score: 0 },
        { text: "차트와 거래량 등 정해 둔 기술적 기준.", score: 1 },
        { text: "커뮤니티 분위기와 자주 보는 채널의 추천.", score: 2, bias: "herding" }
      ]
    },
    {
      q: "최근 1년간 내 판단이 맞은 비율을 스스로 매긴다면?",
      axis: "basis",
      a: [
        { text: "기록해 두지 않아 정확히는 모르겠다.", score: 1, bias: "overconfidence" },
        { text: "기록해 뒀고, 절반쯤 맞았다.", score: 0 },
        { text: "기록은 없지만 대체로 맞았던 것 같다.", score: 2, bias: "overconfidence" }
      ]
    },
    {
      q: "여윳돈이 생겼다. 위험자산 비중을 어떻게 잡을까?",
      axis: "risk",
      a: [
        { text: "대부분 예금 등 원금 보존 쪽에 둔다.", score: 0 },
        { text: "미리 정해 둔 비중대로 나눠 담는다.", score: 1 },
        { text: "지금 가장 유망해 보이는 한 곳에 몰아넣는다.", score: 2, bias: "recency" }
      ]
    },
    {
      q: "산 뒤로 계속 내리는 종목이 있다. 처음 산 이유는 이미 사라졌다.",
      axis: "basis",
      a: [
        { text: "이유가 사라졌으면 정리한다. 산 가격과는 무관하다.", score: 0 },
        { text: "본전까지만 오면 팔려고 기다린다.", score: 2, bias: "sunk_cost" },
        { text: "평단을 낮추려고 더 산다.", score: 2, bias: "sunk_cost" }
      ]
    },
    {
      q: "내 판단과 반대되는 분석 글을 읽었을 때, 보통은?",
      axis: "basis",
      a: [
        { text: "근거가 뭔지 끝까지 읽고 내 판단을 다시 본다.", score: 0 },
        { text: "훑어보고 넘긴다. 반대 의견은 늘 있으니까.", score: 1, bias: "confirmation" },
        { text: "보지 않는다. 흔들리기만 한다.", score: 2, bias: "confirmation" }
      ]
    },
    {
      q: "자정이 넘었다. 시장을 확인하는 빈도는?",
      axis: "risk",
      a: [
        { text: "확인하지 않는다. 정해 둔 주기에만 본다.", score: 0 },
        { text: "하루 몇 번 정도는 들여다본다.", score: 1 },
        { text: "자다 깨서라도 확인해야 마음이 놓인다.", score: 2, bias: "illusion_of_control" }
      ]
    },
    {
      q: "레버리지나 신용 거래에 대한 생각은?",
      axis: "risk",
      a: [
        { text: "쓰지 않는다. 감당할 수 있는 돈으로만 한다.", score: 0 },
        { text: "규칙을 정해 두고 제한적으로만 쓴다.", score: 1 },
        { text: "자산을 불리려면 필요하다고 본다.", score: 2, bias: "overconfidence" }
      ]
    }
  ];

  /* Each bias gets a plain-language line. Naming it is the point — these are
     ordinary habits of thought, not character flaws, and they are documented
     patterns rather than something invented for this quiz. */
  const biasInfo = {
    loss_aversion: {
      label: "손실 회피",
      desc: "같은 크기라도 잃는 아픔이 버는 기쁨보다 크게 느껴집니다. 그래서 급락에 계획보다 먼저 손이 나갑니다."
    },
    disposition: {
      label: "처분 효과",
      desc: "오른 것은 빨리 팔고 내린 것은 오래 들고 있게 됩니다. 파는 기준이 가치가 아니라 매수가가 되어 있을 때 나타납니다."
    },
    herding: {
      label: "군집 행동",
      desc: "많은 사람이 향하는 쪽이 안전해 보입니다. 다만 그때는 이미 가격에 그 기대가 들어가 있는 경우가 많습니다."
    },
    overconfidence: {
      label: "과신",
      desc: "기억은 맞았던 판단을 더 잘 남깁니다. 기록해 두지 않으면 실제 적중률은 대체로 기억보다 낮습니다."
    },
    recency: {
      label: "최신 편향",
      desc: "최근에 잘 오른 것이 앞으로도 오를 것처럼 느껴집니다. 최근의 흐름이 미래의 근거로 바뀌는 지점입니다."
    },
    sunk_cost: {
      label: "매몰 비용",
      desc: "이미 쓴 돈이 아까워 결정을 미루게 됩니다. 산 가격은 시장이 모르는 정보이고, 앞으로의 가치와도 무관합니다."
    },
    confirmation: {
      label: "확증 편향",
      desc: "내 생각을 뒷받침하는 정보가 더 잘 보이고 더 설득력 있게 읽힙니다. 반대 근거를 일부러 찾아야 균형이 맞습니다."
    },
    illusion_of_control: {
      label: "통제 착각",
      desc: "자주 들여다보면 상황을 관리하고 있다는 느낌이 듭니다. 확인 빈도와 결과 사이의 관계는 생각보다 약합니다."
    }
  };

  /* Five archetypes on the grid the two axes make: low/high risk crossed with
     principle/intuition, plus a middle for people who sit near the centre of
     both. */
  const results = {
    turtle: {
      emoji: "🛡️", type: "저위험 · 원칙형", name: "돌다리를 두드리는 거북이",
      desc: "원금이 줄어드는 상황을 특히 불편해하고, 결정은 미리 정해 둔 기준을 따릅니다. 흔들리지 않는 대신 기회를 늦게 잡는 편입니다.",
      checks: [
        "지키는 것과 아무것도 하지 않는 것을 구분하고 있는지.",
        "위험을 피한 대가로 무엇을 포기했는지 계산해 본 적 있는지.",
        "기준이 보수적인 것인지, 그냥 결정을 미루는 것인지."
      ]
    },
    squirrel: {
      emoji: "🐿️", type: "저위험 · 직관형", name: "여기저기 묻어 두는 다람쥐",
      desc: "크게 걸지는 않지만, 무엇을 살지는 그때그때 분위기를 따라 정합니다. 손실은 작게 막는 대신 판단이 쌓이지 않습니다.",
      checks: [
        "지금 가진 것들을 왜 샀는지 각각 설명할 수 있는지.",
        "조심스러운 성향과 기준 없음이 겹쳐 있지는 않은지.",
        "소액이라는 이유로 검토를 건너뛰고 있지는 않은지."
      ]
    },
    owl: {
      emoji: "🦉", type: "균형형", name: "양쪽을 저울질하는 올빼미",
      desc: "위험도 판단 근거도 한쪽으로 치우치지 않았습니다. 상황에 맞춰 조절하는 편이지만, 그 조절의 기준이 그때그때 달라질 수 있습니다.",
      checks: [
        "유연한 것인지, 기준이 매번 바뀌는 것인지.",
        "조절의 근거를 사후가 아니라 사전에 적어 두는지.",
        "중간을 택하는 것이 판단을 미루는 방식이 되고 있지는 않은지."
      ]
    },
    lion: {
      emoji: "🦁", type: "고위험 · 원칙형", name: "확신에 무게를 싣는 사자",
      desc: "변동성을 감수하되, 그 결정은 스스로 세운 근거에서 나옵니다. 근거가 맞을 때는 크게 가지만, 틀렸을 때도 크게 갑니다.",
      checks: [
        "확신의 근거와 확신의 크기가 비례하는지.",
        "틀렸다고 인정하는 조건을 미리 정해 두었는지.",
        "한 판단에 얼마까지 걸지 상한을 두고 있는지."
      ]
    },
    cheetah: {
      emoji: "🐆", type: "고위험 · 직관형", name: "먼저 뛰고 보는 치타",
      desc: "빠르게 반응하고 크게 겁니다. 남들보다 먼저 움직이는 것이 강점이지만, 근거가 뒤따라오는 경우가 많아 결과의 폭이 넓습니다.",
      checks: [
        "빠른 판단과 반사적 반응을 구분하고 있는지.",
        "결정을 내린 이유를 사기 전에 적어 두는지.",
        "회복하기 어려운 크기까지 걸고 있지는 않은지."
      ]
    }
  };

  let currentStep = 0;
  const totals = { risk: 0, basis: 0 };
  const maxima = { risk: 0, basis: 0 };
  const biasTally = {};

  /* Each question contributes 0..1 to its axis. Summing raw scores instead let
     a four-option question outweigh a three-option one, and left the risk axis
     centred at 67 — someone picking the middle answer every time came out as
     high-risk. */
  questions.forEach(function (q) {
    q.max = Math.max.apply(null, q.a.map(function (o) { return o.score; }));
    maxima[q.axis] += 1;
  });

  function startTest() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    showQuestion();
  }

  function showQuestion() {
    const q = questions[currentStep];
    document.getElementById('question-text').innerText = 'Q' + (currentStep + 1) + '. ' + q.q;

    const percent = (currentStep / questions.length) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';

    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';

    q.a.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.innerText = opt.text;
      btn.onclick = function () { selectOption(q.axis, opt); };
      optsContainer.appendChild(btn);
    });

    enterQuestion();
  }

  /* Presentation only, once the step is built (spec 5, M14). The answer that
     was pressed goes away with the old options, which dropped keyboard and
     screen-reader focus back to the top of the page; focus moves to the new
     question instead, without scrolling, and Tab carries on into its
     options. From the second question on, the question and its options also
     slide in from 12px to the right, 40ms apart, 220ms on the site's ease-out
     curve: enter only, so a quick answer never waits on an exit, and opacity
     and transform only. The first question arrives with its screen's own
     rise. Skipped under reduced motion: the CSS blanket cannot reach
     el.animate(). */
  function enterQuestion() {
    const heading = document.getElementById('question-text');
    heading.focus({ preventScroll: true });
    if (currentStep === 0 || !heading.animate) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [heading].concat(Array.prototype.slice.call(document.querySelectorAll('#options-container .btn-option')));
    items.forEach(function (el, i) {
      el.animate(
        [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 220, delay: i * 40, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }
      );
    });
  }

  function selectOption(axis, opt) {
    totals[axis] += opt.score / questions[currentStep].max;
    if (opt.bias) {
      biasTally[opt.bias] = (biasTally[opt.bias] || 0) + 1;
    }
    currentStep++;

    if (currentStep < questions.length) {
      showQuestion();
    } else {
      showLoading();
    }
  }

  function showLoading() {
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('loading-screen').classList.add('active');

    /* 0, not the 1500ms "analysis" it used to be (owner sign-off, spec 9.1):
       the result is already known on the last tap, so the wait computed
       nothing. It also moved the result swap past the browser's 500ms
       after-input window, so the card's growth counted as layout shift
       (CLS 0.201 at 375px, 0.074 at 1440px). At 0 the swap lands inside that
       window. The loading screen is kept, so a delay is one number away. */
    setTimeout(function () {
      document.getElementById('loading-screen').classList.remove('active');
      showResult();
    }, 0);
  }

  function pickArchetype(risk, basis) {
    /* Anything close to the middle on both axes is genuinely a middle result,
       and saying so is more honest than rounding it to a corner. */
    if (risk > 35 && risk < 65 && basis > 35 && basis < 65) return 'owl';
    if (risk >= 50) return basis >= 50 ? 'cheetah' : 'lion';
    return basis >= 50 ? 'squirrel' : 'turtle';
  }

  function showResult() {
    document.getElementById('result-screen').classList.add('active');

    const risk = Math.round((totals.risk / maxima.risk) * 100);
    const basis = Math.round((totals.basis / maxima.basis) * 100);
    const res = results[pickArchetype(risk, basis)];

    document.getElementById('result-emoji').innerText = res.emoji;
    document.getElementById('result-type').innerText = res.type;
    document.getElementById('result-name').innerText = res.name;
    document.getElementById('result-desc').innerText = res.desc;

    document.getElementById('axis-risk-value').innerText = risk;
    document.getElementById('axis-basis-value').innerText = basis;
    /* Next frame, so the bars animate from zero instead of appearing full. */
    requestAnimationFrame(function () {
      document.getElementById('axis-risk-bar').style.width = risk + '%';
      document.getElementById('axis-basis-bar').style.width = basis + '%';
    });

    const biasList = document.getElementById('result-biases');
    biasList.innerHTML = '';
    const ranked = Object.keys(biasTally).sort(function (a, b) { return biasTally[b] - biasTally[a]; }).slice(0, 3);

    if (!ranked.length) {
      const li = document.createElement('li');
      li.innerText = '이번 답변에서는 두드러진 편향이 나타나지 않았습니다. 다만 문항이 열 개뿐이라는 점은 감안하세요.';
      biasList.appendChild(li);
    } else {
      ranked.forEach(function (key) {
        const info = biasInfo[key];
        const li = document.createElement('li');
        const name = document.createElement('b');
        name.innerText = info.label + ' — ';
        li.appendChild(name);
        li.appendChild(document.createTextNode(info.desc));
        biasList.appendChild(li);
      });
    }

    const checkList = document.getElementById('result-advice');
    checkList.innerHTML = '';
    res.checks.forEach(function (txt) {
      const li = document.createElement('li');
      li.innerText = txt;
      checkList.appendChild(li);
    });

    /* Focus follows the swap to the result's name, as it does to each new
       question (enterQuestion). */
    document.getElementById('result-name').focus({ preventScroll: true });
  }

  function shareTest() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: '투자 성향 테스트',
        text: '위험 감내도와 판단 근거, 두 축으로 보는 10문항 자기 점검.',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다. 친구들에게 공유해보세요!');
      });
    }
  }
</script>
