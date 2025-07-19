---
title: "[AI 기초] Python-4: Vector & Array"
excerpt: "5주 과정으로 조별과제 중입니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-08T19:28:00-05:00
categories: [AI]
tags:
  - Python
  - TIL
  - AI
  - Vector
  - Array
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 3주차입니다.      
역시나 시간이 부족하여, 새벽 공부를 하고 있지만... 그래도 아는 게 늘어 좋습니다.   
(Ctrl+C, Ctrl+v)      

> **_다시 시작하는 인공지능 공부_**   

3주차는 Vector 개념을 정리했습니다.

Process
=====
```
배운 내용 : Vector (1d) / Matrix (2d) / Tensor (3d)
```
```python
import numpy as np

# 벡터는 숫자를 원소로 가지는 배열(array)
## 리스트(list)라고 하는 건, 잘못 : 리스트는 원소는 독립적

x = [1, 2, 4] # list
x2 = [2, 3, 4]
vec = np.array(x) # array 

vec # 벡터 원소는 원점으로 부터 상대적 위치의 한 점을 표현하기에, 리스트는 각 원소가 독립적 
vec.shape # 3차원 벡터 

# 특징 1 같은 모양은 덧셈 - 뺄셈 가능
vec1 = np.array(x) # array 
vec2 = np.array(x2) # array 

vec1 + vec2
vec1 - vec2

# 특징 2 같은 모양은 성분곱이 가능 - 사칙 연산의 곱셈
vec1 * vec2

# 벡터의 덧셈 : 두 벡터의 덧셈은 다른 벡터로부터 '상대적 위치 이동'을 표현
# 벡터의 뺄셈 : 두 벡터의 뺄셈은 두 벡터 간 변화량을 표현

# norm : 원점에서부터 거리
## L1 : 각 원소의 변화량의 절대값을 더한 것 - 거리는 절대값
## L2 : 피타고라스 정리를 이용한 유클리드 거리 계산 - 점과 점을 잇는 가장 짧은 거리

def l1_norm(x):
    x_norm = np.abs(x)
    x_norm = np.sum(x_norm)
    return x_norm


def l2_norm(x):
    x_norm = x*x
    x_norm = np.sum(x_norm)
    x_norm = np.sqrt(x_norm)
    return x_norm

l1_norm(vec1)
l2_norm(vec2)

# 두 벡터 사이의 거리 : 두 벡터 간의 변화량을 이용하여 계산
l1_norm(vec1-vec2*2)  
l2_norm(vec1-vec2*2)

# 두 벡터 사이의 각도 : 내적을 이용 - 값을 구하기 위해 코사인 성립을 위해 수직으로 내린 것
inner = vec1.dot(vec2) # 내적 구하기
inner2 = vec1@vec2
inner
inner2

inner.ndim #내적은 스칼라값 - 0차원 텐서 
inner2.ndim #내적은 스칼라값 - 0차원 텐서 


#2. 행렬
## 행렬은 벡터를 원소로 가지는 2차원의 배열 / 3차원 이상의 배열은 - 텐서
## 스칼라 0차원 배열 / 벡터 1차원 배열 / ...
## 하나의 행이 점 하나를 나타냄 / 행이 기본 단위 
### 행 ; 데이터 / 열 ; 변수 값이라 칭함 - i번째 데이터의 j번째 변수 값

met = vec1 * vec2.reshape(-1, 1)
met

# 1) 행렬의 연산
## 행렬이 같은 모양을 가지면 덧셈, 뺄셈, 성분곱, 스칼라곱 가능
## 행렬곱셈은 두 행렬의 행과 열을 곱해 내적을 성분으로 가지는 행렬을 계산

met @ met #행렬 곱셈 = 내적
met.dot(met) #행렬 곱셈 = 내적

## 주의 ; np.inner 
### 행벡터와 행벡터 간의 내적을 성분으로 가지는 행렬을 계산
np.inner(met, met)
### 따라서, @과 동일 결과를 얻고자 한다면, 전치행렬 필요
np.inner(met, met.T) # met @ met 와 동일 결과

# 2) 역행렬
## 정방행렬, 행렬식 _ det가 0이 아닌 경우, 역행렬 존재

mat2 = np.random.rand(3,3)
mat2
np.linalg.det(mat2)
np.linalg.inv(mat2) 

mat2@np.linalg.inv(mat2) #행렬곱셉 (내적)이 항등행렬
```

Output
=====
행 - 데이터 자체가 여러 차원의 변수로 이루어져 있고,   
이러한 데이터 마다의 특성을 잘 나타내는 것을 찾는게,   
회귀라고 배웠습니다. :)   

데이터의 차원과 배열의 차원(Rank)의 개념을 잘 잡고 가야겠습니다.