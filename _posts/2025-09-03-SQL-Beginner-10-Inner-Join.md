---
title: "테이블 합치기: INNER JOIN으로 관계의 힘을 배우다"
date: 2025-09-03 18:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, JOIN]
---

# 테이블 합치기: INNER JOIN으로 관계의 힘을 배우다

대망의 `JOIN`이다. 데이터베이스의 꽃이라고 들었다. 오늘은 가장 기본인 `INNER JOIN`을 배웠다. 서로 다른 테이블에 있는 데이터를 연결해서 하나의 결과로 보여주는 기능이다.

`SELECT Orders.OrderID, Customers.CustomerName FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;`

`Orders` 테이블과 `Customers` 테이블을 `CustomerID`라는 공통된 열을 기준으로 합쳤다. 덕분에 어떤 고객이 어떤 주문을 했는지 한눈에 볼 수 있게 되었다. 데이터가 서로 관계를 맺고 있다는 사실을 눈으로 확인하니 정말 짜릿했다. SQL의 진짜 힘을 이제야 조금 맛본 것 같다.
