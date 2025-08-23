---
title: "숫자 데이터 요리하기: SUM, AVG, MAX, MIN 함수"
date: 2025-08-28 14:00:00 +0900
categories: [SQL]

---

# 숫자 데이터 요리하기: SUM, AVG, MAX, MIN 함수

`COUNT` 함수로 데이터의 개수를 세는 법을 배우고 나니, 숫자 데이터들을 더 다양하게 요리하고 싶어졌습니다. 오늘은 숫자 열에 사용할 수 있는 대표적인 집계 함수들인 `SUM`, `AVG`, `MAX`, `MIN`에 대해 배웠습니다.

## 기본 사용법

이 함수들은 숫자 형식의 데이터가 들어있는 열에만 사용할 수 있습니다. 이름만 봐도 어떤 기능을 하는지 명확하게 알 수 있죠.

- `SUM(column_name)`: 해당 열의 모든 값을 더한 합계를 구합니다.
- `AVG(column_name)`: 해당 열의 모든 값의 평균을 구합니다.
- `MAX(column_name)`: 해당 열에서 가장 큰 값을 찾습니다.
- `MIN(column_name)`: 해당 열에서 가장 작은 값을 찾습니다.

```sql
SELECT AGGREGATE_FUNCTION(column_name)
FROM table_name;
```

## 예제를 통해 알아보기

`Products` 테이블에 있는 상품들의 가격(`Price`) 정보를 가지고 여러 가지 통계를 내보겠습니다.

1.  **모든 상품 가격의 총합 (`SUM`)**
    ```sql
    SELECT SUM(Price) AS TotalPrice FROM Products;
    ```
2.  **상품들의 평균 가격 (`AVG`)**
    ```sql
    SELECT AVG(Price) AS AveragePrice FROM Products;
    ```
3.  **가장 비싼 상품의 가격 (`MAX`)**
    ```sql
    SELECT MAX(Price) AS HighestPrice FROM Products;
    ```
4.  **가장 저렴한 상품의 가격 (`MIN`)**
    ```sql
    SELECT MIN(Price) AS LowestPrice FROM Products;
    ```

## 오늘의 정리

이 네 가지 함수 덕분에 저는 이제 단순한 데이터 조회를 넘어, 의미 있는 '통계 정보'를 추출할 수 있게 되었습니다. 비즈니스 질문에 대한 답을 찾는 과정이 이런 것일까요? '우리 상품의 평균 가격은 얼마지?', '가장 비싼 상품은 뭐지?' 같은 질문에 바로 답할 수 있게 된 것이죠. 데이터를 분석한다는 것의 매력을 조금 더 깊이 느낄 수 있었던 하루였습니다.