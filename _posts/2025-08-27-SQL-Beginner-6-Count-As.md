---
title: "데이터 개수 세기: COUNT 함수와 AS로 별명 붙이기"
date: 2025-08-27 09:00:00 +0900
categories: [SQL]
tags: ['SQL', 'Database', 'Beginner', 'Diary', 'Functions']
header:
  teaser: /assets/images/noteaser.jpg
---

# 데이터 개수 세기: COUNT 함수와 AS로 별명 붙이기

지금까지는 테이블에 있는 데이터를 그대로 가져와서 보거나 필터링하는 법을 배웠습니다. 오늘은 여기서 한 단계 더 나아가, 데이터에 대한 계산을 하는 '집계 함수'라는 것을 처음 만났습니다. 그중 가장 기본인 `COUNT()` 함수입니다.

## 기본 사용법

`COUNT()` 함수는 이름 그대로 선택된 열의 데이터(행) 개수를 세어줍니다.

```sql
SELECT COUNT(column_name)
FROM table_name;
```

- `COUNT(*)` 처럼 별표를 사용하면 특정 열이 아닌, 테이블의 전체 행의 개수를 세어줍니다.
- `AS` 키워드를 사용하면 결과로 나온 열의 이름을 원하는 대로 바꿀 수 있습니다. 이걸 '별명(Alias)'이라고 부르더군요.

## 예제를 통해 알아보기

`Customers` 테이블에 고객이 총 몇 명인지 알고 싶을 때, 아래와 같이 쿼리를 작성할 수 있습니다.

```sql
-- Customers 테이블의 전체 행의 개수를 세어주세요.
SELECT COUNT(*)
FROM Customers;
```

그런데 이렇게 실행하니 결과 열의 이름이 `COUNT(*)`라고 그대로 나와서 보기가 좋지 않았습니다. 이럴 때 `AS`를 사용합니다.

```sql
-- 열 이름을 'NumberOfCustomers'로 바꿔서 보여주세요.
SELECT COUNT(*) AS NumberOfCustomers
FROM Customers;
```

이제 결과가 `NumberOfCustomers`라는 깔끔한 이름으로 나옵니다. 훨씬 전문적으로 보이지 않나요?

## 오늘의 정리

`COUNT` 함수는 '그래서 총 몇 개인데?'라는 가장 기본적인 질문에 답을 주는 강력한 도구였습니다. 데이터의 양을 파악하는 것은 분석의 가장 첫 단계이죠. 그리고 `AS`를 이용해 결과에 명확한 이름을 붙여주는 작은 습관이 나중에 쿼리가 복잡해졌을 때 큰 차이를 만들 거라는 생각이 들었습니다. 사소하지만 중요한 디테일을 배운 날입니다.