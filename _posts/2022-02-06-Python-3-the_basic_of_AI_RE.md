---
title: "[AI 기초] Numpy"
excerpt: "5주 과정으로 조별과제 중입니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2022-02-06T19:28:00-05:00
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
역시나 시간이 부족하여, 새벽 공부를 하고 있지만... 그래도 아는 게 늘어 좋습니다.   
(Ctrl+C, Ctrl+v)      

> **_다시 시작하는 인공지능 공부_**   

3주차는 Numpy를 꽤나 배웠습니다.

Process
=====
```
배운 내용 : Numpy
```
```python
#1. 왜 Numpy 인가? 
## Numerical Python
## 리스트에 비해 효율적, for문 없이 Array로 처리 가능

import numpy as np #alias 별칭 사용

test_array = np.array(["1","3", 5, 6], float)

# 주의
## 파이썬의 특징 다이나믹 타이핑 - 실행 시점에 데이터 타입 결정
## 하지만, numpy array는 불허, 하나의 타입만 안에 넣을 수 있음

########################################################
# 파이썬은 메모리 주소를 공유하는 개념
# numpy는 파이썬 개념과 달리 값을 관리함
########################################################

print(test_array.dtype) #numpy 데이터 타입 반환
print(test_array.shape) #dimesion의 크기를 반환 - 크기의 구성

#2. shape / ndim / size
## 크기의 구성을 알고 싶을 때 - .shape
## 차원의 수를 알고 싶을 때 - .ndim
## 전체 백터 숫자를 알고 싶을 때 - .size

tensor2 = [[[[1,2], [2,3], [3,4], [4,5]],[[1,2], [2,3], [3,4], [4,5]]],[[[1,2], [2,3], [3,4], [4,5]],[[1,2], [2,3], [3,4], [4,5]]]]

np.array(tensor2, int).ndim #ndim = 4
np.array(tensor2, int).size #sie = 32
np.array(tensor2, int).shape #shape = (2,2,4,2)

# 참고
## [1, 2]는 (2,) / 벡터 구조
## [[1, 2, 3, 4], [1, 2, 3, 4]] 는 (2, 4) / 메트릭스 구조 
## [[[1, 2, 3, 4], [1, 2, 3, 4]],[[1, 2, 3, 4], [1, 2, 3, 4]]] 는 (2, 2, 4) / 텐서

### 3차원
tensor = [[[1, 2, 3, 4], [1, 2, 3, 4]],[[1, 2, 3, 4], [1, 2, 3, 4]]] #(2, 2, 4) - 3차원
np.array(tensor, int).ndim # ndim dimetion의 수 = 3

### 4차원 
tensor2 = [[[[1,2], [2,3], [3,4], [4,5]],[[1,2], [2,3], [3,4], [4,5]]],[[[1,2], [2,3], [3,4], [4,5]],[[1,2], [2,3], [3,4], [4,5]]]]

#3. .reshape(n, n, n, ...)
## Array의 Shape을 변경하는 경우 - .reshape()

### shape = (4, 4)를 reshape
test_met = [[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]]
np.array(test_met).shape #test_met의 모양
np.array(test_met).reshape(16,) #16,벡터로 재형성
np.array(test_met).reshape(4,2,2) #3차원 텐서로 재형성
np.array(test_met).reshape(2,2,2,2) #4차원 텐서로 재형성

## 칼럼 수에 맞춰 자동으로 행을 지정 : reshape(-1,칼럼 수)
test_met2 = np.array(test_met).reshape(16,) #(16,) 벡터로 재형성
np.array(test_met2).reshape(-1,1) #벡터를 16x1 메트릭스로 변환

#4. flatten
## 다차원을 1차원 벡터로 만드는 법 - flatten
## shape, size 알아볼 것 없이, 입력 자료를 바로 백터로 펼 때 사용
np.array(test_met).flatten() 


#5. 인덱싱 [n,n]/ 슬라이싱 [n:n,n:n]
#5.1 인덱싱은 리스트와 같지만, [0,0] 으로도 호출 가능
test_met3 = [[1, 1, 1, 1],[2, 2, 2, 2],[3 , 3, 3.5, 3],[4, 4, 4, 4]]
np_test = np.array(test_met3)
np_test.shape #test_met3의 모양
print(np_test[2,2])
#5.2 슬라이싱은 [row:row,col:col] 범위의 슬라이싱 가능 - pandas 개념 
np_test[2:,2:]


#6. arange 
## range와 비슷한, 범위를 지정한 array 만들기 
## reshape 사용하여 metrix / tensor로 전환 가능
test_arange = np.arange(100).reshape(-1,2,2,5)

##주의 - dtype은 array에서 리스트를 변환할 때 지정하는 것

##참고 - range는 간격을 소수점 지정 불가, arange는 소수점 간격 지정 가능
test_arange2 = np.arange(1,10,0.5)
##range에서 불가능한 소수점 간격의 리스트를 만들 때
test_arange2.tolist() 


#7. np.zeros 
## 0으로만 구성된 빈 어레이 만들기
np.zeros((10,)) # 10, 벡터 어레이
np.zeros((10,10)) # 10x10 메트릭스 어레이
test_zero = np.zeros((2,2,2,2,2)) # 5차원, 벡터 어레이
test_zero.ndim
test_zero.size
test_zero.shape

#8. np.ones 
## 1로만 구성된 빈 어레이 만들기
np.ones((10,)) # 10, 벡터 어레이
np.ones((10,10)) # 10, 벡터 어레이
test_ones = np.ones((2,2,2,2,2)) # 5차원, 벡터 어레이
test_ones.ndim
test_ones.size
test_ones.shape

#9. _like
## 대상 어레이와 같은 1,0 또는 empty 어레이 반환
np.zeros_like(test_ones) # test_ones와 같은 크기의 0으로 찬 array반환

#10. eye 
np.eye(3,5)

#11. axis는 ndim 차원수 만큼, shape 튜플 기준 방향을 0,1,2,...으로 지정 
test_arange.reshape(-1,10)
test_sum = test_arange.reshape(-1,10)
test_sum.ndim #2차원 메트릭스면 row방향 적용 axis = 0, colomn 방향 적용 axis =1
test_sum.shape

test_sum.sum() #axis 없으면, 전체 합산
test_sum.sum(axis=0)
test_sum.sum(axis=1) #axis = 0은 shape 크기 튜플의 0번째 값, axis = 1은 크기 튜플의 1번째 값)

#12. concatenate (alias concat) _ vstack / hstack
a = np.array([1,2,3,4]).reshape(2,2)
b = np.array([[5,6]])
np.concatenate((a,b),axis=1) # 안붙음
np.concatenate((a,b.T),axis=1) # 행열 전환해 붙임

#13. array 계산 
## shape가 같을 때의 계산
test_dot1 = np.arange(1,5).reshape(-1,2)
test_dot2 = np.arange(1,5).reshape(-1,2)

test_dot1 + test_dot2 
test_dot1 - test_dot2 
test_dot1 * test_dot2 
test_dot1 ** test_dot2 

#14. .dot
## 행렬의 곱
test_dot1.dot(test_dot2)

#15. broadcasting 
## 메트릭스와 스칼라/벡터의 계산에 메트릭스에 나눠줌 
a1 = test_dot1 * 5 # scalar인 5를 나눔 
b1 = test_dot1 * np.array([5,5]) #벡터 어레이를 나눔
c1 = np.array([1,2]).reshape(-1,1) * np.array([5,5]) #메트릭스와 벡터 모두 broadcasting됨
a1.shape #(2, 2)
b1.shape #(2, 2)
c1.shape #(2, 2)

#16. all/any/where 
## 비교에도 broadcasting이 발생
test_dot1
test_dot1.shape
np.all(test_dot1>3) #모두 만족
np.any(test_dot1>3) #하나라도 만족
np.where(test_dot1>1,3,2) #조건문 트루값, 폴스값으로 반환
np.where(test_dot1>1) #인덱스 반환, axis 0 / 1 / ...의 인텍스 어레이를 반환

#17. argmax, argmin 
## 최대/최소값의 인덱스 번호 / axis 기반 반환도 가능
arg = np.array([1,2,3,4])
arg.shape
arg.size
arg.ndim
np.argmax(arg) #최대값의 인덱스 반환
np.argmin(arg) #최대값의 인덱스 반환

#18. boolean index 
## []안 조건에 맞는 element만 추출하는 것
## boolean은 실제 값을, where은 해당 조건의 인덱스를 반환
test_dot1[test_dot1>2] #조건에 해당하는 값 반환 _ 인덱싱임

#19. fancy index
## integer 선언된 어레이로 인덱싱
f1 = np.array([1,2,3,4,5,6,7,8], int)
f2 = np.array([0,0,1,1,2,3,2,3],int)
f1[f2]
f1[f1[f2]]

## take - 동일 개념의 함수
f1.take(f2)
```

Output
=====
왠지 차원이라는 것이 마음에 들고, 추천 시스템을 개선하기 위해   
20차원을 만드는 wol과 관련된 기획을 정리했던 때가 생각납니다.