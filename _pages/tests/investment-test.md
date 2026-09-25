---
layout: quiz
title: 투자 성향 테스트
description: 위험을 얼마나 견디는가, 그리고 무엇을 근거로 결정하는가. 두 축으로 나누어 보는 10문항
permalink: /investment-test/
order: 2
eyebrow: 투자
intro: '위험을 얼마나 견디는가, 그리고

  무엇을 근거로 결정하는가.

  두 축으로 나누어 보는 10문항'
disclaimer: 행동경제학에서 다루는 편향을 소재로 한 자기 점검용 테스트입니다. 투자 자문이나 권유가 아니며, 결과가 특정 상품의 적합성을 판단해 주지 않습니다.
result_disclaimer: 이 결과는 응답 패턴을 요약한 것일 뿐, 투자 실력이나 성과를 예측하지 않습니다. 투자 판단과 그 결과는 본인에게 귀속됩니다.
axes:
  a:
    label: 위험 감내도
    low: 원금 보존 우선
    high: 변동성 수용
  b:
    label: 판단 근거
    low: 원칙·데이터
    high: 직관·분위기
questions:
- q: 보유 종목이 하루 만에 20% 넘게 빠졌다. 찾아봐도 특별한 악재는 없다.
  axis: a
  options:
  - text: 이유는 나중에. 일단 전량 팔아 현금으로 옮긴다.
    score: 0
    concept: loss_aversion
  - text: 불안하지만 비중을 절반으로 줄여 놓는다.
    score: 1
  - text: 원래 계획대로 둔다. 이 정도 변동은 감안했다.
    score: 2
  - text: 계획에 있던 추가 매수 구간이라 더 산다.
    score: 3
- q: 수익 중인 종목과 손실 중인 종목이 있다. 급히 목돈이 필요해 하나를 팔아야 한다.
  axis: b
  options:
  - text: 어느 쪽이든 지금 기준에 안 맞는 것을 판다.
    score: 0
  - text: 손실 난 쪽을 팔아 세금이라도 아낀다.
    score: 1
  - text: 수익 난 쪽을 판다. 확정된 이익이 안전하다.
    score: 2
    concept: disposition
- q: 친구가 어떤 종목으로 두 배를 벌었다며 인증을 보내왔다.
  axis: b
  options:
  - text: 축하하고 넘어간다. 내 기준과는 상관없다.
    score: 0
  - text: 종목명을 적어 두고 나중에 직접 확인해 본다.
    score: 1
  - text: 지금 안 사면 나만 뒤처질 것 같아 조바심이 난다.
    score: 2
    concept: herding
- q: 종목을 고를 때, 실제로 결정을 좌우하는 것은?
  axis: b
  options:
  - text: 재무제표·사업 구조 등 직접 확인한 자료.
    score: 0
  - text: 차트와 거래량 등 정해 둔 기술적 기준.
    score: 1
  - text: 커뮤니티 분위기와 자주 보는 채널의 추천.
    score: 2
    concept: herding
- q: 최근 1년간 내 판단이 맞은 비율을 스스로 매긴다면?
  axis: b
  options:
  - text: 기록해 두지 않아 정확히는 모르겠다.
    score: 1
    concept: overconfidence
  - text: 기록해 뒀고, 절반쯤 맞았다.
    score: 0
  - text: 기록은 없지만 대체로 맞았던 것 같다.
    score: 2
    concept: overconfidence
- q: 여윳돈이 생겼다. 위험자산 비중을 어떻게 잡을까?
  axis: a
  options:
  - text: 대부분 예금 등 원금 보존 쪽에 둔다.
    score: 0
  - text: 미리 정해 둔 비중대로 나눠 담는다.
    score: 1
  - text: 지금 가장 유망해 보이는 한 곳에 몰아넣는다.
    score: 2
    concept: recency
- q: 산 뒤로 계속 내리는 종목이 있다. 처음 산 이유는 이미 사라졌다.
  axis: b
  options:
  - text: 이유가 사라졌으면 정리한다. 산 가격과는 무관하다.
    score: 0
  - text: 본전까지만 오면 팔려고 기다린다.
    score: 2
    concept: sunk_cost
  - text: 평단을 낮추려고 더 산다.
    score: 2
    concept: sunk_cost
- q: 내 판단과 반대되는 분석 글을 읽었을 때, 보통은?
  axis: b
  options:
  - text: 근거가 뭔지 끝까지 읽고 내 판단을 다시 본다.
    score: 0
  - text: 훑어보고 넘긴다. 반대 의견은 늘 있으니까.
    score: 1
    concept: confirmation
  - text: 보지 않는다. 흔들리기만 한다.
    score: 2
    concept: confirmation
- q: 자정이 넘었다. 시장을 확인하는 빈도는?
  axis: a
  options:
  - text: 확인하지 않는다. 정해 둔 주기에만 본다.
    score: 0
  - text: 하루 몇 번 정도는 들여다본다.
    score: 1
  - text: 자다 깨서라도 확인해야 마음이 놓인다.
    score: 2
    concept: illusion_of_control
- q: 레버리지나 신용 거래에 대한 생각은?
  axis: a
  options:
  - text: 쓰지 않는다. 감당할 수 있는 돈으로만 한다.
    score: 0
  - text: 규칙을 정해 두고 제한적으로만 쓴다.
    score: 1
  - text: 자산을 불리려면 필요하다고 본다.
    score: 2
    concept: overconfidence
