---
layout: single
title: ""
permalink: /investment-test/
classes: wide
author_profile: false
sidebar:
  nav: false
# This is an interactive widget, not an article. The automatic contents list
# counts headings and was picking up the quiz's own placeholders — it rendered
# a table of contents reading "질문 내용, 결과 이름".
toc: false
---

<style>
  /* Minimal Mistakes 테마의 기본 제목 영역 숨기기 */
  .page__title, .page__header {
    display: none !important;
  }

  /* Local Styles for Investment Test */
  :root {
    --toss-blue: #1b6fe0; /* 4.78:1 with white text; #3182f6 was 3.71:1 */
    --bg-gray: #f2f4f6;
    --card-bg: #ffffff;
    --text-dark: #191f28;
    --text-gray: #616a75; /* clears 4.5:1 on white, --surface-soft and --accent-soft alike */
    --on-accent: #ffffff;
    --accent-soft: #e8f3ff;
    --accent-strong: #1b64da;
    --surface-soft: #f9fafb;
    --option-hover: #f9fbff;
    --line: #e5e8eb;
    --neutral-btn: #333333;
    --on-neutral: #ffffff;
  }

  /* This widget carries its own palette and used to hardcode white cards. Once
     the site gained a dark theme, the inherited light body text landed on those
     white cards — unreadable. Its colours now flip with the rest of the site. */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --toss-blue: #7fb0ff;
      --bg-gray: #14171a;
      --card-bg: #1c2024;
      --text-dark: #d7dade;
      --text-gray: #9aa3ab;
      /* The accent is light in dark mode, so its label goes dark. */
      --on-accent: #14171a;
      --accent-soft: #1a2430;
      --accent-strong: #9cc4ff;
      --surface-soft: #1c2024;
      --option-hover: #22272b;
      --line: #2b3137;
      --neutral-btn: #2b3137;
      --on-neutral: #d7dade;
    }
  }
  :root[data-theme="dark"] {
    --toss-blue: #7fb0ff;
    --bg-gray: #14171a;
    --card-bg: #1c2024;
    --text-dark: #d7dade;
    --text-gray: #9aa3ab;
    --on-accent: #14171a;
    --accent-soft: #1a2430;
    --accent-strong: #9cc4ff;
    --surface-soft: #1c2024;
    --option-hover: #22272b;
    --line: #2b3137;
    --neutral-btn: #2b3137;
    --on-neutral: #d7dade;
  }

  /* Two-axis readout on the result screen */
  .axis { margin-bottom: 18px; text-align: left; }
  .axis-head {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 0.9rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;
  }
  .axis-head span:last-child { color: var(--toss-blue); font-variant-numeric: tabular-nums; }
  .axis-track {
    height: 8px; border-radius: 4px; background-color: var(--bg-gray); overflow: hidden;
  }
  .axis-fill {
    height: 100%; width: 0; border-radius: 4px; background-color: var(--toss-blue);
    transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .axis-ends {
    display: flex; justify-content: space-between;
    font-size: 0.75rem; color: var(--text-gray); margin-top: 5px;
  }
  @media (prefers-reduced-motion: reduce) {
    .axis-fill { transition: none; }
  }

  .result-desc { line-height: 1.6; color: var(--text-gray); text-align: left; margin-top: 4px; }
  .bias-intro { font-size: 0.85rem; color: var(--text-gray); text-align: left; margin-bottom: 10px; }
  .bias-list { text-align: left; }
  .bias-list li { margin-bottom: 10px; }
  .bias-list b { color: var(--text-dark); }

  .test-disclaimer {
    margin-top: 18px;
    font-size: 0.78rem;
    line-height: 1.55;
    color: var(--text-gray);
    text-align: left;
  }

  /* Reset box-sizing for this component */
  .investment-test-container, .investment-test-container * {
    box-sizing: border-box;
  }

  .investment-test-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 30px 20px;
    font-family: "Pretendard", -apple-system, sans-serif;
    text-align: center;
    background-color: var(--card-bg);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    overflow: hidden; /* Prevent overflow */
    position: relative;
    min-height: 550px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Screens */
  .screen {
    display: none;
    width: 100%;
    animation: fadeIn 0.5s ease-out;
  }

  .screen.active {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Typography */
  .test-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-dark);
    margin-bottom: 1rem;
    line-height: 1.3;
    word-keep: keep-all; /* Korean typography */
  }

  p.test-desc {
    font-size: 1.1rem;
    color: var(--text-gray);
    margin-bottom: 2rem;
    line-height: 1.6;
    word-break: keep-all;
  }

  /* Buttons */
  .btn-primary {
    background-color: var(--toss-blue);
    color: var(--on-accent);
    border: none;
    padding: 16px 32px;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
    width: 100%;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);
  }

  .btn-primary:hover {
    background-color: var(--accent-strong);
    transform: translateY(-2px);
  }

  .btn-option {
    background-color: var(--card-bg);
    border: 2px solid var(--line);
    color: var(--text-dark);
    padding: 18px 20px;
    margin-bottom: 12px;
    border-radius: 16px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s;
    text-align: left;
    line-height: 1.5;
    word-break: keep-all; /* Prevent awkward word breaks */
    word-wrap: break-word; /* Safety wrap */
  }

  .btn-option:hover {
    border-color: var(--toss-blue);
    background-color: var(--option-hover);
    color: var(--toss-blue);
  }

  /* Progress Bar */
  .progress-container {
    width: 100%;
    background-color: var(--line);
    height: 8px;
    border-radius: 4px;
    margin-bottom: 30px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background-color: var(--toss-blue);
    width: 0%;
    transition: width 0.3s ease;
  }

  /* Result Section */
  .result-emoji {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }

  .result-type {
    font-size: 1.2rem;
    color: var(--toss-blue);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .result-name {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    word-break: keep-all;
    line-height: 1.3;
  }

  .result-box {
    background-color: var(--surface-soft);
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
    box-sizing: border-box; /* Explicit safety */
  }

  .result-box--accent { background-color: var(--accent-soft); }

  .result-box h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
    margin-top: 0;
  }

  .result-box ul {
    padding-left: 20px;
    margin: 0;
    font-size: 0.95rem;
    color: var(--text-gray);
  }
  
  .result-box li {
    margin-bottom: 6px;
  }

  .recommend-link {
    display: block;
    margin-top: 10px;
    color: var(--toss-blue);
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }
  
  .recommend-link:hover {
    border-bottom: 1px solid var(--toss-blue);
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
  }
  
  /* Mobile optimization */
  @media (max-width: 600px) {
    .investment-test-container {
      padding: 20px 15px; /* Reduced padding */
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      min-height: 450px;
    }
    .test-title { 
      font-size: 1.5rem; 
      margin-top: 0;
    }
    .btn-option {
      padding: 15px;
      font-size: 0.95rem;
    }
    .result-name {
      font-size: 1.5rem;
    }
  }
