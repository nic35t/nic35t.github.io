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
    --brand-blue: #3182f6;
    --brand-bg: #f9fafb;
    --text-main: #191f28;
    --text-sub: #8b95a1;
    --card-bg: #ffffff;
    --shadow: 0 8px 20px rgba(0,0,0,0.06);
  }

  * { box-sizing: border-box; }

  /* App Container */
  .investment-test-container {
    width: 100%;
    max-width: 480px; /* Mobile App Standard */
    margin: 0 auto;
    background-color: var(--brand-bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: "Pretendard", -apple-system, sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* 
   * SCREEN 1: START SCREEN (Redesigned - Fintech Style) 
   */
  #start-screen {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: #fff; /* Clean White Start */
  }

  /* 1. Header Area */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    color: var(--text-main);
  }
  .header-badge {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--brand-blue);
    background: rgba(49, 130, 246, 0.1);
    padding: 6px 12px;
    border-radius: 20px;
  }
  .header-icons { font-size: 1.2rem; color: var(--text-main); cursor: pointer; }

  /* 2. Main Title */
  .hero-section {
    text-align: left;
    margin-bottom: 30px;
  }
  .main-title {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1.3;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
    word-break: keep-all;
  }
  .sub-title {
    font-size: 1.1rem;
    color: var(--text-sub);
    font-weight: 500;
  }

  /* 3. Central Card (Modern UI) */
  .analysis-card {
    background: var(--brand-bg);
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 30px;
    position: relative;
    border: 1px solid #edf0f4;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e8eb;
    padding-bottom: 15px;
  }
  .card-label { font-size: 1rem; font-weight: 700; color: var(--text-main); }
  .card-icon { font-size: 1.5rem; }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .stat-item {
    text-align: left;
  }
  .stat-label { font-size: 0.85rem; color: var(--text-sub); margin-bottom: 4px; display: block; }
  .stat-value { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }

  .tag-container {
    display: flex;
    gap: 8px;
    margin-top: 20px;
  }
  .tag {
    background: #fff;
    border: 1px solid #e5e8eb;
    color: var(--text-sub);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* 4. Stats & Social Proof */
  .social-proof {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: auto; /* Pushes button down */
  }
  .user-avatars {
    display: flex;
    padding-left: 10px;
  }
  .avatar {
    width: 30px; height: 30px; border-radius: 50%; background: #ddd; border: 2px solid #fff;
    margin-left: -10px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;
  }
  .proof-text {
    font-size: 0.95rem;
    color: var(--text-sub);
  }
  .proof-text strong { color: var(--text-main); }

  /* 5. Bottom CTA Button */
  .cta-button {
    width: 100%;
    background-color: var(--brand-blue);
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 20px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);
    transition: background 0.2s, transform 0.1s;
    margin-top: 20px;
  }
  .cta-button:active { transform: scale(0.98); background-color: #1b64da; }


  /* 
   * COMMON SCREEN STYLES (Quiz, Loading, Result)
   */
  .screen {
    display: none;
    width: 100%;
    flex: 1;
    background: #fff;
    flex-direction: column;
    padding: 24px;
    animation: fadeIn 0.4s ease-out;
  }
  .screen.active { display: flex; }

  /* Quiz Styles */
  .progress-wrapper { width: 100%; height: 6px; background: #edf0f4; border-radius: 3px; margin: 20px 0 40px 0; }
  .progress-fill { height: 100%; background: var(--brand-blue); width: 0%; border-radius: 3px; transition: width 0.3s; }
  
  .quiz-question { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 40px; line-height: 1.4; word-break: keep-all; }
  
  .quiz-option {
    width: 100%;
    padding: 20px;
    margin-bottom: 12px;
    background: #fff;
    border: 1px solid #e5e8eb;
    border-radius: 16px;
    color: var(--text-main);
    font-size: 1.05rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }
  .quiz-option:hover { border-color: var(--brand-blue); background: #f4f8ff; color: var(--brand-blue); font-weight: 700; }

  /* Result Styles */
  .result-header { text-align: center; margin-bottom: 30px; }
  .result-emoji { font-size: 5rem; margin-bottom: 10px; animation: float 3s ease-in-out infinite; }
  .result-tag { display: inline-block; background: #f4f8ff; color: var(--brand-blue); padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; margin-bottom: 10px; }
  .result-title { font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; word-break: keep-all; }
  
  .result-card { background: #f9fafb; border-radius: 20px; padding: 24px; margin-bottom: 20px; }
  .result-card h3 { font-size: 1.1rem; margin: 0 0 12px 0; color: var(--text-main); }
  .result-text { font-size: 1rem; color: #4e5968; line-height: 1.6; margin: 0; }
  
  .solution-list { list-style: none; padding: 0; margin: 0; }
  .solution-list li { position: relative; padding-left: 24px; margin-bottom: 8px; color: #4e5968; font-size: 0.95rem; }
  .solution-list li::before { content: "✔"; position: absolute; left: 0; color: var(--brand-blue); font-weight: bold; }

  .action-buttons { display: flex; gap: 10px; margin-top: auto; }
  .btn-share { flex: 1; background: #e5e8eb; color: var(--text-main); border: none; padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; }
  .btn-retry { flex: 1; background: var(--brand-blue); color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

  /* Hide header/footer on mobile */
  @media (max-width: 768px) {
    .investment-test-container { max-width: 100%; border-radius: 0; }
  }
</style>

<div class="investment-test-container">

  <!-- 1. START SCREEN -->
  <div id="start-screen">
    <!-- Header -->
    <header class="app-header">
      <div class="header-badge">2025 BETA</div>
      <div class="header-icons">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero-section">
      <h1 class="main-title">내 투자 성향은<br>어떤 동물일까?</h1>
      <p class="sub-title">행동 경제학으로 분석하는<br>2025년 실전 투자 전략</p>
    </section>

    <!-- Info Card (Clean UI) -->
    <section class="analysis-card">
      <div class="card-header">
        <span class="card-label">분석 리포트 미리보기</span>
        <span class="card-icon">📊</span>
      </div>
      <div class="stat-row">
        <div class="stat-item">
          <span class="stat-label">분석 항목</span>
          <span class="stat-value">멘탈 / 지식 / 리스크</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">예상 소요시간</span>
          <span class="stat-value">약 1분 30초</span>
        </div>
      </div>
      <div class="tag-container">
        <div class="tag">#주식코인</div>
        <div class="tag">#심리분석</div>
        <div class="tag">#포트폴리오</div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="social-proof">
      <div class="user-avatars">
        <div class="avatar" style="background:#ffd1d1;">👩</div>
        <div class="avatar" style="background:#d1e7ff;">🧑</div>
        <div class="avatar" style="background:#fff5cc;">👧</div>
      </div>
      <p class="proof-text">현재 <strong>186,004명</strong>이 참여했어요</p>
    </section>

    <!-- CTA Button -->
    <button class="cta-button" onclick="startTest()">
      내 투자 성향 분석하기
    </button>
  </div>


  <!-- 2. QUIZ SCREEN -->
  <div id="quiz-screen" class="screen">
    <div style="display:flex; justify-content:space-between; align-items:center; color:var(--text-sub);">
      <span style="font-weight:700; color:var(--brand-blue);">Q<span id="q-num">1</span></span>
      <span>7</span>
    </div>
    <div class="progress-wrapper"><div id="progress-bar" class="progress-fill"></div></div>
    
    <h2 id="question-text" class="quiz-question">질문 내용</h2>
    <div id="options-container" style="width: 100%;"></div>
  </div>


  <!-- 3. LOADING SCREEN -->
  <div id="loading-screen" class="screen" style="justify-content:center; align-items:center; text-align:center;">
    <div style="font-size: 4rem; margin-bottom: 20px;">🔄</div>
    <h2 style="font-size: 1.5rem; color:var(--text-main); margin-bottom: 10px;">데이터 분석 중...</h2>
    <p style="color:var(--text-sub);">당신의 투자 패턴을 시뮬레이션하고 있습니다.</p>
  </div>


  <!-- 4. RESULT SCREEN -->
  <div id="result-screen" class="screen">
    <div class="result-header">
      <div id="result-emoji" class="result-emoji">🦁</div>
      <span id="result-type" class="result-tag">TYPE A</span>
      <h1 id="result-name" class="result-title">결과 이름</h1>
    </div>

    <div class="result-card">
      <h3>📊 투자 스타일 분석</h3>
      <p id="result-desc" class="result-text">설명</p>
    </div>

    <!-- Clean Ad Space -->
    <div style="width:100%; height:80px; margin-bottom:20px; display:flex; align-items:center; justify-content:center;">
      <!-- AdSense -->
    </div>

    <div class="result-card" style="background: #f2f7ff; border: 1px solid #dbe6ff;">
      <h3 style="color:var(--brand-blue);">💡 맞춤 솔루션</h3>
      <ul id="result-advice" class="solution-list"></ul>
      <div style="margin-top:15px; text-align:right;">
         <a href="/categories/" style="color:var(--brand-blue); font-weight:700; text-decoration:none; font-size:0.9rem;">관련 아티클 더보기 →</a>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn-share" onclick="shareTest()">공유하기</button>
      <button class="btn-retry" onclick="location.reload()">다시하기</button>
    </div>
  </div>

</div>

<script>
  // Advanced Quiz Data (Logic preserved)
  const questions = [
    {
      q: "친구가 '이 코인 사서 2배 벌었어!'라며 수익 인증을 했다. 나의 솔직한 심정은?",
      a: [
        { text: "😒 '운이 좋았네' 하고 무시한다.", score: 1 },
        { text: "🤔 '어떤 종목이지?' 분석해본다.", score: 3 },
        { text: "🔥 '나만 벼락거지?' 당장 따라 살까 고민한다.", score: 5 }
      ]
    },
    {
      q: "보유 종목이 하루 만에 -20% 폭락했다. 특별한 악재는 없다.",
      a: [
        { text: "😱 무서워서 전량 매도하고 현금화한다.", score: 1 },
        { text: "🧘‍♀️ 존버는 승리한다. 어플을 지운다.", score: 3 },
        { text: "😋 세력의 개미 털기다! 풀매수 찬스.", score: 5 }
      ]
    },
    {
      q: "종목을 고를 때 가장 중요하게 보는 것은?",
      a: [
        { text: "🛡️ 잃지 않는 것 (시총 상위 우량주)", score: 1 },
        { text: "📊 재무제표, 백서 등 펀더멘탈", score: 2 },
        { text: "📈 차트 거래량과 보조지표", score: 4 },
        { text: "🗣️ 커뮤니티 화력과 유튜버 추천", score: 5 }
      ]
    },
    {
      q: "여윳돈 1,000만 원이 생겼다. 어떻게 할까?",
      a: [
        { text: "예적금 70%, 투자 30%", score: 1 },
        { text: "주식/코인 60%, 현금 40%", score: 3 },
        { text: "가장 핫한 주도주에 몰빵", score: 5 }
      ]
    },
    {
      q: "선호하는 익절 타이밍은?",
      a: [
        { text: "5~10% 소소하게 먹고 빠진다.", score: 1 },
        { text: "목표가가 올 때까지 기다린다.", score: 3 },
        { text: "추세가 꺾일 때까지 끝까지 먹는다.", score: 5 }
      ]
    },
    {
      q: "잠들기 전, 해외 증시/코인 시세를 확인하나?",
      a: [
        { text: "안 한다. 어차피 장투니까.", score: 1 },
        { text: "이슈 있을 때만 본다.", score: 3 },
        { text: "새벽에 자다 깨서 확인해야 안심된다.", score: 5 }
      ]
    },
    {
      q: "레버리지(신용/선물) 거래는?",
      a: [
        { text: "절대 안 한다. 위험하다.", score: 1 },
        { text: "확실할 때 2배 정도는 쓴다.", score: 3 },
        { text: "시드 불리려면 고배율 필수다.", score: 5 }
      ]
    }
  ];

  const results = {
    turtle: { range: [7, 13], emoji: "🛡️", type: "철벽방어형", name: "돌다리도 두드리는 거북이", desc: "원금 손실을 극도로 싫어하는 안전 제일주의자입니다. 변동성을 견디기 힘들어하며 마음 편한 투자를 선호합니다.", advice: ["예적금만으로는 부족합니다. 우량주 적립식 매수를 시작하세요.", "개별 종목보다 ETF 투자가 맞습니다."] },
    owl: { range: [14, 20], emoji: "🦉", type: "전략가형", name: "숲을 보는 올빼미", desc: "감정보다 데이터와 논리를 믿습니다. 남들이 좋다고 해서 무작정 사지 않으며, 스스로 납득해야 움직입니다.", advice: ["분석은 완벽한데 실행력이 부족할 수 있습니다.", "때로는 과감한 비중 베팅이 필요합니다."] },
    lion: { range: [21, 26], emoji: "🦁", type: "가치투자형", name: "흔들리지 않는 사자", desc: "단기 시세에 일희일비하지 않습니다. 우량 자산을 쌀 때 사서 제 가치를 받을 때까지 기다릴 줄 압니다.", advice: ["'존버'와 '방치'를 구분하세요.", "기업 가치가 훼손되면 매도해야 합니다."] },
    fox: { range: [27, 31], emoji: "🦊", type: "기회주의형", name: "트렌드 사냥꾼 여우", desc: "돈의 흐름을 빠르게 읽습니다. 지금 핫한 섹터에 빠르게 올라타 수익을 냅니다.", advice: ["벌 때 벌고 잃을 때도 빠릅니다. 익절 기준을 지키세요.", "뇌동매매를 주의하세요."] },
    cheetah: { range: [32, 35], emoji: "🐆", type: "야수형", name: "질주하는 치타", desc: "하이 리스크 하이 리턴! 변동성은 곧 기회라고 생각하며 남들이 공포에 떨 때 매수합니다.", advice: ["손절 라인은 생명입니다.", "수익금은 반드시 안전 자산으로 옮기세요."] }
  };

  let currentStep = 0;
  let totalScore = 0;

  function startTest() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').classList.add('active');
    showQuestion();
  }

  function showQuestion() {
    const q = questions[currentStep];
    document.getElementById('q-num').innerText = currentStep + 1;
    document.getElementById('question-text').innerText = q.q;
    
    // Progress
    const percent = ((currentStep + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;

    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';

    q.a.forEach(opt => {
      const btn = document.createElement('div');
      btn.className = 'quiz-option';
      btn.innerText = opt.text;
      btn.onclick = () => selectOption(opt.score);
      optsContainer.appendChild(btn);
    });
  }

  function selectOption(score) {
    totalScore += score;
    currentStep++;
    if (currentStep < questions.length) showQuestion();
    else showLoading();
  }

  function showLoading() {
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('loading-screen').classList.add('active');
    setTimeout(() => {
      document.getElementById('loading-screen').classList.remove('active');
      showResult();
    }, 1500);
  }

  function showResult() {
    document.getElementById('result-screen').classList.add('active');
    let rKey = 'owl';
    if (totalScore <= 13) rKey = 'turtle';
    else if (totalScore <= 20) rKey = 'owl';
    else if (totalScore <= 26) rKey = 'lion';
    else if (totalScore <= 31) rKey = 'fox';
    else rKey = 'cheetah';

    const res = results[rKey];
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
      navigator.share({ title: '투자 성향 테스트', text: '내 투자 DNA 확인하기', url: url });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('링크 복사 완료!'));
    }
  }
</script>