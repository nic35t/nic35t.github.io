---
title: "[AI 기초] 클래스 - super, self"
excerpt: "5주 과정으로 조별과제 중입니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-01-29T19:28:00-05:00
categories:
  - AI 기초 by 부스트코스
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 2주차입니다.      
역시나 시간이 부족하여, 새벽 공부를 하고 있지만... 그래도 아는 게 늘어 좋습니다.      

> **_다시 시작하는 인공지능 공부_**   

2주차는 객체 지향의 개념과 클래스에 대해 배웠습니다.

Process
=====
```
배운 내용 : Class
```
```python
#함수와 유사한 방식으로 처리
#단, def는 snake_case, Class는 CamelCase로 작명

class Monster(object):
    def __init__(self, name, level):
        self.name = name
        self.level = level
        
    
    def __str__(self):
        return f"This is {self.name}, level {self.level}"

#클래스 상속 _ super
class Monster:
    def __init__(self, name, level):
        self.name = name
        self.level = level


class Slime(Monster):
    def __init__(self, name, level, size):
        super().__init__(name, level)
        self.size = size

#클래스 內 함수 간 호출 _ self
import csv

class ReadCsv():
    def __init__(self, path):
        self.path = path

        
    def read_f(self):
        with open(self.path, 'r', encoding='utf-8') as f:
            lines = csv.reader(f)
            return [list(map(int, line)) for line in lines]


    def merge_l(self):
        with open(self.path, 'r', encoding='utf-8') as f:
            lines = self.read_f() #클래스 內 선언한 함수 호출
            return [sum(map_lines) for map_lines in lines]

path = "./****.csv"
read_csv = ReadCsv(path)
print(read_csv.read_f())
print(read_csv.merge_l())
```

Output
=====
과제를 코치 분들이 검토 및 코멘트를 달아주시는데,    
예전에 코드가 좋은지 나쁜지 몰랐던 때와 달리,   
깔끔한 풀이라는 말을 들으니 기분이 좋습니다 :)))
