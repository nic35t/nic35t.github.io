---
title: "Python 클래스 상속에서 super() 함수 활용 방법"
excerpt: "Python에서 클래스 상속을 구현할 때 super() 함수를 사용하는 방법에 대해 알아봅니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2023-04-04T20:28:00-05:00
categories:
  - AI 기초 by 부스트코스
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---

# Python 클래스 상속에서 `super()` 함수 활용 방법
   

파이썬에서 클래스 상속을 구현할 때 `super()` 함수를 사용하면    
기존 클래스에서 상속받은 메소드와 속성을 유지하면서 새로운 메소드나 속성을 추가하거나 수정할 수 있습니다.    
이를 통해 코드의 재사용성을 높이고, 다중 상속을 사용할 때 발생할 수 있는 메소드 충돌 문제를 방지할 수 있습니다.   

아래는 `super()` 함수를 활용한 클래스 상속의 간단한 예시입니다.    
    
    

```python
class Parent:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print("Hello, my name is", self.name)

class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)
        self.age = age

    def speak(self):
        super().speak()
        print("and I am", self.age, "years old.")
```

위의 코드에서 Child 클래스는 Parent 클래스를 상속받습니다. Child 클래스의 생성자에서   
super().__init__(name)을 호출하여 Parent 클래스의 생성자를 호출합니다.    
이를 통해 Parent 클래스에서 구현한 name 속성을 초기화하고, Child 클래스에서 추가한 age 속성을 초기화합니다.   
   
또한 Child 클래스에서 speak 메소드에서는 super().speak()을 호출하여 Parent 클래스의 speak 메소드를 호출합니다.    
이를 통해 Parent 클래스에서 구현한 기능을 Child 클래스에서 유지하면서, Child 클래스에서 추가한 새로운 기능을 구현할 수 있습니다.   
   
super() 함수를 활용하여 기존 코드를 유지하면서 새로운 기능을 추가하는 것은 매우 유용합니다.    
이를 통해 코드의 재사용성을 높이고, 다중 상속을 사용할 때 발생할 수 있는 메소드 충돌 문제를 방지할 수 있습니다.
