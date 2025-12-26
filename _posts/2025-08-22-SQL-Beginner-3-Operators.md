---
title: "더 똑똑한 필터링: AND, OR, LIKE 연산자"
date: 2025-08-22 10:00:00 +0900
categories: [SQL]
tags: ['SQL', 'Database', 'Beginner', 'Diary', 'Operators']
header:
  teaser: /assets/images/noteaser.jpg
---

# 더 똑똑한 필터링: AND, OR, LIKE 연산자

`WHERE` 절로 조건을 하나씩 거는 것은 이제 익숙해졌습니다. 하지만 '미국에 사는 고객' 이면서 '도시는 뉴욕'인 사람을 찾으려면 어떻게 해야 할까요? 오늘 여러 조건을 조합하는 `AND`, `OR` 연산자와 특정 패턴의 문자열을 찾는 `LIKE` 연산자를 배웠습니다.

## 기본 사용법

- `AND`: 모든 조건이 참일 경우에만 데이터를 반환합니다.
- `OR`: 여러 조건 중 하나라도 참이면 데이터를 반환합니다.
- `LIKE`: 문자열 내용의 일부를 검색할 때 사용하며, 보통 와일드카드(`%`, `_`)와 함께 쓰입니다.

```sql
SELECT * FROM table_name WHERE condition1 AND condition2;
SELECT * FROM table_name WHERE condition1 OR condition2;
SELECT * FROM table_name WHERE column_name LIKE 'pattern';
```

## 예제를 통해 알아보기

1.  **AND 예제**: `Customers` 테이블에서 '독일(Germany)'에 살면서 '베를린(Berlin)'에 거주하는 고객 찾기

    ```sql
    SELECT * FROM Customers 
    WHERE Country = 'Germany' AND City = 'Berlin';
    ```

2.  **OR 예제**: '독일(Germany)' 또는 '미국(USA)'에 사는 모든 고객 찾기

    ```sql
    SELECT * FROM Customers
    WHERE Country = 'Germany' OR Country = 'USA';
    ```

3.  **LIKE 예제**: 고객 이름(`CustomerName`)이 'A'로 시작하는 모든 고객 찾기 (`%`는 모든 문자를 의미)

    ```sql
    SELECT * FROM Customers
    WHERE CustomerName LIKE 'A%';
    ```

## 오늘의 정리

`AND`, `OR`, `LIKE`를 배우니 제가 할 수 있는 데이터 필터링이 훨씬 더 정교해졌습니다. 이제는 정말 원하는 데이터를 거의 대부분의 조건으로 찾아낼 수 있을 것 같은 자신감이 듭니다. 특히 `LIKE`는 검색 기능의 핵심일 것 같다는 생각이 들었습니다. SQL, 점점 더 재미있어지네요!
