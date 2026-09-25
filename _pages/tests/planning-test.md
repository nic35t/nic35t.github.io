---
title: 기획 사고 성향 테스트
description: 문제를 무엇에서부터 보는가, 그리고 어떤 속도로 만들어 가는가. 기획자의 생각 습관을 보는 10문항
permalink: /planning-test/
order: 4
eyebrow: 기획
intro: |-
  문제를 무엇에서부터 보는가, 그리고
  어떤 속도로 만들어 가는가.
  기획자의 생각 습관을 보는 10문항
disclaimer: 기획하고 일하는 습관을 돌아보는 자기 점검용 테스트입니다. 어떤 방식이 더 우월하다는 평가가 아니며, 결과가 업무 역량을 판단하지 않습니다.
result_disclaimer: 이 결과는 응답 패턴을 요약한 것일 뿐입니다. 좋은 기획은 한 가지 스타일보다, 상황에 맞게 방식을 바꿀 줄 아는 데서 나옵니다.
related_url: /business%20strategy/AI-Business-Planning-Havruta-Method/
related_label: 하브루타식 문답 기획법 글 읽기
axes:
  a:
    label: 문제를 보는 출발점
    low: 데이터·근거부터
    high: 가설·직관부터
  b:
    label: 만들어 가는 방식
    low: 완성해서 한 번에
    high: 작게 내고 빨리 고침
questions:
- q: 새 서비스 기획을 맡았다. 첫날 가장 먼저 하는 일은?
  axis: a
  options:
  - text: 관련 지표와 시장 자료부터 모은다.
    score: 0
  - text: 사용자 몇 명을 만나 불편한 점을 직접 듣는다.
    score: 1
    concept: interview
  - text: '"이런 게 있으면 쓰겠다"는 아이디어부터 적어 본다.'
    score: 2
    concept: hypothesis
- q: 기획서 초안이 70% 정도 완성됐다. 다음 행동은?
  axis: b
  options:
  - text: 빈틈이 없도록 끝까지 채운 뒤에 공유한다.
    score: 0
  - text: 핵심 부분만 가까운 동료에게 먼저 보여 준다.
    score: 1
  - text: 지금 상태로 공유하고 피드백을 받으며 고친다.
    score: 2
    concept: mvp
- q: 회의에서 누군가 "그거 진짜 필요해요?"라고 물었다.
  axis: a
  options:
  - text: 준비한 데이터로 필요성을 보여 준다.
    score: 0
  - text: '"왜 그렇게 생각하세요?"라고 되물어 이유를 더 듣는다.'
    score: 1
    concept: havruta
  - text: 직관적으로 확신이 있어서 방향을 설득한다.
    score: 2
    concept: confirmation
- q: 출시한 기능의 반응이 기대보다 낮다.
  axis: b
  options:
  - text: 원인을 충분히 분석한 뒤 다음 버전을 설계한다.
    score: 0
    concept: five_whys
  - text: 가장 의심 가는 부분 하나를 바꿔 반응을 다시 본다.
    score: 1
    concept: hypothesis
  - text: 여러 가지를 동시에 바꿔 보며 빨리 반응을 찾는다.
    score: 2
- q: 공들인 프로젝트가 방향이 틀렸다는 신호가 보인다.
  axis: b
  options:
  - text: 지금까지 들인 시간이 아까워도 원점에서 다시 검토한다.
    score: 0
    concept: sunk_cost
  - text: 살릴 수 있는 부분만 남기고 방향을 튼다.
    score: 1
  - text: 조금만 더 밀어붙이면 될 것 같아 계속 간다.
    score: 2
    concept: sunk_cost
- q: 기획의 성공을 무엇으로 판단하나?
  axis: a
  options:
  - text: 시작 전에 정해 둔 핵심 지표 하나로 본다.
    score: 0
    concept: north_star
  - text: 지표와 사용자 반응을 함께 본다.
    score: 1
  - text: 써 본 사람들의 반응과 분위기로 느낀다.
    score: 2
    concept: north_star
