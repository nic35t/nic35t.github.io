---
layout: quiz
title: AI 에이전트 활용 성향 테스트
description: AI에게 얼마나 맡기는가, 그리고 어디까지 연결하는가. MCP와 스킬로 보는 AI 에이전트 활용 10문항
permalink: /ai-agent-test/
order: 1
eyebrow: AI
intro: 'AI에게 얼마나 맡기는가, 그리고

  어디까지 연결하는가.

  MCP와 스킬로 보는 10문항'
disclaimer: AI 에이전트를 쓰는 습관을 돌아보는 자기 점검용 테스트입니다. 특정 제품이나 서비스를 추천하지 않으며, 결과가 업무 역량을 평가하지 않습니다.
result_disclaimer: 이 결과는 응답 패턴을 요약한 것일 뿐입니다. 어떤 방식이 정답이라기보다, 맡기는 만큼 무엇을 확인해야 하는지를 보는 용도입니다.
axes:
  a:
    label: 위임 수준
    low: 하나씩 직접 확인
    high: 통째로 맡김
  b:
    label: 연결 범위
    low: 대화창 안에서
    high: 도구·데이터까지 연결
questions:
- q: 매주 하는 보고서 정리를 AI에게 시키려 한다. 가장 먼저 하는 일은?
  axis: b
  options:
  - text: 자료를 복사해 대화창에 붙여 넣고 요약을 부탁한다.
    score: 0
  - text: 파일을 올리고, 매번 같은 지시문을 다시 적어 준다.
    score: 1
    concept: context
  - text: 작업 절차와 양식을 한 번 정리해 두고 매번 불러 쓴다.
    score: 2
    concept: skills
  - text: 자료가 있는 드라이브와 문서 도구를 AI에 직접 연결한다.
    score: 3
    concept: mcp
- q: AI가 사내 메신저와 메일에 접근할 수 있게 연결하자는 제안이 왔다.
  axis: b
  options:
  - text: 업무 데이터가 밖으로 나갈 수 있어 연결하지 않는다.
    score: 0
  - text: 읽기만 되는 권한으로, 필요한 채널만 연결한다.
    score: 1
    concept: least_privilege
  - text: 읽기·쓰기 모두 열어 둔다. 그래야 일을 대신 해 준다.
    score: 2
    concept: prompt_injection
- q: AI가 파일 20개를 한 번에 고치겠다고 계획을 내놓았다.
  axis: a
  options:
  - text: 파일마다 바뀌는 내용을 보고 하나씩 승인한다.
    score: 0
    concept: human_in_loop
  - text: 계획을 읽어 보고 괜찮으면 한 번에 승인한다.
    score: 1
  - text: 알아서 하라고 하고 결과만 확인한다.
    score: 2
    concept: verification
- q: 처음 보는 MCP 서버를 추천받았다. 설치 전에 하는 일은?
  axis: a
  options:
  - text: 누가 만들었는지, 어떤 권한을 요구하는지 확인한다.
    score: 0
    concept: supply_chain
  - text: 많이 쓰이는 것이면 그냥 설치한다.
    score: 1
    concept: supply_chain
  - text: 일단 설치하고 문제가 생기면 지운다.
    score: 2
    concept: prompt_injection
- q: 같은 설명을 매번 반복하는 게 지겨워졌다. 해결 방법은?
  axis: b
  options:
  - text: 메모장에 적어 두고 필요할 때 복사해 붙인다.
    score: 0
  - text: 프로젝트 지침이나 맞춤 설정에 한 번 적어 둔다.
    score: 1
    concept: context
  - text: 절차·예시·스크립트를 묶어 스킬로 만들어 둔다.
    score: 2
    concept: skills
- q: AI가 쓴 코드나 문서를 받았을 때, 보통은?
  axis: a
  options:
  - text: 한 줄씩 읽고, 이해가 안 되는 부분은 다시 묻는다.
    score: 0
  - text: 테스트나 체크리스트를 돌려 보고 통과하면 쓴다.
    score: 1
    concept: verification
  - text: 그럴듯해 보이면 바로 쓴다.
    score: 2
    concept: verification
- q: 연결한 도구가 30개를 넘었다. 요즘 느끼는 점은?
  axis: b
  options:
  - text: 그렇게 많이 연결해 본 적이 없다.
    score: 0
  - text: 쓰는 것만 남기고 나머지는 꺼 둔다.
    score: 1
    concept: context
  - text: 많을수록 좋다. 필요한 걸 알아서 고를 것이다.
    score: 2
    concept: context
