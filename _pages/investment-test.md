---
layout: single
title: "2025 새해 투자 성향 테스트"
permalink: /investment-test/
classes: wide
author_profile: false
sidebar:
  nav: false
---

<style>
  /* Local Styles for Investment Test */
  :root {
    --toss-blue: #3182f6;
    --bg-gray: #f2f4f6;
    --text-dark: #191f28;
    --text-gray: #8b95a1;
  }

  .investment-test-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Pretendard", -apple-system, sans-serif;
    text-align: center;
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    overflow: hidden;
    position: relative;
    min-height: 500px;
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
  }

  p.test-desc {
    font-size: 1.1rem;
    color: var(--text-gray);
    margin-bottom: 2rem;
    line-height: 1.6;
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
    padding: 20px;
    margin-bottom: 12px;
    border-radius: 16px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s;
    text-align: left;
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
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    word-break: keep-all;
  }

  .result-box {
    background-color: #f9fafb;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
  }

  .result-box h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .result-box ul {
    padding-left: 20px;
    margin: 0;
    font-size: 0.95rem;
    color: var(--text-gray);
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
      padding: 15px;
      border-radius: 0;
      box-shadow: none;
    }
    h1.test-title { font-size: 1.6rem; }
  }
</style>

<div class="investment-test-container">
  <!-- 1. Start Screen -->
  <div id="start-screen" class="screen active">
    <div style="font-size: 4rem; margin-bottom: 20px;">🔮</div>
    <h1 class="test-title">2025 새해<br>나의 투자 동물 찾기</h1>
    <p class="test-desc">나는 야수의 심장일까?<br>아니면 신중한 거북이일까?<br>1분 만에 알아보는 나의 투자 성향!</p>
    <button class="btn-primary" onclick="startTest()">테스트 시작하기</button>
  </div>

  <!-- 2. Quiz Screen -->
  <div id="quiz-screen" class="screen">
    <div class="progress-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>
    <h2 id="question-text" class="test-title" style="font-size: 1.5rem;">질문 내용</h2>
    <div id="options-container" style="width: 100%; margin-top: 20px;">
      <!-- Options will be injected here -->
    </div>
  </div>

  <!-- 3. Loading Screen -->
  <div id="loading-screen" class="screen">
    <div style="font-size: 3rem;">⏳</div>
    <h2 style="margin-top: 20px;">투자 성향 분석 중...</h2>
    <p>당신의 DNA를 스캔하고 있습니다.</p>
  </div>

  <!-- 4. Result Screen -->
  <div id="result-screen" class="screen">
    <div id="result-emoji" class="result-emoji">🦁</div>
    <div id="result-type" class="result-type">TYPE A</div>
    <h1 id="result-name" class="result-name">결과 이름</h1>
    
    <div class="result-box">
      <h3>📊 투자 특징</h3>
      <p id="result-desc" style="line-height: 1.6; color: #4e5968;">설명</p>
    </div>

    <!-- AdSense Placeholder -->
    <div style="width: 100%; height: 100px; background: #eee; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border-radius: 8px; color: #aaa;">
      광고 영역 (AdSense)
    </div>

    <div class="result-box" style="background-color: #e8f3ff;">
      <h3 style="color: var(--toss-blue);">💡 추천하는 전략</h3>
      <ul id="result-advice">
        <li>조언 1</li>
      </ul>
      <br>
      <a href="/categories/" class="recommend-link">👉 관련 투자 글 보러가기</a>
    </div>

    <div style="display: flex; gap: 10px; width: 100%;">
      <button class="btn-primary" style="flex: 1; background-color: #333;" onclick="shareTest()">공유하기</button>
      <button class="btn-primary" style="flex: 1;" onclick="location.reload()">다시하기</button>
    </div>
  </div>
</div>

