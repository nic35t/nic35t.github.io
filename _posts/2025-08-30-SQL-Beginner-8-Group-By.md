---
title: "데이터 그룹화: GROUP BY의 개념과 활용"
date: 2025-08-30 16:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, GROUP BY]
---

# 데이터 그룹화: GROUP BY의 개념과 활용

오늘은 SQL 초보에게 큰 산이라는 `GROUP BY`를 배웠다. 처음엔 개념이 어려웠다. '나라별로 고객이 몇 명이지?' 같은 질문에 답을 주는 기능이라고 한다.

`SELECT Country, COUNT(*) FROM Customers GROUP BY Country;`

이 쿼리를 실행하니 나라 이름과 그 나라에 사는 고객 수가 표로 딱 나왔다. `GROUP BY`는 `Country` 열의 값들을 기준으로 데이터를 그룹으로 묶고, `COUNT(*)`가 각 그룹의 데이터 수를 세어준 것이다. 집계 함수랑 같이 써야 의미가 있다는 걸 깨달았다. 아직은 좀 헷갈리지만, 정말 강력한 기능이라는 건 확실히 알겠다.