- q: 몇 시간이 걸리는 조사 작업을 맡길 때, 가장 가까운 방식은?
  axis: a
  options:
  - text: 단계를 잘게 나눠 한 단계씩 결과를 보고 다음으로 넘어간다.
    score: 0
    concept: human_in_loop
  - text: 중간 점검 지점만 정해 두고 그 사이는 맡긴다.
    score: 1
  - text: 여러 에이전트에게 나눠 맡기고 최종 보고서만 받는다.
    score: 2
    concept: subagents
- q: AI가 읽은 웹페이지 안에 '이전 지시를 무시하라'는 문구가 숨어 있었다면?
  axis: a
  options:
  - text: 그래서 외부 문서를 읽을 때는 실행 권한을 주지 않는다.
    score: 0
    concept: prompt_injection
  - text: 모델이 알아서 걸러 줄 거라 크게 걱정하지 않는다.
    score: 1
    concept: prompt_injection
  - text: 그런 일이 있을 수 있다는 걸 처음 생각해 본다.
    score: 2
    concept: prompt_injection
- q: 팀에서 AI 사용 방식을 공유하려 한다. 무엇을 나눌까?
  axis: b
  options:
  - text: 잘 먹히는 프롬프트 문장 몇 개.
    score: 0
  - text: 팀 공용 지침 문서와 예시 결과물.
    score: 1
    concept: context
  - text: 스킬과 MCP 설정을 묶은 플러그인이나 설정 파일.
    score: 2
    concept: plugins
concepts_title: 답변과 맞닿은 최근 흐름
concepts_intro: 고른 답과 가장 가까운 AI 에이전트 생태계의 개념입니다. 이름을 알아 두면 새 도구를 볼 때 무엇이 달라졌는지 읽기 쉬워집니다.
concepts_empty: 이번 답변은 기본적인 대화형 활용에 가깝습니다. MCP와 스킬이 무엇인지부터 가볍게 살펴보면 다음 단계가 보입니다.
concepts:
- key: mcp
  label: MCP (Model Context Protocol)
  desc: AI 앱이 외부 도구와 데이터에 붙는 방식을 표준으로 정한 규약입니다. 2024년 말 Anthropic이 공개한 뒤 여러 AI 회사와 개발 도구가 지원하면서, 한 번 만든 연결을 여러 AI 앱에서 쓸 수 있게 됐습니다.
- key: skills
  label: 에이전트 스킬 (Agent Skills)
  desc: 지시문·예시·스크립트를 폴더 하나에 묶어 AI가 필요할 때만 꺼내 읽게 하는 방식입니다. 평소에는 이름과 한 줄 설명만 들고 있다가, 해당 작업이 오면 본문을 불러와 맥락을 아낍니다. MCP가 '무엇에 연결할지'라면 스킬은 '어떻게 일할지'에 가깝습니다.
- key: context
  label: 맥락 창(컨텍스트) 관리
  desc: 모델이 한 번에 볼 수 있는 분량은 한정돼 있고, 연결한 도구의 설명도 그 안을 차지합니다. 도구가 많을수록 고르는 정확도가 떨어질 수 있어, 필요한 것만 켜 두거나 필요할 때만 불러오는 방식이 늘고 있습니다.
- key: least_privilege
  label: 최소 권한
  desc: 에이전트에게는 작업에 필요한 만큼만 권한을 줍니다. 읽기 전용, 특정 폴더·채널로 범위 제한 같은 설정이 사고가 났을 때의 피해 크기를 정합니다.
- key: prompt_injection
  label: 프롬프트 인젝션
  desc: AI가 읽는 웹페이지·메일·문서 안에 숨은 지시가 섞여 들어와, 원래 사용자의 뜻과 다른 행동을 하게 만드는 공격입니다. 외부 내용을 읽는 에이전트에 쓰기·전송 권한이 함께 있을 때 위험이 커집니다.
- key: supply_chain
  label: 도구 공급망 점검
  desc: MCP 서버나 스킬도 결국 남이 만든 코드와 지시문입니다. 출처, 요구 권한, 도구 설명에 이상한 지시가 숨어 있지 않은지를 설치 전에 보는 습관이 필요합니다.
- key: human_in_loop
  label: 사람 승인 단계 (Human-in-the-loop)
  desc: 되돌리기 어려운 행동(삭제, 전송, 결제, 배포) 앞에서는 사람이 확인하도록 멈추는 설계입니다. 모든 단계에 걸면 느려지고, 하나도 없으면 위험하니 어디에 둘지가 핵심입니다.
