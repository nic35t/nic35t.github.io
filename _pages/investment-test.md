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
  /* Minimal Mistakes 테마의 기본 제목 영역 숨기기 */
  .page__title, .page__header {
    display: none !important;
  }

  /* Local Styles for Investment Test */
  :root {
    --toss-blue: #1b6fe0; /* 4.78:1 with white text; #3182f6 was 3.71:1 */
    --bg-gray: #f2f4f6;
    --text-dark: #191f28;
    --text-gray: #69737f; /* 4.82:1 on white; #8b95a1 was 3.03:1 */
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
    background-color: #fff;
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
  h1.test-title {
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
    color: white;
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
    background-color: #1b64da;
    transform: translateY(-2px);
  }

  .btn-option {
    background-color: #ffffff;
    border: 2px solid #e5e8eb;
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
    background-color: #f9fbff;
    color: var(--toss-blue);
  }

  /* Progress Bar */
  .progress-container {
    width: 100%;
    background-color: #e5e8eb;
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
    background-color: #f9fafb;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
    box-sizing: border-box; /* Explicit safety */
  }

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
    h1.test-title { 
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
    <h1 class="test-title">2025 실전형<br>투자 성향 테스트</h1>
    <p class="test-desc">나는 어떤 투자 동물일까?<br>행동 경제학 기반으로 분석하는<br>나의 진짜 투자 DNA 찾기</p>
    <button class="btn-primary" onclick="startTest()">테스트 시작하기</button>
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
    <h2 style="margin-top: 20px;">투자 패턴 분석 중...</h2>
    <p>FOMO 지수 계산 중...</p>
    <p>손실 회피 성향 파악 중...</p>
  </div>

  <!-- 4. Result Screen -->
  <div id="result-screen" class="screen">
    <div id="result-emoji" class="result-emoji">🦁</div>
    <div id="result-type" class="result-type">TYPE A</div>
    <h1 id="result-name" class="result-name">결과 이름</h1>
    
    <div class="result-box">
      <h3>📊 당신의 투자 스타일</h3>
      <p id="result-desc" style="line-height: 1.6; color: #4e5968;">설명</p>
    </div>

    <div class="result-box" style="background-color: #e8f3ff;">
      <h3 style="color: var(--toss-blue);">💡 승리를 위한 솔루션</h3>
      <ul id="result-advice">
        <li>조언 1</li>
      </ul>
      <br>
      <a href="/categories/" class="recommend-link">👉 이 성향을 위한 추천 글 읽기</a>
    </div>

    <div style="display: flex; gap: 10px; width: 100%;">
      <button class="btn-primary" style="flex: 1; background-color: #333;" onclick="shareTest()">결과 공유</button>
      <button class="btn-primary" style="flex: 1;" onclick="location.reload()">다시하기</button>
    </div>
  </div>
</div>

<script>
  // Advanced Quiz Data (Based on Behavioral Finance)
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
  // Score Range: 7 ~ 35
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
    document.getElementById('start-screen').classList.remove('active');
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
    }, 1800); // 1.8s delay for suspense
  }

  function showResult() {
    const finalScreen = document.getElementById('result-screen');
    finalScreen.classList.add('active');

    let resultKey = 'owl'; // default
    
    // Logic based on score range
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