- q: 기획 단계에서 AI를 쓴다면 어떻게 쓰나?
  axis: a
  options:
  - text: 자료 조사와 수치 정리를 맡긴다.
    score: 0
  - text: AI에게 질문을 받으며 내 생각의 빈틈을 찾는다.
    score: 1
    concept: havruta
  - text: 아이디어를 잔뜩 뽑아 달라고 한 뒤 마음에 드는 걸 고른다.
    score: 2
- q: 일정이 빠듯한 프로젝트. 무엇을 줄일까?
  axis: b
  options:
  - text: 기능 범위는 지키고 일정을 조정해 달라고 한다.
    score: 0
  - text: 핵심 기능만 먼저 내고 나머지는 다음 단계로 미룬다.
    score: 1
    concept: mvp
  - text: 일단 날짜에 맞춰 내고 문제는 나중에 고친다.
    score: 2
- q: 계획을 확정하기 전, 마지막으로 하는 일은?
  axis: b
  options:
  - text: '"이 프로젝트가 실패했다면 왜일까"를 미리 적어 본다.'
    score: 0
    concept: premortem
  - text: 이해관계자에게 한 번 더 확인을 받는다.
    score: 1
  - text: 딱히 없다. 시작하면서 부딪히는 게 빠르다.
    score: 2
    concept: premortem
- q: 내 아이디어와 반대되는 데이터를 발견했다.
  axis: a
  options:
  - text: 아이디어를 수정하거나 접는다.
    score: 0
  - text: 데이터가 맞는지, 표본이 충분한지부터 확인한다.
    score: 1
  - text: 예외적인 경우라 보고 원래 방향을 유지한다.
    score: 2
    concept: confirmation
concepts_title: 답변과 맞닿은 기획 도구
concepts_intro: 고른 답과 가장 가까운 기획 방법이나 사고 습관입니다. 이름을 알아 두면 다음 기획에서 의식적으로 꺼내 쓸 수 있습니다.
concepts_empty: 이번 답변에서는 두드러진 항목이 없었습니다. 가설 검증과 사전 부검부터 가볍게 시도해 보면 기획의 결이 달라집니다.
concepts:
- key: hypothesis
  label: 가설 검증
  desc: '"이 기능이 있으면 이 사용자는 이렇게 행동할 것이다"처럼 확인할 수 있는 문장으로 아이디어를 적고, 한 번에 하나씩 확인하는 방법입니다. 틀려도 무엇이 틀렸는지 알 수 있어 다음 판단이 빨라집니다.'
- key: mvp
  label: MVP (최소 기능 제품)
  desc: 가장 중요한 가설을 확인할 수 있는 최소한의 형태로 먼저 내놓는 방식입니다. 완성도보다 학습 속도를 우선하지만, '최소'가 '대충'이 되면 잘못된 결론을 얻을 수 있습니다.
- key: interview
  label: 사용자 인터뷰
  desc: 숫자가 보여 주지 못하는 '왜'를 사용자에게 직접 듣는 방법입니다. 원하는 것을 묻기보다 최근에 실제로 한 행동을 묻는 쪽이 더 정확한 답을 줍니다.
- key: havruta
  label: 하브루타식 문답
  desc: 짝을 지어 질문하고 답하며 생각을 끌어내는 유대인의 학습법입니다. 기획에서는 AI나 동료에게 답을 받는 대신 질문을 받으며, 내 논리의 빈틈과 나만의 관점을 찾아내는 데 씁니다.
- key: five_whys
  label: 5 Whys
  desc: 문제에 대해 '왜?'를 다섯 번쯤 거듭 물어 겉으로 드러난 증상 뒤의 근본 원인을 찾는 방법입니다. 원인을 사람 탓에서 멈추지 않고 구조와 과정까지 내려가는 것이 핵심입니다.
- key: premortem
  label: 사전 부검 (Pre-mortem)
  desc: 시작하기 전에 '이 프로젝트가 실패했다'고 가정하고 그 이유를 미리 적어 보는 방법입니다. 낙관이 강한 회의에서 말하기 어려운 위험을 꺼내 놓게 해 줍니다.
- key: sunk_cost
  label: 매몰 비용
  desc: 이미 들인 시간과 돈이 아까워 방향을 바꾸지 못하는 사고 습관입니다. 결정은 지금부터 들어갈 비용과 얻을 가치로만 해야 한다는 것이 원칙입니다.
