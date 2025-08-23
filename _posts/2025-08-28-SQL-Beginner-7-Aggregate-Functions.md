---
title: "숫자 데이터 요리하기: SUM, AVG, MAX, MIN 함수"
date: 2025-08-28 14:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, Aggregate]
---

# 숫자 데이터 요리하기: SUM, AVG, MAX, MIN 함수

`COUNT`에 이어 숫자 데이터를 다루는 집계 함수들을 배웠다. `SUM`(합계), `AVG`(평균), `MAX`(최댓값), `MIN`(최솟값). 이름만 봐도 뭘 하는지 알겠다.

`SELECT SUM(Price) FROM Products;` -> 모든 상품 가격의 합계
`SELECT AVG(Price) FROM Products;` -> 상품 가격의 평균
`SELECT MAX(Price) FROM Products;` -> 가장 비싼 상품의 가격
`SELECT MIN(Price) FROM Products;` -> 가장 싼 상품의 가격

이 함수들 덕분에 단순 데이터를 넘어 의미 있는 정보를 뽑아낼 수 있게 되었다. 데이터를 분석한다는 게 이런 느낌일까? 점점 더 흥미로워진다.