concepts_title: 답변에서 자주 보인 편향
concepts_intro: 모두가 가진 사고 습관입니다. 있다는 걸 아는 것만으로 영향이 줄어듭니다.
concepts_empty: 이번 답변에서는 두드러진 편향이 나타나지 않았습니다. 다만 문항이 열 개뿐이라는 점은 감안하세요.
concepts:
- key: loss_aversion
  label: 손실 회피
  desc: 같은 크기라도 잃는 아픔이 버는 기쁨보다 크게 느껴집니다. 그래서 급락에 계획보다 먼저 손이 나갑니다.
- key: disposition
  label: 처분 효과
  desc: 오른 것은 빨리 팔고 내린 것은 오래 들고 있게 됩니다. 파는 기준이 가치가 아니라 매수가가 되어 있을 때 나타납니다.
- key: herding
  label: 군집 행동
  desc: 많은 사람이 향하는 쪽이 안전해 보입니다. 다만 그때는 이미 가격에 그 기대가 들어가 있는 경우가 많습니다.
- key: overconfidence
  label: 과신
  desc: 기억은 맞았던 판단을 더 잘 남깁니다. 기록해 두지 않으면 실제 적중률은 대체로 기억보다 낮습니다.
- key: recency
  label: 최신 편향
  desc: 최근에 잘 오른 것이 앞으로도 오를 것처럼 느껴집니다. 최근의 흐름이 미래의 근거로 바뀌는 지점입니다.
- key: sunk_cost
  label: 매몰 비용
  desc: 이미 쓴 돈이 아까워 결정을 미루게 됩니다. 산 가격은 시장이 모르는 정보이고, 앞으로의 가치와도 무관합니다.
- key: confirmation
  label: 확증 편향
  desc: 내 생각을 뒷받침하는 정보가 더 잘 보이고 더 설득력 있게 읽힙니다. 반대 근거를 일부러 찾아야 균형이 맞습니다.
- key: illusion_of_control
  label: 통제 착각
  desc: 자주 들여다보면 상황을 관리하고 있다는 느낌이 듭니다. 확인 빈도와 결과 사이의 관계는 생각보다 약합니다.
results:
- quadrant: low-low
  emoji: 🛡️
  type: 저위험 · 원칙형
  name: 돌다리를 두드리는 거북이
  desc: 원금이 줄어드는 상황을 특히 불편해하고, 결정은 미리 정해 둔 기준을 따릅니다. 흔들리지 않는 대신 기회를 늦게 잡는 편입니다.
  checks:
  - 지키는 것과 아무것도 하지 않는 것을 구분하고 있는지.
  - 위험을 피한 대가로 무엇을 포기했는지 계산해 본 적 있는지.
  - 기준이 보수적인 것인지, 그냥 결정을 미루는 것인지.
- quadrant: low-high
  emoji: 🐿️
  type: 저위험 · 직관형
  name: 여기저기 묻어 두는 다람쥐
  desc: 크게 걸지는 않지만, 무엇을 살지는 그때그때 분위기를 따라 정합니다. 손실은 작게 막는 대신 판단이 쌓이지 않습니다.
  checks:
  - 지금 가진 것들을 왜 샀는지 각각 설명할 수 있는지.
  - 조심스러운 성향과 기준 없음이 겹쳐 있지는 않은지.
  - 소액이라는 이유로 검토를 건너뛰고 있지는 않은지.
- quadrant: middle
  emoji: 🦉
  type: 균형형
  name: 양쪽을 저울질하는 올빼미
  desc: 위험도 판단 근거도 한쪽으로 치우치지 않았습니다. 상황에 맞춰 조절하는 편이지만, 그 조절의 기준이 그때그때 달라질 수 있습니다.
  checks:
  - 유연한 것인지, 기준이 매번 바뀌는 것인지.
  - 조절의 근거를 사후가 아니라 사전에 적어 두는지.
  - 중간을 택하는 것이 판단을 미루는 방식이 되고 있지는 않은지.
- quadrant: high-low
  emoji: 🦁
  type: 고위험 · 원칙형
  name: 확신에 무게를 싣는 사자
  desc: 변동성을 감수하되, 그 결정은 스스로 세운 근거에서 나옵니다. 근거가 맞을 때는 크게 가지만, 틀렸을 때도 크게 갑니다.
  checks:
  - 확신의 근거와 확신의 크기가 비례하는지.
  - 틀렸다고 인정하는 조건을 미리 정해 두었는지.
  - 한 판단에 얼마까지 걸지 상한을 두고 있는지.
- quadrant: high-high
  emoji: 🐆
  type: 고위험 · 직관형
  name: 먼저 뛰고 보는 치타
  desc: 빠르게 반응하고 크게 겁니다. 남들보다 먼저 움직이는 것이 강점이지만, 근거가 뒤따라오는 경우가 많아 결과의 폭이 넓습니다.
  checks:
  - 빠른 판단과 반사적 반응을 구분하고 있는지.
  - 결정을 내린 이유를 사기 전에 적어 두는지.
  - 회복하기 어려운 크기까지 걸고 있지는 않은지.
share_text: 위험 감내도와 판단 근거, 두 축으로 보는 10문항 자기 점검.
---
