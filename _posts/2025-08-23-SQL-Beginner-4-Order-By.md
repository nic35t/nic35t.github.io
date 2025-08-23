---
title: "깔끔하게 정리하기: ORDER BY로 데이터 정렬하기"
date: 2025-08-23 15:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, ORDER BY]
---

# 깔끔하게 정리하기: ORDER BY로 데이터 정렬하기

쿼리 결과가 뒤죽박죽이라 보기 힘들었는데, `ORDER BY`를 배우고 광명을 찾았다. 말 그대로 결과를 정렬해주는 명령어다.

`SELECT ProductName, Price FROM Products ORDER BY Price DESC;`

이렇게 하면 상품(Products)들을 가격(Price) 순으로, 그것도 비싼 것부터(내림차순, `DESC`) 보여준다. 오름차순은 `ASC`라고 하는데, 이건 생략해도 기본값이라고 한다. 데이터를 보기 좋게 정리하는 것도 능력이라는 걸 깨달았다.
