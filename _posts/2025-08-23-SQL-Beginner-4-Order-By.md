---
title: "깔끔하게 정리하기: ORDER BY로 데이터 정렬하기"
date: 2025-08-23 15:00:00 +0900
categories: [SQL]
tags: ['SQL', 'Database', 'Beginner', 'Diary', 'ORDER BY']
---

# 깔끔하게 정리하기: ORDER BY로 데이터 정렬하기

지금까지 쿼리를 실행하면 데이터가 그냥 데이터베이스에 저장된 순서대로 나왔습니다. 그러다 보니 결과가 뒤죽박죽이라 보기가 좀 힘들었는데요. 오늘 `ORDER BY`를 배우고 나서 광명을 찾았습니다. 말 그대로 결과를 '정렬'해주는 아주 중요한 명령어였습니다.

## 기본 사용법

`ORDER BY` 절은 쿼리문의 가장 마지막에 위치하며, 어떤 열을 기준으로 정렬할지 지정합니다.

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column_to_sort ASC|DESC;
```

- `ASC`: 오름차순 (Ascending)의 약자로, 작은 값부터 큰 값 순서로 정렬합니다. (예: 1, 2, 3 / A, B, C)
- `DESC`: 내림차순 (Descending)의 약자로, 큰 값부터 작은 값 순서로 정렬합니다. (예: 3, 2, 1 / C, B, A)
- `ASC`는 기본값이므로, 오름차순으로 정렬할 때는 생략할 수 있습니다.

## 예제를 통해 알아보기

`Products` 테이블의 상품들을 가격(`Price`)이 비싼 순서대로 보고 싶을 때, 아래와 같이 쿼리를 작성할 수 있습니다.

```sql
-- Products 테이블에서 상품 이름과 가격을 조회하되, 가격(Price)을 기준으로 내림차순(DESC) 정렬해주세요.
SELECT ProductName, Price
FROM Products
ORDER BY Price DESC;
```

만약 고객 이름을 알파벳 순서로 보고 싶다면 어떨까요?

```sql
-- Customers 테이블의 모든 정보를 고객 이름(CustomerName)을 기준으로 오름차순(ASC) 정렬해주세요.
SELECT * 
FROM Customers
ORDER BY CustomerName ASC; -- ASC는 생략 가능!
```

## 오늘의 정리

데이터를 그냥 가져오는 것과 잘 '정리'해서 가져오는 것은 정말 큰 차이가 있었습니다. `ORDER BY`는 분석의 기본 중의 기본이라는 생각이 들었습니다. 가장 비싼 상품, 가장 최근 가입한 고객 등을 찾을 때 무조건 필요한 기능이네요. 데이터를 보기 좋게 만드는 것도 개발자의 중요한 역량이라는 걸 깨달은 하루였습니다.