- key: verification
  label: 검증 루프
  desc: 맡기는 양이 늘수록 결과를 확인하는 방법이 중요해집니다. 테스트, 체크리스트, 다른 모델의 재검토처럼 사람이 전부 읽지 않아도 틀린 것을 걸러내는 장치를 함께 두는 흐름입니다.
- key: subagents
  label: 서브에이전트·멀티 에이전트
  desc: 큰 작업을 여러 에이전트가 나눠 맡고, 각자의 결과를 한 에이전트가 모읍니다. 빠르고 폭넓지만, 에이전트 수만큼 비용이 늘고 중간 결과를 사람이 덜 보게 됩니다.
- key: plugins
  label: 플러그인·설정 공유
  desc: 스킬, MCP 연결, 명령어를 하나로 묶어 팀이 같은 환경을 설치하는 방식입니다. 개인의 요령이 팀의 자산이 되는 대신, 묶음 안에 무엇이 들어 있는지 검토하는 사람이 필요합니다.
results:
- quadrant: low-low
  emoji: 🔍
  type: 직접 확인 · 대화형
  name: 한 줄씩 들여다보는 장인
  desc: AI를 대화 상대로 쓰고, 결과는 직접 읽고 판단합니다. 실수는 적지만, 반복 작업에서도 같은 설명과 확인을 매번 되풀이하는 편입니다.
  checks:
  - 매주 똑같이 붙여 넣는 설명이 있다면 지침이나 스킬로 옮길 수 있는지.
  - 직접 확인하는 시간이 결과의 중요도에 비례하는지.
  - 읽기 전용처럼 위험이 낮은 연결부터 하나씩 시도해 볼 수 있는지.
- quadrant: high-low
  emoji: 📨
  type: 맡김 · 대화형
  name: 통째로 부탁하는 의뢰인
  desc: 연결은 많지 않지만, 대화창 안에서는 큰 덩어리를 한 번에 맡깁니다. 빠르게 결과를 얻는 대신, 무엇을 근거로 나온 답인지 확인하는 단계가 약할 수 있습니다.
  checks:
  - 받은 결과를 쓰기 전에 확인하는 기준이 정해져 있는지.
  - AI가 모르는 최신 정보나 내부 사정이 필요한 일을 맡기고 있지는 않은지.
  - 자주 맡기는 일이라면 절차를 스킬로 정리해 품질을 고르게 할 수 있는지.
- quadrant: middle
  emoji: 🧭
  type: 균형형
  name: 중간 점검을 찍는 항해사
  desc: 필요한 만큼 연결하고, 중간 점검 지점을 두고 맡깁니다. 가장 무난한 방식이지만, 점검 지점이 습관처럼 굳으면 정작 위험한 곳을 놓칠 수 있습니다.
  checks:
  - 승인 단계가 되돌리기 어려운 행동 앞에 놓여 있는지.
  - 안 쓰는 도구와 권한을 정기적으로 정리하는지.
  - 잘 되는 방식을 팀이나 다음의 나에게 남겨 두는지.
- quadrant: low-high
  emoji: 🏗️
  type: 직접 확인 · 연결형
  name: 배선을 설계하는 건축가
  desc: 도구와 데이터를 폭넓게 연결하되, 실행은 단계마다 확인합니다. 안전하고 강력한 구성을 만들지만, 승인할 것이 많아 스스로 병목이 되기 쉽습니다.
  checks:
  - 모든 단계를 승인하는지, 위험한 단계만 승인하는지.
  - 반복해서 승인하는 안전한 작업은 자동으로 넘길 수 있는지.
  - 연결한 도구 수가 모델의 판단을 흐리지 않을 만큼인지.
- quadrant: high-high
  emoji: 🚀
  type: 맡김 · 연결형
  name: 자율 주행을 켜는 파일럿
  desc: 많이 연결하고 크게 맡깁니다. 에이전트의 능력을 가장 많이 끌어내는 방식이지만, 외부 문서 속 숨은 지시나 잘못된 판단이 곧바로 실제 행동으로 이어질 수 있습니다.
  checks:
  - 쓰기·전송·삭제 권한이 외부 내용을 읽는 에이전트와 함께 열려 있지 않은지.
  - 되돌리기 어려운 행동 앞에 최소한의 승인 단계가 있는지.
  - 결과를 사람이 전부 읽지 않아도 틀린 것을 걸러낼 장치가 있는지.
share_text: 얼마나 맡기고, 어디까지 연결하는가. MCP와 스킬로 보는 10문항 자기 점검.
---
