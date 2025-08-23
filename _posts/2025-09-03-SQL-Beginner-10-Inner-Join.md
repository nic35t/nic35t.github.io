---
title: "테이블 합치기: INNER JOIN으로 관계의 힘을 배우다"
date: 2025-09-03 18:00:00 +0900
categories: [SQL]
tags: ['SQL', 'Database', 'Beginner', 'Diary', 'JOIN']
---

# 테이블 합치기: INNER JOIN으로 관계의 힘을 배우다

드디어 많은 분들이 SQL의 '꽃'이라고 부르는 `JOIN`에 대해 배웠습니다. 지금까지는 항상 하나의 테이블에서만 데이터를 조회했는데, 데이터베이스는 여러 테이블이 서로 '관계'를 맺고 있다는 사실을 배웠습니다. `JOIN`은 이 관계를 이용해 여러 테이블의 데이터를 합쳐서 보여주는 강력한 기능입니다.

오늘은 그중 가장 기본이 되는 `INNER JOIN`에 대해 알아보겠습니다.

## 기본 사용법

`INNER JOIN`은 두 테이블 사이에 공통된 값을 가진 행들만 연결하여 보여줍니다. 

```sql
SELECT table1.column1, table2.column2, ...
FROM table1
INNER JOIN table2
ON table1.common_column = table2.common_column;
```

- `INNER JOIN` 다음에 연결할 두 번째 테이블을 지정합니다.
- `ON` 절에는 두 테이블을 연결할 '연결고리'가 되는 열(common_column)을 지정해줍니다. 이 두 열에는 보통 같은 종류의 ID 값(예: CustomerID)이 저장되어 있습니다.

## 예제를 통해 알아보기

`Customers`(고객) 테이블과 `Orders`(주문) 테이블이 있다고 상상해봅시다. `Customers`에는 고객 정보가, `Orders`에는 주문 정보가 들어있습니다. 이 두 테이블을 연결해서 '어떤 고객이 어떤 주문을 했는지' 알고 싶을 때 `INNER JOIN`을 사용합니다.

```sql
-- Orders 테이블과 Customers 테이블을 CustomerID를 기준으로 합친다.
-- 그리고 Orders 테이블의 OrderID와 Customers 테이블의 CustomerName을 보여준다.
SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers 
ON Orders.CustomerID = Customers.CustomerID;
```

결과적으로 주문 ID와 그 주문을 한 고객의 이름이 나란히 나오는 것을 볼 수 있습니다. 따로따로 있던 정보가 하나로 합쳐져 의미 있는 결과가 된 것입니다.

## 오늘의 정리

`JOIN`을 배우니 비로소 데이터베이스를 제대로 활용하는 느낌이 듭니다. 데이터가 왜 여러 테이블에 나뉘어 저장되는지(정규화) 그 이유를 어렴풋이 알 것 같았습니다. `INNER JOIN`은 그 나눠진 조각들을 다시 합쳐주는 핵심적인 열쇠였습니다. 아직 `LEFT JOIN`, `RIGHT JOIN` 등 다른 종류의 조인들이 남았지만, SQL의 진짜 힘을 이제야 조금 맛본 것 같아 매우 설렙니다.