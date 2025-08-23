---
title: "데이터 그룹화: GROUP BY의 개념과 활용"
date: 2025-08-30 16:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, GROUP BY]
---

# 데이터 그룹화: GROUP BY의 개념과 활용

오늘은 많은 SQL 초보자들이 첫 번째 고비로 꼽는다는 `GROUP BY` 절을 배웠습니다. 처음에는 개념이 무척 헷갈렸는데, '...별로'라는 키워드를 떠올리니 조금 이해가 쉬워졌습니다. 예를 들어 '나라별 고객 수', '카테고리별 상품 수' 처럼요.

## 기본 사용법

`GROUP BY`는 특정 열의 값이 같은 행들을 하나의 그룹으로 묶어주는 역할을 합니다. 그리고 각 그룹에 대해 집계 함수(`COUNT`, `SUM` 등)를 적용하여 의미 있는 결과를 얻을 수 있습니다.

```sql
SELECT column_name1, AGGREGATE_FUNCTION(column_name2)
FROM table_name
GROUP BY column_name1;
```

- **중요!**: `GROUP BY`를 사용할 때 `SELECT` 절에는 `GROUP BY`에 사용된 열과 집계 함수만 올 수 있습니다. (다른 일반 열을 쓰면 에러가 나요!)

## 예제를 통해 알아보기

`Customers` 테이블을 사용해서 '각 나라(Country)별로 고객이 몇 명이나 있는지' 알아봅시다.

```sql
-- 1. Country 열의 값이 같은 고객들을 그룹으로 묶는다.
-- 2. 각 그룹별로 고객의 수(COUNT(*))를 센다.
-- 3. Country와 계산된 고객 수를 보여준다.
SELECT Country, COUNT(*) AS NumberOfCustomers
FROM Customers
GROUP BY Country;
```

이 쿼리를 실행하면 'USA, 13', 'Germany, 11', 'France, 11' 과 같이 각 나라와 그 나라에 사는 고객 수가 표로 깔끔하게 정리되어 나옵니다. `GROUP BY`가 없었다면 상상도 못 할 결과죠.

## 오늘의 정리

`GROUP BY`는 데이터를 요약하고 인사이트를 얻는 데 필수적인 기능이었습니다. 전체 데이터가 아닌, 특정 기준에 따라 그룹화된 통계를 볼 수 있게 되면서 제가 할 수 있는 분석의 폭이 확 넓어졌습니다. 아직은 조금 더 연습이 필요하지만, 이 강력한 기능을 알게 되어 정말 기쁩니다. 다음엔 그룹화된 데이터를 필터링하는 법을 배워볼 차례입니다.