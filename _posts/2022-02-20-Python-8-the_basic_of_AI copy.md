---
title: "[AI 기초] Multivariable Linear Regression w.Pytorch"
excerpt: "5주차 다항 선형 회귀 구현을 배우고 있습니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-20T20:28:00-05:00
categories:
  - AI 기초 by 부스트코스
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

Input
======

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 5주차입니다.    
직전 포스팅 후 다항 회귀를 배웠고, 이를 간결히 정리한 최최최종판 정리입니다.    

> **_다시 시작하는 인공지능 공부_**    

나눠서 배우다보니 수정에 수정에 수정을 거듭해 아래 다항 선형 회귀 모델이 나왔습니다.    
데이터 셋은 적어도 수십만 개의 데이터가 기본이라고 하니    
미니배치를 통해 원활히 학습시키는 방법입니다.                


Process
======
```
배운 내용 : 다항 선형 회귀 w. nn.Module / DataLoader (minibatch)
```
```python
import torch # 토치 기본 호출
import torch.nn as nn # nn.Module 이용 목적 : 모델 초기화 간단히
import torch.nn.functional as F # Cost 작성 간단히
import torch.optim as optim #optimizer 설정용
from torch.utils.data import Dataset #데이터로더 사용을 위한 데이터 셋 설정
from torch.utils.data import DataLoader # 데이터 로더
```

#### 1. Class - Dataset / nn.Module 
```python
# 데이터로더에 쓰일 데이터셋 준비
class CustomDataset(Dataset): 
    def __init__(self, x_train, y_train):
        self.x_data = x_train
        self.y_data = y_train
        
    def __len__(self): #데이터셋의 총 데이터 수
        return len(self.x_data)
    
    def __getitem__(self, idx): # 임의 인덱스 idx 호출 시, 상응 입출력 데이터 반환
        x = torch.FloatTensor(self.x_data[idx])
        y = torch.FloatTensor(self.y_data[idx])
        return x,y

class MultivariableLinearRegressionModel(nn.Module): # 입출력 데이터 사이즈에 맞는 가중치와 편향
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(3, 1) # 입출력 데이터의 사이즈 정의

    def forward(self, x):
        return self.linear(x)

dataloader = DataLoader(dataset, batch_size= 2, shuffle = True)
```

#### 2. Full Code
```python
# 데이터 - 예시 데이터 : 일반적으로 어디서 가져올 것이고, Pandas 전처리 필요
x_data = torch.FloatTensor([[60, 70, 80],[70, 80, 90], [80, 90, 100]]) # 입력 데이터 
y_data = torch.FloatTensor([[440], [500], [560]]) # 출력 데이터

# 데이터 미니배치
dataset = CustomDataset(x_data, y_data) #데이터셋 클래스 활용
dataloader = DataLoader(dataset, batch_size= 2, shuffle = True)

# 모델 초기화
model = MultivariableLinearRegressionModel()

# optimazer 설정 - 타겟, 변화율
optimizer = optim.SGD(model.parameters(), lr=1e-5)

nb_epochs = 10000
for epoch in range(nb_epochs+1):
    for batch_idx, samples in enumerate(dataloader): # 미니배치
        x_train, y_train = samples # 데이터 할당
        pred = model(x_train)
        error = F.mse_loss(pred, y_train)
        optimizer.zero_grad()
        error.backward()
        optimizer.step()
        
        if epoch % 1000 ==0:
            print(f"Epoch : {epoch:>5}/{nb_epochs}, Cost : {error.item()}")
            print(f"Hypothesis : {pred.squeeze()}")
```
    
Output
======
처음부터 바로 이 내용을 봤다면, 이게 뭔소린가 정도의 내용이었습니다.    
기본 모델을 라이브러리로 단순화시키다보면, 단순하지만 보기에는 이해가 필요한,    
그래서 차근차근 배운 이번 코스가 참 좋았습니다 :)