---
title: "더 똑똑한 필터링: AND, OR, LIKE 연산자"
date: 2025-08-22 10:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, Operators]
---

# 더 똑똑한 필터링: AND, OR, LIKE 연산자

`WHERE` 절에 조건을 하나만 쓰는 건 이제 익숙해졌다. 오늘은 여러 조건을 조합하는 `AND`, `OR` 그리고 특정 패턴을 찾는 `LIKE`를 배웠다.

`SELECT * FROM Customers WHERE Country = 'USA' AND City = 'New York';`

미국(USA)에 살면서, 도시(City)가 뉴욕인 고객을 찾는 쿼리다. `AND`는 두 조건이 모두 참일 때만 데이터를 보여준다. `OR`은 둘 중 하나만 맞아도 보여주고. 

`LIKE 'a%'` 처럼 쓰면 a로 시작하는 모든 것을 찾아준다니, 정말 편리하다. 점점 SQL이 재밌어진다.
