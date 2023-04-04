---
title: "[Python] 데코레이터: 함수 기능 확장하는 고급 기술 [Not a Know-IT-All]"
excerpt: "파이썬 데코레이터는 함수의 기능을 확장하면서 코드 수정을 최소화하는 고급 기술입니다. 이 글에서는 데코레이터의 기본 개념과 사용법을 소개합니다. 예제 코드와 함께 쉽게 따라해보세요."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2023-04-04T20:28:00-05:00
categories:
  - Python 보강
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

# 데코레이터란?

데코레이터는 파이썬에서 함수나 클래스를 꾸며주는 장식 같은 역할을 합니다.    
데코레이터를 사용하면 코드를 간결하게 만들어주고, 코드 재사용성을 높여줍니다.
        
    
# 데코레이터 예시

아래는 데코레이터를 사용한 예시입니다.    
   
```python
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
```   
   
위 코드는 my_decorator 함수가 say_hello 함수를 감싸서 실행하도록 만든 데코레이터입니다.    
@my_decorator 라는 데코레이터 표현을 사용해 say_hello 함수 위에 데코레이터를 적용했습니다.   
   
실행 결과는 다음과 같습니다.   

```python
Something is happening before the function is called.
Hello!
Something is happening after the function is called.
```   

# 데코레이터 유용성   

데코레이터는 다음과 같은 상황에서 유용합니다.   

- 코드 재사용성 높임   
- 간결하고 깔끔한 코드 작성 가능   
- 함수나 클래스를 수정하지 않고도 기능 확장 가능   
- 함수나 클래스의 메타데이터를 추가할 수 있음   
   

데코레이터는 파이썬에서 매우 유용한 기능 중 하나입니다.    
함수나 클래스를 수정하지 않고도 기능을 확장하거나 메타데이터를 추가할 수 있어   
코드의 재사용성을 높이는 데 도움을 줍니다.   
