---
title: "중복은 이제 그만: DISTINCT로 고유한 값만 보기"
date: 2025-08-25 11:30:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, DISTINCT]
---

# 중복은 이제 그만: DISTINCT로 고유한 값만 보기

고객들이 어느 나라에 살고 있는지 궁금해서 `SELECT Country FROM Customers;`를 실행했다. 그런데 같은 나라 이름이 너무 많이 중복되어서 나왔다. 미국, 미국, 멕시코, 독일, 미국...

이럴 때 쓰는 게 `DISTINCT`라고 한다. `SELECT DISTINCT Country FROM Customers;` 라고 쓰니, 중복이 싹 사라지고 나라 이름이 한 번씩만 깔끔하게 나왔다. 유레카! 정말 간단한데 강력한 기능이다.
