---
title: "원하는 데이터만 쏙! WHERE 절로 필터링하기"
date: 2025-08-20 13:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, WHERE]
---

# 원하는 데이터만 쏙! WHERE 절로 필터링하기

`SELECT * FROM ...` 으로 테이블의 모든 데이터를 가져오는 데는 익숙해졌습니다. 하지만 실제로는 이 모든 데이터가 필요한 경우는 거의 없겠죠? 오늘은 특정 조건에 맞는 데이터만 골라내는 `WHERE` 절에 대해 배웠습니다.

## 기본 사용법

`WHERE` 절은 `FROM` 절 뒤에 사용하며, 데이터가 만족해야 할 조건을 지정해줍니다.

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

- `condition` 부분에는 `열이름 = '값'` 이나 `열이름 > 숫자` 와 같은 비교 조건을 넣습니다. 문자열 값은 보통 작은따옴표(`'`)로 감싸줍니다.

## 예제를 통해 알아보기

`Products`라는 상품 테이블에서 가격(Price)이 50달러를 초과하는 상품만 찾아보겠습니다.

```sql
-- Products 테이블에서 Price 열의 값이 50보다 큰 모든 상품 정보를 보여주세요.
SELECT *
FROM Products
WHERE Price > 50;
```

또는, `Customers` 테이블에서 'Mexico'에 사는 고객만 찾고 싶다면 아래와 같이 작성할 수 있습니다.

```sql
-- Customers 테이블에서 Country 열의 값이 'Mexico'인 고객 정보를 보여주세요.
SELECT *
FROM Customers
WHERE Country = 'Mexico';
```

이렇게 하니 정말로 조건에 맞는 데이터만 정확히 골라서 보여줍니다. 데이터를 '필터링'한다는 개념을 확실히 이해하게 된 순간이었습니다.

## 오늘의 정리

`WHERE` 절은 SQL을 훨씬 더 강력하게 만들어주는 기능이었습니다. 이제 저는 거대한 데이터 테이블 속에서 제가 원하는 정보만 정확히 찾아낼 수 있는 능력을 갖게 되었습니다. 다음에는 여러 조건을 조합하는 방법에 대해 배워볼 예정입니다.