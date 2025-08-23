---
title: "그룹화된 데이터 필터링: HAVING은 WHERE와 뭐가 다를까?"
date: 2025-09-01 11:00:00 +0900
categories: [SQL]
tags: [SQL, Database, Beginner, Diary, HAVING]
---

# 그룹화된 데이터 필터링: HAVING은 WHERE와 뭐가 다를까?

`GROUP BY`로 그룹을 만들고 나니, 그 그룹 자체를 필터링하고 싶어졌다. 예를 들어 '고객이 10명 이상인 나라만 보고 싶다' 같은 경우다. 이럴 때 `WHERE`를 썼더니 오류가 났다.

알고 보니 `WHERE`는 그룹화 전에, 원본 데이터를 필터링하는 것이고, `HAVING`이 그룹화된 결과에 조건을 거는 것이었다.

`SELECT Country, COUNT(*) FROM Customers GROUP BY Country HAVING COUNT(*) > 10;`

`GROUP BY` 뒤에 `HAVING`을 써서 조건을 거니 완벽하게 동작했다. `WHERE`와 `HAVING`의 차이, 오늘 확실히 배웠다. 헷갈리지 말자!
