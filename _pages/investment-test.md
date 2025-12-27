---
layout: single
title: ""
permalink: /investment-test/
classes: wide
author_profile: false
sidebar:
  nav: false
---

<style>
  /* Global Resets & Variables */
  :root {
    --toss-blue: #3182f6;
    --text-dark: #191f28;
    --text-gray: #8b95a1;
    --bg-pink: #fff0f6;
    --checker-color: #ffdeeb;
    --btn-yellow: #ffdc3c;
    --btn-green: #28d05a;
    --btn-black: #191f28;
  }

  * { box-sizing: border-box; }

  /* Main Container Override */
  .investment-test-container {
    width: 100%;
    max-width: 500px; /* App-like width */
    margin: 0 auto;
    padding: 0;
    font-family: "Pretendard", -apple-system, sans-serif;
    text-align: center;
    background-color: #fff;
    border-radius: 0; /* Reset for mobile feel */
    overflow: hidden;
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* 
   * SCREEN 1: START SCREEN DESIGN 
   * Pink Checkered Background & Specific Layout
   */
  #start-screen {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-pink);
    background-image:
      linear-gradient(45deg, var(--checker-color) 25%, transparent 25%),
      linear-gradient(-45deg, var(--checker-color) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--checker-color) 75%),
      linear-gradient(-45deg, transparent 75%, var(--checker-color) 75%);
    background-size: 40px 40px;
    background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
    padding: 20px;
    position: relative;
  }

  /* Top Nav */
  .app-nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    color: var(--text-dark);
    font-size: 1.2rem;
  }
  .nav-center {
    font-size: 0.9rem;
    font-weight: 700;
    background: rgba(255,255,255,0.5);
    padding: 4px 12px;
    border-radius: 20px;
  }
  .nav-right { display: flex; gap: 15px; }

  /* Main Title */
  .main-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--text-dark);
    line-height: 1.2;
    margin-bottom: 20px;
    text-shadow: 2px 2px 0px #fff;
    word-keep: keep-all;
  }

  /* Yellow Badge Button */
  .yellow-badge {
    background-color: var(--btn-yellow);
    color: var(--text-dark);
    font-weight: 800;
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 1rem;
    box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    display: inline-block;
    border: 2px solid #fff;
  }

  /* Central Card Section */
  .central-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    width: 100%;
    border-radius: 30px;
    padding: 25px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .card-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .mini-card {
    flex: 1;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 15px 10px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  }
  .mini-card h4 {
    font-size: 0.85rem;
    color: var(--text-gray);
    margin: 0 0 8px 0;
  }
  .mini-card p {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0;
    line-height: 1.3;
    word-break: keep-all;
  }

  .green-btn {
    background-color: var(--btn-green);
    color: white;
    font-weight: 700;
    padding: 12px;
    border-radius: 12px;
    font-size: 1rem;
    box-shadow: 0 4px 0px #1e9e45; /* 3D effect */
    margin-bottom: 5px;
  }

  .hashtag-row {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .hashtag {
    background: #fff;
    border: 1px solid var(--text-dark);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* Sub Text & Stats */
  .sub-text-msg {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 20px;
  }

  .participant-info {
    margin-bottom: 30px;
  }
  .participant-label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 4px;
  }
  .participant-count {
    font-size: 2rem;
    font-weight: 900;
    color: var(--text-dark);
    font-family: 'Roboto', sans-serif; /* For nice numbers */
  }

  /* Bottom Black Start Button */
  .start-btn-black {
    width: 100%;
    background-color: var(--btn-black);
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 20px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    transition: transform 0.1s;
    margin-top: auto; /* Push to bottom */
  }
  .start-btn-black:active { transform: scale(0.98); }
  
  .btn-main-text {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .btn-sub-text {
    display: block;
    font-size: 0.9rem;
    color: #aaa;
    font-weight: 400;
  }


  /* 
   * QUIZ & RESULT SCREEN STYLES (Keep Clean White)
   */
  .screen:not(#start-screen) {
    padding: 30px 20px;
    width: 100%;
    height: 100%;
    background: #fff;
    flex-grow: 1;
    display: none; /* Hidden by default */
  }
  
  .screen.active {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Re-using existing styles for quiz/result */
  .test-title { font-size: 1.4rem; font-weight: 800; color: var(--text-dark); margin-bottom: 1rem; }
  .btn-option {
    background: #fff; border: 2px solid #e5e8eb; color: var(--text-dark);
    padding: 18px 20px; margin-bottom: 12px; border-radius: 16px;
    cursor: pointer; width: 100%; font-size: 1rem; font-weight: 600;
    text-align: left; transition: all 0.2s;
  }
  .btn-option:hover { border-color: var(--toss-blue); background: #f9fbff; color: var(--toss-blue); }
  
  .progress-container { width: 100%; background: #e5e8eb; height: 6px; border-radius: 3px; margin-bottom: 30px; }
  .progress-bar { height: 100%; background: var(--toss-blue); width: 0%; transition: width 0.3s; }

  /* Result Screen Specifics */
  .result-emoji { font-size: 4rem; margin-bottom: 10px; animation: bounce 2s infinite; }
  .result-type { font-size: 1rem; color: var(--toss-blue); font-weight: 700; margin-bottom: 5px; }
  .result-name { font-size: 1.6rem; font-weight: 800; margin-bottom: 20px; word-break: keep-all; line-height: 1.3; }
  .result-box { background: #f9fafb; padding: 20px; border-radius: 16px; margin-bottom: 20px; width: 100%; text-align: left; }
  .result-box h3 { font-size: 1rem; margin: 0 0 10px 0; }
  .result-box ul { padding-left: 20px; margin: 0; font-size: 0.9rem; color: #666; }
  .result-box li { margin-bottom: 5px; }
  .btn-action { background: var(--toss-blue); color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 700; flex: 1; cursor: pointer; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
</style>

<div class="investment-test-container">

  <!-- 1. START SCREEN (Redesigned) -->
  <div id="start-screen">
    <!-- Nav -->
    <nav class="app-nav">
      <i class="fas fa-bars"></i>
      <span class="nav-center">2025년 특징</span>
      <div class="nav-right">
        <i class="fas fa-search"></i>
        <i class="fas fa-user"></i>
      </div>
    </nav>

    <!-- Title -->
    <h1 class="main-title">2025년 연말<br>투자 성향 테스트</h1>

    <!-- Yellow CTA -->
    <div class="yellow-badge">내 투자 동물 유형 찾기!</div>

    <!-- Central Card -->
    <div class="central-card">
      <div class="card-row">
        <div class="mini-card">
          <h4>투자 스타일</h4>
          <p>돌격대장<br>일단 사고 본다<br>급등주 추격</p>
        </div>
        <div class="mini-card">
          <h4>멘탈 관리</h4>
          <p>유리멘탈<br>파란불에 덜덜<br>하루종일 차트봄</p>
        </div>
      </div>
      <div class="green-btn">2025 목표 수익률</div>
      <div class="hashtag-row">
        <div class="hashtag">#안전제일</div>
        <div class="hashtag">#인생한방</div>
      </div>
    </div>

    <!-- Text & Stats -->
    <p class="sub-text-msg">당신의 2025년 투자 운세는?</p>
    
    <div class="participant-info">
      <span class="participant-label">현재까지 참여자 수</span>
      <span class="participant-count">186,004 명</span>
    </div>

    <!-- Black Start Button -->
    <button class="start-btn-black" onclick="startTest()">
      <span class="btn-main-text">시작하기</span>
      <span class="btn-sub-text">3분 만에 확인하는 나의 투자 성향</span>
    </button>
  </div>


  <!-- 2. QUIZ SCREEN -->
  <div id="quiz-screen" class="screen">
    <div class="progress-container"><div id="progress-bar" class="progress-bar"></div></div>
    <h2 id="question-text" class="test-title">질문 내용</h2>
    <div id="options-container" style="width: 100%; margin-top: 20px;"></div>
  </div>


  <!-- 3. LOADING SCREEN -->
  <div id="loading-screen" class="screen" style="text-align: center;">
    <div style="font-size: 3rem; margin-bottom: 20px;">🧠</div>
    <h2 style="margin-bottom: 10px;">투자 패턴 분석 중...</h2>
    <p style="color: #888;">AI가 당신의 뇌구조를 스캔하고 있습니다.</p>
  </div>


  <!-- 4. RESULT SCREEN -->
  <div id="result-screen" class="screen">
    <div id="result-emoji" class="result-emoji">🦁</div>
    <div id="result-type" class="result-type">TYPE A</div>
    <h1 id="result-name" class="result-name">결과 이름</h1>
    
    <div class="result-box">
      <h3>📊 당신의 투자 스타일</h3>
      <p id="result-desc" style="line-height: 1.5; color: #555;">설명</p>
    </div>

    <!-- AdSense Space (Clean) -->
    <div style="width: 100%; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <!-- AdSense Code Here -->
    </div>

    <div class="result-box" style="background-color: #e8f3ff;">
      <h3 style="color: var(--toss-blue);">💡 승리를 위한 솔루션</h3>
      <ul id="result-advice"></ul>
      <br>
      <a href="/categories/" class="recommend-link">👉 추천 투자 아티클 읽기</a>
    </div>

    <div style="display: flex; gap: 10px; width: 100%;">
      <button class="btn-action" style="background: #333;" onclick="shareTest()">공유하기</button>
      <button class="btn-action" onclick="location.reload()">다시하기</button>
    </div>
  </div>

</div>

<script>
  // Advanced Quiz Data (Same as before)
  const questions = [
    {
      q: "친구가 '이 코인(주식) 사서 2배 벌었어!'라며 수익 인증을 했다. 나의 솔직한 심정은?",
      a: [
        { text: "😒 '운이 좋았네' 하고 무시한다. 내 갈 길 간다.", score: 1 },
        { text: "🤔 '오 그래?' 어떤 종목인지 분석해본다.", score: 3 },
        { text: "🔥 '나만 벼락거지 되는 거 아냐?' 당장 따라 살까 고민한다.", score: 5 }
      ]
    },
    {
      q: "보유 종목이 하루 만에 -20% 폭락했다. 뉴스를 보니 특별한 악재는 없다.",
      a: [
        { text: "😱 너무 무서워서 일단 전량 매도하고 현금화한다.", score: 1 },
        { text: "🧘‍♀️ 존버는 승리한다. 어플을 지우고 잊어버린다.", score: 3 },
        { text: "😋 세력의 개미 털기다! 풀매수(추매) 기회로 삼는다.", score: 5 }
      ]
    },
    {
      q: "투자할 종목을 고를 때 가장 중요하게 보는 것은?",
      a: [
        { text: "🛡️ 잃지 않는 것이 중요하다. 시총 상위 우량주.", score: 1 },
        { text: "📊 재무제표, 백서, 로드맵 등 펀더멘탈.", score: 2 },
        { text: "📈 차트의 거래량과 보조지표 (기술적 분석).", score: 4 },
        { text: "🗣️ 커뮤니티의 화력과 유튜버의 추천.", score: 5 }
      ]
    },
    {
      q: "여윳돈 1,000만 원이 생겼다. 어떻게 배분할까?",
      a: [
        { text: "은행 예적금 70%, 주식/코인 30%.", score: 1 },
        { text: "주식/코인 60%, 현금 40% 분할 매수.", score: 3 },
        { text: "가장 핫한 주도 섹터 대장주에 몰빵.", score: 5 }
      ]
    },
    {
      q: "내가 선호하는 익절(수익 실현) 타이밍은?",
      a: [
        { text: "소소하게 5~10% 먹으면 만족하고 판다.", score: 1 },
        { text: "목표가(Target Price)가 올 때까지 기다린다.", score: 3 },
        { text: "추세가 꺾일 때까지 끝까지 발라 먹는다.", score: 5 }
      ]
    },
    {
      q: "잠들기 전, 미국 시장(또는 코인 시장)을 확인하는 빈도는?",
      a: [
        { text: "확인 안 한다. 어차피 장기 투자니까.", score: 1 },
        { text: "중요한 이슈가 있을 때만 챙겨본다.", score: 3 },
        { text: "새벽에도 자다 깨서 시세를 확인해야 안심이 된다.", score: 5 }
      ]
    },
    {
      q: "레버리지(신용/선물) 거래에 대한 나의 생각은?",
      a: [
        { text: "패가망신의 지름길. 절대 안 한다.", score: 1 },
        { text: "확실한 자리에서는 2배 정도 써볼 만하다.", score: 3 },
        { text: "시드머니 불리려면 고배율 레버리지는 필수다.", score: 5 }
      ]
    }
  ];

  // 5 Investment Archetypes
  const results = {
    turtle: {
      range: [7, 13],
      emoji: "🛡️",
      type: "철벽방어형",
      name: "돌다리도 두드리는 거북이",
      desc: "당신에게 투자는 '자산 증식'보다 '자산 방어'의 수단입니다. 원금 손실에 대한 공포가 크기 때문에 변동성을 견디기 힘들어합니다. 대박보다는 마음 편한 투자를 선호합니다.",
      advice: ["예적금만 고집하면 인플레이션에 뒤쳐집니다.", "S&P500 ETF나 비트코인 적립식 매수부터 시작해보세요.", "개별 종목보다는 '시장 전체'를 사는 것이 좋습니다."]
    },
    owl: {
      range: [14, 20],
      emoji: "🦉",
      type: "전략가형",
      name: "숲을 꿰뚫어 보는 올빼미",
      desc: "감정보다는 이성과 논리를 중시합니다. 남들이 좋다고 해서 무작정 사지 않으며, 스스로 납득할 만한 근거(데이터)가 있어야 움직입니다. 밸런스 잡힌 투자자입니다.",
      advice: ["분석은 완벽한데 실행력이 부족할 수 있습니다.", "때로는 과감하게 비중을 실어야 자산이 점프합니다.", "너무 많은 보조지표는 오히려 판단을 흐립니다."]
    },
    lion: {
      range: [21, 26],
      emoji: "🦁",
      type: "진득한 가치투자형",
      name: "흔들리지 않는 사자",
      desc: "단기적인 시세 변동에 일희일비하지 않습니다. 우량한 자산을 쌀 때 사서 비쌀 때까지 묵묵히 기다릴 줄 아는 인내심을 가졌습니다. 소위 말하는 '고수'의 기질이 있습니다.",
      advice: ["'존버'와 '방치'는 다릅니다. 기업 가치가 훼손되면 매도해야 합니다.", "자신의 판단을 너무 맹신하지 마세요.", "현금 흐름(배당, 스테이킹)을 체크하세요."]
    },
    fox: {
      range: [27, 31],
      emoji: "🦊",
      type: "스마트한 기회주의자",
      name: "트렌드 사냥꾼 여우",
      desc: "시장의 냄새를 기가 막히게 맡습니다. 지금 돈이 어디로 쏠리는지(AI, 밈코인, RWA 등) 파악하고 빠르게 올라탑니다. 유연한 사고방식을 가졌지만, 잦은 매매로 수수료가 많이 나갈 수 있습니다.",
      advice: ["벌 때는 많이 벌지만, 잃을 때도 빠릅니다. 익절 기준을 지키세요.", "뇌동매매와 빠른 판단을 구분해야 합니다.", "포트폴리오의 30%는 장기 종목에 묻어두세요."]
    },
    cheetah: {
      range: [32, 35],
      emoji: "🐆",
      type: "야수의 심장",
      name: "질주하는 치타",
      desc: "인생은 한 방! 하이 리스크, 하이 리턴을 즐깁니다. 변동성은 곧 기회라고 생각하며, 남들이 공포에 떨 때 매수 버튼을 누릅니다. 대범하지만 깡통 찰 위험도 가장 큽니다.",
      advice: ["제발 '손절 라인'을 목숨처럼 지키세요.", "대박을 쫓다가 시드가 녹을 수 있습니다.", "수익금은 반드시 안전 자산으로 옮겨두는 습관을 들이세요."]
    }
  };

  let currentStep = 0;
  let totalScore = 0;

  function startTest() {
    document.getElementById('start-screen').style.display = 'none'; // CSS handles layout, JS just toggles
    document.getElementById('quiz-screen').classList.add('active');
    showQuestion();
  }

  function showQuestion() {
    const q = questions[currentStep];
    document.getElementById('question-text').innerText = `Q${currentStep + 1}. ${q.q}`;
    
    // Progress Bar
    const percent = ((currentStep) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;

    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';

    q.a.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.innerText = opt.text;
      btn.onclick = () => selectOption(opt.score);
      optsContainer.appendChild(btn);
    });
  }

  function selectOption(score) {
    totalScore += score;
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
    
    setTimeout(() => {
      document.getElementById('loading-screen').classList.remove('active');
      showResult();
    }, 1800);
  }

  function showResult() {
    const finalScreen = document.getElementById('result-screen');
    finalScreen.classList.add('active');

    let resultKey = 'owl';
    
    if (totalScore <= 13) resultKey = 'turtle';
    else if (totalScore <= 20) resultKey = 'owl';
    else if (totalScore <= 26) resultKey = 'lion';
    else if (totalScore <= 31) resultKey = 'fox';
    else resultKey = 'cheetah';

    const res = results[resultKey];
    
    document.getElementById('result-emoji').innerText = res.emoji;
    document.getElementById('result-type').innerText = res.type;
    document.getElementById('result-name').innerText = res.name;
    document.getElementById('result-desc').innerText = res.desc;
    
    const adviceList = document.getElementById('result-advice');
    adviceList.innerHTML = '';
    res.advice.forEach(txt => {
      const li = document.createElement('li');
      li.innerText = txt;
      adviceList.appendChild(li);
    });
  }

  function shareTest() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: '2025 투자 성향 테스트',
        text: '내 투자 DNA는 거북이일까, 치타일까? 지금 바로 확인해보세요!',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다. 친구들에게 공유해보세요!');
      });
    }
  }
</script>
