---
title: "[AI 기초] Python-1: 자료형 & 파이써닉 코드"
excerpt: "5주 과정으로 조별과제 중입니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-01-19T19:28:00-05:00
categories: [AI]
tags:
  - Python
  - TIL
  - AI
  - Data Type
  - Pythonic Code
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 선발되었습니다.   
일전에 `PY4E`를 통해 기초를 다지고, 인공지능 과정을 수강했지만   
일정에 쫓겨 재대로 수강하지 못하고 아직도 나의 강의에 등록되어 있는데   
주단위 미션과 코칭까지 받을 수 있는 프로그램이라 멱살잡혀 공부를 하게 될 거 같습니다.   

> **_다시 시작하는 인공지능 공부_**   

1주차는 자료형부터 입출력 방법까지 기초를 다시 훑어본다고 합니다.  
그리고 트랜디한 파이썬 코드 작성법까지 배웁니다.

Process
=====
```
배운 내용 : f-string
```
```python
name = 'Jeremy Lee'
age = 36

#가운데 정렬
txt = f"Hello, {name:^10}, {age} years old."

#왼쪽 정렬
txt1 = f"Hello, {name:<10}, {age} years old."

#오른쪽 정렬
txt2 = f"Hello, {name:>10}, {age} years old."

#소숫점 숫자
txt3 = f"Hello, {name:<10}, {age:10.3f} years old."

```

Output
=====
1주는 기초 겸 기본 개념을 배워, 예전에 배운 것과 겹치는 부분도 많았지만,   
포맷팅을 처음 배우는 내용이라 기존에 힘들게 포맷을 잡아 넣었던 기억을 생각하면,   
많이 배우고 들어야 편해질수 있겠구나라는 생각이 들었습니다 :)   