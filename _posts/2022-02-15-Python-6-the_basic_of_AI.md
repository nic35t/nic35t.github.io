---
title: "[AI 기초] Pandas"
excerpt: "4주차 Pandas 활용법을 배웠습니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-14T19:28:00-05:00
categories: [AI]
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

Input
====

네이버 커넥트재단 **부스트코스**에서 제공하는 **AI 기초 다지기 과정**에 4주차입니다.      
거꾸로 된거 같지만 올해 초 데이터 분석 강의를 들으며, 기초없이 따라해보기를 한 뒤,        
이제서야 Pandas 기초를 비웠습니다. 뭣 모르고 배웠다가 의미와 용도를 알게 되니,        
그때 왜 그 함수를 썼는지 이해가 되었습니다. 사파였다가 정도로 온 느낌입니다.   

> **_다시 시작하는 인공지능 공부_**    

어떻게 쓰이는지 알고 기초를 들으니 더 실무 예제와 연결되어 배운 느낌이 듭니다.      

Process
=====
```
배운 내용 : Pandas 기초 정리하기
```
```python
import pandas as pd # pd alias
import numpy as np

## url / 경로 등 호출
data_url = "비밀"
## 공백으로 csv 데이터 가지고 오기, 칼럼명 따로 지정 안함
df = pd.read_csv(data_url, sep = '\s+', header = None) 

## 처음 다섯줄 출력
df.head()
## array 모양
df.shape

# 2.칼럼명 다루기
## 칼럼 명이 없으면, 칼럼 번호로 다룰 수 있음, 단, property는 불가
df.columns
df[0]

# 칼럼명 지정하기
df.columns = ['a', 'b','c', 'd', 'e', 'f', 'g', 'h', 'i', 'j','k', 'l', 'm', 'n']

# 칼럼명이 존재해 property 가능
df.columns # property 불러오기
df["a"] 
df.a # 칼럼명 중 하나 property

# 3.범위 다루기
# df location - 이름을 가지고 접근
# df iloc - 인덱스 넘버로 접근
j = pd.Series(np.random.randn(9), index = [49,48,47,1,2,3,4,5,6])
j.loc[:3] #인덱스 이름 3까지 포함한 슬라이싱
j.iloc[:3] #3번째 인덱스 넘버 기준 슬라이싱

# 4. broadcasting / transpose
## 비교에 대한 broadcasting
t = pd.DataFrame(np.random.randn(4,4), columns = ["name", "age", "born", "etc"])
t = pd.DataFrame(t, columns = ["name", "age", "born", "etc", "comparison"])
t.columns # 칼럼은 리스트로 보여줌
t.comparison = t.born > 0
t.values # 인덱스, 칼럼명 빼고 값만 불러오기
t.to_csv() #내장 함수

# 전치 - 행렬 / Matrix에 하던 것
t.T

# 5. 삭제 - Del
del t["comparison"]
t

# 6. Selection 
t.etc.head(2)
t[["name", "etc"]].head(2) #여러 칼럼을 가져올 때, 리스트로 만들어 줄 것

## 강의자 왈, df[:3] 형태가 로우를 호출하는 것이 헷갈린다고 하는데, 
## df.head(3)과 같은 개념이라고 보면 됨 - [:3] 행 3줄 가져옴

t.etc[:3] #etc 칼럼에서 인덱스 넘버 3 직전까지 가져오기 
t[:2] # 전체에서 인덱스 넘버 2 직전까지 가져오기
t.head(2) # 전체에서 상위 2행 가져오기

### 나름의 결론은, DF가 Series가 단위이니, DF["칼럼명"].슬라이싱 이 아닌 이상
### 기본적으로 row가 기본, .칼럼명이 사이에 껴들면서 범위를 제한하는 문법임
### 칼럼명 호출 / 칼럼 관련 함수 제외, DF.XX.YY 구조나 DF.YY 구조는 마지막 YY가 row 관련임

# 1) property 칼럼 호출 후, 슬라이싱
t.etc[[1,2]]

# 2) 특정 변수 지시 후, 슬라이싱
t_etc = t.etc
t_etc[[1,2]]

## 두 결과는 같음 = 단, 특정 칼럼을 호출, 즉, series인 경우만, row를 리스트 인덱싱할 수 있음

# 7. 특정 칼럼을 인덱스로 만들기
t.index = t.name # 인덱스 지정하기
del t["name"] # 중복되니 삭제하기
t

# 8. drop 
t.index = list(range(0,4))
t.drop(2) # 인덱스 넘버를 이름으로 바꾼 경우는, 적용되지 않음
## 실제 df는 말짱함, inplace를 적용하면, 변화가 적요오딤

# 9. map / lambda
## Series type에 map 함수 사용 가능

s = pd.Series(np.arange(10))
s.map(lambda x : x**2).head(5) #s에 함수 바로 맵핑하여 적용
s.map({1 : "a", 2 : "b"}) #칼럼 접근하여 변화주는 것보다 빠른 방법
s.map(s)

t["extra"] = t.born.map({"0.984367": 0, "-0.009610" : 1})

# 10. apply 
## 칼럼 기준으로 - series 전체에 특정 내용 적용

# 11. applymap
## 전체 DF에 각 series에 적용

# 12. 기타 function
## Matrix를 DF로 만들었습니다.
data_1 = [["cherry", "Fruit", 100], ["mango", "Fruit", 110], ["potato", "Vegetable", 60], ["onion", "Vegetable", 80]]
data_2 = [["pepper", "Vegetable", 50], ["carrot", "Vegetable", 70], ["banana", "Fruit", 90], ["kiwi", "Fruit", 120]]

df1 = pd.DataFrame(data = data_1, columns = ["Name", "Type", "Price"])
df2 = pd.DataFrame(data = data_2, columns = ["Name", "Type", "Price"]) 

df3 = pd.concat([df1, df2], axis = 0)

df3.Type.unique() #유니크 뽑기
li = list(enumerate(df3.Type.unique())) #유니크에 번호 붙이기
dic = dict([(v, k) for (k, v) in li]) # 키/값 순서 바꾸기 - dict로 바꾸기
dic
df3.Type.map(dic) #데이터프레임 Type 칼럼에 mapping 적용
```

Output
=====
뭔가 예전 데이터 분석 실전편을 먼저 들었던 것이 기억나며     
이 코드가 이런 의미구나 이해가 더 됩니다.     
이 순서로 배운 것도 나쁘지 않은 것 같습니다.    