- key: confirmation
  label: 확증 편향
  desc: 내 생각을 뒷받침하는 정보는 잘 보이고 반대되는 정보는 예외로 치부하는 경향입니다. 기획자의 확신이 강할수록 반대 근거를 일부러 찾는 장치가 필요합니다.
- key: north_star
  label: 핵심 지표 (North Star)
  desc: 제품이 사용자에게 주는 가치를 가장 잘 나타내는 지표 하나를 정해 두는 방법입니다. 판단 기준이 흔들릴 때 돌아갈 기준점이 되지만, 숫자만 보다 사용자 맥락을 놓치지 않도록 해야 합니다.
results:
- quadrant: low-low
  emoji: 📐
  type: 근거형 · 완성형
  name: 설계도를 끝까지 그리는 설계자
  desc: 충분한 근거를 모으고 빈틈없이 완성한 뒤에 내놓습니다. 결과물의 완성도는 높지만, 시장이나 사용자가 바뀌는 속도보다 기획이 늦어질 수 있습니다.
  checks:
  - 지금 모으는 자료가 결정을 바꿀 수 있는 정보인지, 안심을 위한 정보인지.
  - 70% 상태에서 보여 줄 수 있는 안전한 상대가 있는지.
  - 완성 전에 가장 큰 가정 하나만이라도 먼저 확인할 수 있는지.
- quadrant: low-high
  emoji: 🧪
  type: 근거형 · 반복형
  name: 데이터로 빠르게 도는 실험가
  desc: 근거를 중시하되, 작게 만들어 내놓고 반응 데이터로 빠르게 고칩니다. 학습 속도가 빠른 대신, 측정하기 쉬운 것만 개선하다 큰 방향을 놓칠 수 있습니다.
  checks:
  - 실험들이 하나의 큰 질문을 향하고 있는지.
  - 숫자로 잡히지 않는 사용자 불편을 들을 통로가 있는지.
  - 작은 개선을 반복하다 방향 자체를 점검하는 시점을 놓치지 않는지.
- quadrant: high-low
  emoji: 🔭
  type: 가설형 · 완성형
  name: 큰 그림을 먼저 그리는 비전가
  desc: 강한 가설과 직관으로 방향을 정하고, 그 그림을 완성도 있게 그려 냅니다. 설득력 있는 기획을 만들지만, 틀린 가설 위에 많은 것을 쌓을 위험이 있습니다.
  checks:
  - 가장 중요한 가설을 확인할 수 있는 가장 빠른 방법이 무엇인지.
  - 반대 근거를 일부러 찾아본 적이 있는지.
  - 사전 부검으로 실패 시나리오를 먼저 적어 볼 수 있는지.
- quadrant: high-high
  emoji: ⚡
  type: 가설형 · 반복형
  name: 일단 부딪혀 보는 개척자
  desc: 떠오른 아이디어를 바로 만들어 보고 부딪히며 배웁니다. 실행력이 가장 큰 장점이지만, 무엇을 배웠는지 정리하지 않으면 같은 실수를 반복하기 쉽습니다.
  checks:
  - 시도마다 확인하려던 가설을 한 문장으로 적어 두는지.
  - 성공과 실패를 판단할 기준을 시작 전에 정해 두는지.
  - 매몰 비용 때문에 멈춰야 할 때 멈추지 못하고 있지는 않은지.
- quadrant: middle
  emoji: 🧩
  type: 균형형
  name: 질문으로 균형을 잡는 조율자
  desc: 근거와 직관, 완성도와 속도 사이에서 상황에 맞게 조율합니다. 팀을 잘 이끄는 방식이지만, 모두의 의견을 반영하다 기획의 날이 무뎌질 수 있습니다.
  checks:
  - 이번 기획에서 무엇을 가장 우선할지 한 문장으로 말할 수 있는지.
  - 조율이 결정을 미루는 방식이 되고 있지는 않은지.
  - 스스로에게 던질 핵심 질문 목록을 갖고 있는지.
share_text: 무엇에서 출발하고, 어떤 속도로 만드는가. 기획자의 생각 습관을 보는 10문항 자기 점검.
---
