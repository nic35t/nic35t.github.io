---
title: "데이터 개수 세기: COUNT 함수와 AS로 별명 붙이기"
date: 2025-08-27 09:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, Functions]
---

# 데이터 개수 세기: COUNT 함수와 AS로 별명 붙이기

오늘은 처음으로 '함수'라는 걸 배웠다. 그중에서도 가장 기본인 `COUNT`! 말 그대로 개수를 세어주는 함수다.

`SELECT COUNT(*) FROM Customers;`

전체 고객이 몇 명인지 바로 알려준다. 신기하다. 그런데 결과 열 이름이 `COUNT(*)`라고 나오니 좀 이상했다. 이럴 때 `AS`를 써서 별명을 붙여줄 수 있다고 한다.

`SELECT COUNT(*) AS NumberOfCustomers FROM Customers;`

이제 결과가 `NumberOfCustomers`라는 이름으로 훨씬 보기 좋게 나온다. 작은 차이지만 정말 중요한 팁인 것 같다.
