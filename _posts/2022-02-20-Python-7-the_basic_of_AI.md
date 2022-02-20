---
title: "[AI 기초] Linear Regression w.Pytorch"
excerpt: "5주차 모델 구현을 배우고 있습니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-20T19:28:00-05:00
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

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 5주차입니다.    
스스로 자료 찾아 공부했던, 선형 회귀를 더 간단히 PyTorch로 구현하는 방법입니다.

> **_다시 시작하는 인공지능 공부_**    

최대한 지난번의 깨달음, 그리고 작성 방식을 활용했습니다.     


Process
=====
```
배운 내용 : 선형 회귀 torch로 세우기
```
```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

torch.manual_seed(1)
```

    <torch._C.Generator at 0x7fa65c03e950>

#### 1. 데이터 설정하기 _ Train / Test
```python
x_train = torch.FloatTensor([[1], [2], [3]])
y_train = torch.FloatTensor([[2], [4], [6]])
```
    
#### 2. 모델 초기화 _ Weight / bias
```python
W = torch.zeros(1, requires_grad = True)
b = torch.zeros(1, requires_grad = True)
```
    (tensor([0.], requires_grad=True), tensor([0.], requires_grad=True))
    
#### 3. 예측 모델 
```python
pred = W * x_train + b
```
    
#### 4. 비용 함수
```python
error = torch.mean((pred - y_train) ** 2) # 제곱의 평균
```
    tensor(18.6667, grad_fn=<MeanBackward1>)

#### 5. 경사 하강 - optimizer
```python
# numpy로 구현 시, 편미분을 사용함
optimizer = optim.SGD([W, b], lr=0.01)

# optimizer와 세트
optimizer.zero_grad() #Gradient 초기화
error.backward() #Grdient 계산
optimizer.step() #개선
```
    
#### 6. Full Code
```python
# 1. 데이터
x_train = torch.FloatTensor([[1], [2], [3]])
y_train = torch.FloatTensor([[2], [4], [6]])

# 2. W, b 설정
W = torch.zeros(1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)

# 5. 경사 하강 - optimizer 설정 - 학습률 설정
optimizer = optim.SGD([W, b], lr=0.01)

nb_epochs = 3000 # 반복 횟수 설정 - 학습이 완료된 사이클 수
for epoch in range(nb_epochs + 1): # 반복 범위 3000은 2999에서 끝나므로, 1 더함
    
    # 3. 예측 모델 만들기
    pred = W * x_train + b
    
    # 4. 비용 함수 세우기
    error = torch.mean((pred - y_train) ** 2)

    # 5. 경사 하강 - cost로 H(x) 개선 - W, b 변화 단계
    optimizer.zero_grad()
    error.backward()
    optimizer.step()

    # 200번마다 로그 출력
    if epoch % 200 == 0: 
        print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(
            epoch, nb_epochs, W.item(), b.item(), error.item()
        ))
```
    Epoch    0/3000 W: 0.187, b: 0.080 Cost: 18.666666
    Epoch  200/3000 W: 1.800, b: 0.454 Cost: 0.029767
    ...
    Epoch 2800/3000 W: 2.000, b: 0.001 Cost: 0.000000
    Epoch 3000/3000 W: 2.000, b: 0.001 Cost: 0.000000


Output
=====
지난번 선형회귀와 같은 내용이지만, PyTorch로 다르게 표현하는 부분,    
전체 흐름을 같으니, 함수를 잘 익혀서 간단히 만들어봐야겠습니다. 