</style>

<div class="investment-test-container">
  <!-- 1. Start Screen -->
  <div id="start-screen" class="screen active">
    <div style="font-size: 4rem; margin-bottom: 20px;">💰</div>
    <h2 class="test-title">투자 성향 테스트</h2>
    <p class="test-desc">위험을 얼마나 견디는가, 그리고<br>무엇을 근거로 결정하는가.<br>두 축으로 나누어 보는 10문항</p>
    <button class="btn-primary" onclick="startTest()">테스트 시작하기</button>
    <p class="test-disclaimer">행동경제학에서 다루는 편향을 소재로 한 자기 점검용 테스트입니다. 투자 자문이나 권유가 아니며, 결과가 특정 상품의 적합성을 판단해 주지 않습니다.</p>
  </div>

  <!-- 2. Quiz Screen -->
  <div id="quiz-screen" class="screen">
    <div class="progress-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>
    <h2 id="question-text" class="test-title" style="font-size: 1.4rem;">질문 내용</h2>
    <div id="options-container" style="width: 100%; margin-top: 20px;">
      <!-- Options will be injected here -->
    </div>
  </div>

  <!-- 3. Loading Screen -->
  <div id="loading-screen" class="screen">
    <div style="font-size: 3rem;">🧠</div>
    <h2 style="margin-top: 20px;">응답 분석 중...</h2>
    <p>위험 감내도 계산 중...</p>
    <p>판단 근거 유형 분류 중...</p>
  </div>

  <!-- 4. Result Screen -->
  <div id="result-screen" class="screen">
    <div id="result-emoji" class="result-emoji">🦁</div>
    <div id="result-type" class="result-type">TYPE A</div>
    <h2 id="result-name" class="result-name">결과 이름</h2>
    
    <div class="result-box">
      <h3>📊 두 축으로 본 나의 위치</h3>
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
      <h3>🧠 답변에서 자주 보인 편향</h3>
      <p class="bias-intro">모두가 가진 사고 습관입니다. 있다는 걸 아는 것만으로 영향이 줄어듭니다.</p>
      <ul id="result-biases" class="bias-list"></ul>
    </div>

    <div class="result-box">
      <h3>🔍 스스로 점검해 볼 것</h3>
      <ul id="result-advice"></ul>
      <a href="/categories/" class="recommend-link">👉 다른 글 둘러보기</a>
    </div>

    <p class="test-disclaimer">이 결과는 응답 패턴을 요약한 것일 뿐, 투자 실력이나 성과를 예측하지 않습니다. 투자 판단과 그 결과는 본인에게 귀속됩니다.</p>

    <div style="display: flex; gap: 10px; width: 100%;">
      <button class="btn-primary" style="flex: 1; background-color: var(--neutral-btn); color: var(--on-neutral);" onclick="shareTest()">결과 공유</button>
      <button class="btn-primary" style="flex: 1;" onclick="location.reload()">다시하기</button>
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
        { text: "😱 이유는 나중에. 일단 전량 팔아 현금으로 옮긴다.", score: 0, bias: "loss_aversion" },
        { text: "😮‍💨 불안하지만 비중을 절반으로 줄여 놓는다.", score: 1 },
        { text: "🧘 원래 계획대로 둔다. 이 정도 변동은 감안했다.", score: 2 },
        { text: "😋 계획에 있던 추가 매수 구간이라 더 산다.", score: 3 }
      ]
    },
    {
      q: "수익 중인 종목과 손실 중인 종목이 있다. 급히 목돈이 필요해 하나를 팔아야 한다.",
      axis: "basis",
      a: [
        { text: "📋 어느 쪽이든 지금 기준에 안 맞는 것을 판다.", score: 0 },
        { text: "🤔 손실 난 쪽을 팔아 세금이라도 아낀다.", score: 1 },
        { text: "😌 수익 난 쪽을 판다. 확정된 이익이 안전하다.", score: 2, bias: "disposition" }
      ]
    },
    {
      q: "친구가 어떤 종목으로 두 배를 벌었다며 인증을 보내왔다.",
      axis: "basis",
      a: [
        { text: "🙂 축하하고 넘어간다. 내 기준과는 상관없다.", score: 0 },
        { text: "🔎 종목명을 적어 두고 나중에 직접 확인해 본다.", score: 1 },
        { text: "🔥 지금 안 사면 나만 뒤처질 것 같아 조바심이 난다.", score: 2, bias: "herding" }
      ]
    },
    {
      q: "종목을 고를 때, 실제로 결정을 좌우하는 것은?",
      axis: "basis",
      a: [
        { text: "📑 재무제표·사업 구조 등 직접 확인한 자료.", score: 0 },
        { text: "📈 차트와 거래량 등 정해 둔 기술적 기준.", score: 1 },
        { text: "🗣️ 커뮤니티 분위기와 자주 보는 채널의 추천.", score: 2, bias: "herding" }
      ]
    },
    {
      q: "최근 1년간 내 판단이 맞은 비율을 스스로 매긴다면?",
      axis: "basis",
      a: [
        { text: "🤷 기록해 두지 않아 정확히는 모르겠다.", score: 1, bias: "overconfidence" },
        { text: "📓 기록해 뒀고, 절반쯤 맞았다.", score: 0 },
        { text: "😎 기록은 없지만 대체로 맞았던 것 같다.", score: 2, bias: "overconfidence" }
      ]
    },
    {
      q: "여윳돈이 생겼다. 위험자산 비중을 어떻게 잡을까?",
      axis: "risk",
      a: [
        { text: "🏦 대부분 예금 등 원금 보존 쪽에 둔다.", score: 0 },
        { text: "⚖️ 미리 정해 둔 비중대로 나눠 담는다.", score: 1 },
        { text: "🎯 지금 가장 유망해 보이는 한 곳에 몰아넣는다.", score: 2, bias: "recency" }
      ]
    },
    {
      q: "산 뒤로 계속 내리는 종목이 있다. 처음 산 이유는 이미 사라졌다.",
      axis: "basis",
      a: [
        { text: "✂️ 이유가 사라졌으면 정리한다. 산 가격과는 무관하다.", score: 0 },
        { text: "😐 본전까지만 오면 팔려고 기다린다.", score: 2, bias: "sunk_cost" },
        { text: "💧 평단을 낮추려고 더 산다.", score: 2, bias: "sunk_cost" }
      ]
    },
    {
      q: "내 판단과 반대되는 분석 글을 읽었을 때, 보통은?",
      axis: "basis",
      a: [
        { text: "🧐 근거가 뭔지 끝까지 읽고 내 판단을 다시 본다.", score: 0 },
        { text: "😑 훑어보고 넘긴다. 반대 의견은 늘 있으니까.", score: 1, bias: "confirmation" },
        { text: "🙅 보지 않는다. 흔들리기만 한다.", score: 2, bias: "confirmation" }
      ]
    },
    {
      q: "자정이 넘었다. 시장을 확인하는 빈도는?",
      axis: "risk",
      a: [
        { text: "😴 확인하지 않는다. 정해 둔 주기에만 본다.", score: 0 },
        { text: "📱 하루 몇 번 정도는 들여다본다.", score: 1 },
        { text: "🌙 자다 깨서라도 확인해야 마음이 놓인다.", score: 2, bias: "illusion_of_control" }
      ]
    },
    {
      q: "레버리지나 신용 거래에 대한 생각은?",
      axis: "risk",
      a: [
        { text: "🚫 쓰지 않는다. 감당할 수 있는 돈으로만 한다.", score: 0 },
        { text: "📐 규칙을 정해 두고 제한적으로만 쓴다.", score: 1 },
        { text: "🚀 자산을 불리려면 필요하다고 본다.", score: 2, bias: "overconfidence" }
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

    setTimeout(function () {
      document.getElementById('loading-screen').classList.remove('active');
      showResult();
    }, 1500);
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