<script>
  // Quiz Data
  const questions = [
    {
      q: "자고 일어났더니 비트코인이 -10% 폭락해 있다. 나의 반응은?",
      a: [
        { text: "😱 망했다... 당장 팔아서 손실을 줄인다.", score: 1 },
        { text: "🤔 이유가 뭐지? 뉴스를 찾아보고 관망한다.", score: 2 },
        { text: "😋 바겐세일이다! 저점 매수의 기회, 추매한다.", score: 3 }
      ]
    },
    {
      q: "새로운 알트코인(또는 주식) 정보를 들었다.",
      a: [
        { text: "👂 누가 추천해줬는데? 일단 사고 본다.", score: 3 },
        { text: "📈 차트를 켜서 현재 가격과 거래량을 본다.", score: 2 },
        { text: "📑 백서(사업보고서)와 팀원을 꼼꼼히 조사한다.", score: 1 }
      ]
    },
    {
      q: "나의 이상적인 포트폴리오 구성은?",
      a: [
        { text: "💰 예적금 80%, 투자 20% (안전이 최고)", score: 1 },
        { text: "⚖️ 주식/코인 50%, 현금 50% (반반 무 많이)", score: 2 },
        { text: "🚀 인생은 한방! 유망 종목에 100% 몰빵", score: 3 }
      ]
    },
    {
      q: "투자 수익으로 가장 하고 싶은 것은?",
      a: [
        { text: "🏠 내 집 마련의 꿈 (안정적 자산)", score: 1 },
        { text: "🚗 드림카 뽑기 & 명품 구매 (플렉스)", score: 3 },
        { text: "💸 재투자해서 자산 불리기 (복리의 마법)", score: 2 }
      ]
    },
    {
      q: "내가 생각하는 투자의 적은?",
      a: [
        { text: "📉 폭락하는 시장 상황", score: 1 },
        { text: "🤯 뇌동매매하는 나 자신", score: 2 },
        { text: "🐢 너무 느린 수익률", score: 3 }
      ]
    }
  ];

  // Result Types
  const results = {
    safe: {
      emoji: "🐢",
      type: "신중한 방어형",
      name: "돌다리 두드리는 거북이",
      desc: "당신은 원금을 잃는 것을 극도로 싫어하는 안전 제일주의자입니다. 변동성이 큰 시장보다는 확실한 근거가 있는 우량주나 배당주, 스테이블 코인을 선호합니다.",
      advice: ["급등주 추격 매수는 금물!", "적립식 매수(DCA) 전략이 최고입니다.", "스테이킹이나 배당 수익에 관심을 가져보세요."]
    },
    balance: {
      emoji: "🦉",
      type: "이성적인 분석형",
      name: "숲을 보는 올빼미",
      desc: "감정에 휘둘리지 않고 데이터와 논리로 투자하는 전략가입니다. 리스크를 적절히 관리하면서도 수익 기회를 놓치지 않는 균형 잡힌 시각을 가졌습니다.",
      advice: ["자산 배분(Asset Allocation)을 공부해보세요.", "차트보다는 기업/프로젝트의 가치에 집중하세요.", "뉴스에 일희일비하지 마세요."]
    },
    aggressive: {
      emoji: "🐯",
      type: "공격적인 투자형",
      name: "야수의 심장 호랑이",
      desc: "하이 리스크, 하이 리턴! 당신은 변동성을 즐기는 승부사입니다. 남들이 공포에 떨 때 기회를 포착하고, 과감하게 베팅할 줄 아는 야수성을 지녔습니다.",
      advice: ["손절 라인은 생명입니다. 꼭 지키세요!", "레버리지(빚투)는 신중해야 합니다.", "한 번의 실수로 모든 걸 잃지 않게 분산하세요."]
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
    
    // Fake loading delay
    setTimeout(() => {
      document.getElementById('loading-screen').classList.remove('active');
      showResult();
    }, 1500);
  }

  function showResult() {
    const finalScreen = document.getElementById('result-screen');
    finalScreen.classList.add('active');

    let resultKey = 'balance';
    // Simple logic: 5 questions, min 5, max 15.
    // 5~8: Safe, 9~12: Balance, 13~15: Aggressive
    if (totalScore <= 8) resultKey = 'safe';
    else if (totalScore <= 12) resultKey = 'balance';
    else resultKey = 'aggressive';

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
        title: '나의 투자 동물 찾기 테스트',
        text: '내 투자 성향은 어떤 동물일까? 2025년 투자 운세 확인하기',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('주소가 복사되었습니다. 친구에게 공유해보세요!');
      });
    }
  }
</script>
