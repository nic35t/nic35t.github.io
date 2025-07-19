---
title: "[AI 기초] Linear Regression"
excerpt: "3주차 머신러닝 기초를 배웠습니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-12T19:28:00-05:00
categories:
  categories: [AI-ML]
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 3주차입니다.      
선형 회귀와 경사 하강법을 배우며 강의만으로 부족한 부분이 있어 자료를 찾아    
추가 학습했습니다. 가장 효과적인 공부는 말해보는 거라... 글로 남깁니다.    

> **_다시 시작하는 인공지능 공부_**    

제가 나름대로 이해한 내용을 바탕으로 식을 세웠습니다.   

Process
=====
```
배운 내용 : 선형 회귀 나름대로 세워보기
```
```python
import numpy as np
xy = np.random.randn(2,5)
xy

x = xy[0] # 하나의 대상을 나타내는 데이터 = [키, 몸무게, ... ] 행백터가 데이터를 표현함
y = xy[1] # x 데이터와 관계된 실측 데이터 

lr = 0.001

# 가설 세우기 - 가설 수립을 위한 임의의 w,b 랜덤하게 할당
w = np.random.randn(1)
b = np.random.randn(1)
xy, w, b

for i in range(50000):
    # 데이터와 예측치 이용해 아는 것 정리하기
    pred = w * x + b #초기 임의 설정된 모델 
    error = ((pred - y) ** 2).mean() #에러 - 로스펑션이 가장 낮은 값이, 가장 가깝게 만드는게 목표

    # 경사 하강 설정하기 - 영향주는 것들 활용하여 경사 업데이트 - lr 적용
    w -= lr * (2 * (pred - y) * x).mean() #하강을 위한 방향성 설정 필요 - 에러 함수로 방향 판단 - 역전파
    b -= lr * 2 * (pred - y).mean() 
    
    print(f"error : {error}, w : {w}, b : {b}")
```

Output
=====
강의는 좋지만 천재들이 말하는 걸 이해하기에는 추가 학습과   
나만의 해석을 정리하는 과정이 필요했습니다.   
결국, 여러 차원으로 된 여러 벡터(데이터)를 가장 잘 표현하는 산 찾기!!    
예전에 추천 시스템을 만들겠다고 20차원(벡터의 20개 변수)을 이야기하던   
그 때의 아이디어를 잘 표현하는 선 하나를 찾는 여정이 시작될 거 같습니다.