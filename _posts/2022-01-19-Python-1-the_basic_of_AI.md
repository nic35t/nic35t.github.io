---
title: "[AI 기초] 자료형 & 파이써닉 코드"
excerpt: "5주 과정으로 조별과제 중입니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-01-19T19:28:00-05:00
categories:
  - AI 기초 다지기 by 부스트코스
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 선발되었습니다.   
일전에 `PY4E`를 통해 기초를 다지고, 인공지능 과정을 수강 신청을 했지만   
일정에 쫓겨 재대로 수강하지 못하고 아직도 나의 강의에 등록되어 있는데   
주단위 미션과 코칭가지 받을 수 있는 프로그램이라 멱살잡혀 공부를 하게 될 거 같습니다.   

> **_다시 시작하는 인공지능 공부_**   

1주차는 자료형부터 입출력 방법까지 기초를 다시 훑어본다고 합니다.  
그리고 트랜디한 파이썬 코드 작성법까지 배웁니다.

Process
=====
```
배운 내용 : f-string
```
```python
name = 'sanghyo'
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
과제를 코치 분들이 검토 및 코멘트를 달아주시는데,    
예전에 코드가 좋은지 나쁜지 몰랐던 때와 달리,   
깔끔한 풀이라는 말을 들으니 기분이 좋습니다 :))
