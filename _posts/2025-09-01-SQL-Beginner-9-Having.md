---
title: "그룹화된 데이터 필터링: HAVING은 WHERE와 뭐가 다를까?"
date: 2025-09-01 11:00:00 +0900
categories: [SQL]
---

# 그룹화된 데이터 필터링: HAVING은 WHERE와 뭐가 다를까?

`GROUP BY`로 '나라별 고객 수'를 구하고 나니 새로운 질문이 생겼습니다. '그럼 고객이 10명 이상인 나라는 어디지?' 이 질문에 답하기 위해 자연스럽게 `WHERE` 절을 사용해봤습니다.

`... WHERE COUNT(*) > 10;` -> **에러 발생!**

왜 안될까? 한참을 고민하다가 `WHERE`와 `HAVING`의 결정적인 차이에 대해 배우게 되었습니다.

## WHERE vs HAVING

- **`WHERE`**: **그룹화 전(before grouping)**, 테이블의 개별 행들을 필터링합니다. 즉, 어떤 데이터를 가지고 그룹을 만들지 사전에 정하는 역할을 합니다.
- **`HAVING`**: **그룹화 후(after grouping)**, `GROUP BY`에 의해 만들어진 그룹들 자체를 필터링합니다. 집계 함수에 대한 조건을 걸 때 사용됩니다.

순서: `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY`

## 기본 사용법

`HAVING` 절은 `GROUP BY` 절 바로 뒤에 위치합니다.

```sql
SELECT column_name1, AGGREGATE_FUNCTION(column_name2)
FROM table_name
GROUP BY column_name1
HAVING condition_on_aggregate_function;
```

## 예제를 통해 알아보기

자, 다시 처음의 질문으로 돌아가 '고객 수가 10명 이상인 국가'를 찾아봅시다.

```sql
-- 1. Customers 테이블에서
-- 2. Country를 기준으로 그룹화하고 각 그룹의 고객 수를 센다.
-- 3. 그 결과 그룹들 중에서, 고객 수가 10보다 큰 그룹만 필터링한다.
SELECT Country, COUNT(*) AS NumberOfCustomers
FROM Customers
GROUP BY Country
HAVING COUNT(*) > 10;
```

이렇게 하니 원했던 결과가 정확하게 나왔습니다. `WHERE`와 `HAVING`은 비슷해 보이지만, 데이터 처리 파이프라인의 어느 단계에서 동작하는지가 완전히 다른, 별개의 기능이었습니다.

## 오늘의 정리

`WHERE`와 `HAVING`의 차이를 이해한 것은 `GROUP BY`를 제대로 이해하기 위한 마지막 퍼즐 조각 같았습니다. 이제 저는 데이터를 그룹화하고, 그 그룹을 또 원하는 조건으로 필터링하는 강력한 분석 능력을 갖추게 되었습니다. 헷갈리지 않도록 꼭 기억해둬야겠습니다.
