---
title: "[Python] 두 문장의 일치도를 계산하는 툴 만들기"
excerpt: "하기 어렵다고 하길래 직접 만들어 봤습니다.."
last_modified_at: 2021-03-03T23:28:00-05:00
categories:
  - 답답해서 해본 Python
tags:
  - Python
  - PJT
---

Input
=====

**'선무당이 사람을 잡는다고 하나요'**    
프로젝트를 진행하는데 문장 일치도를 계산하는 알고리즘이 필요했습니다.  
그래도 몇일 강의를 들었다고 **'이렇게 하면 될 것 같은데'**하며   
단순한 것이지만 예전과 달리 코딩 아이디어가 떠오르는 순간이 있었습니다.  

> **_목표 문장과 입력 문장의 일치도를 계산한다.  
단, 어순 틀린 건 제외한다._**

비교가 필요한 문장을 나눠 `리스트`를 만들고, 그 `리스트`의 `인덱스`를 활용한다.  
그리고 어렴풋이 배웠던 `list comprehension`도 적용해보고 싶었습니다.  

Process
=====
```
목표 : 두 문장의 일치도를 계산하는 툴 만들기
```
```python
import tkinter as tk
from tkinter import font

root = tk.Tk()
root.title('문장 일치도 계산기 v0.1')

font_py = tk.font.Font(family='Arial',size=3)

# 비교 계산 알고리즘
def Click():
    model_origin = txt1.get()
    speech_origin = txt2.get()
    model = model_origin.split()
    speech = speech_origin.split()
    compare = [speech.index(word) for word in model if word in speech]
    lbl4.configure(text=model_origin)
    lbl6.configure(text=speech_origin)
    if compare == sorted(compare) :
        result = str(len(compare)/len(model)*100)+'%'
    else :
        result = 'Try again'
    lbl8.configure(text=result, fg='red')

# 인터페이스 설정
lbl1 = tk.Label(root, text ='모델 문장은?',font=font_py)
lbl1.place(x=10,y=30,width=200)
txt1 = tk.Entry(root,width='20',font=font_py)
txt1.place(x=200,y=30,width=200)
lbl2 = tk.Label(root, text ='아이 문장은?',font=font_py)
lbl2.place(x=10,y=60,width=200)
txt2 = tk.Entry(root,width='20',font=font_py)
txt2.place(x=200,y=60,width=200)
btn = tk.Button(root, text = '입력',command =Click, width=20,font=font_py,fg='orange',bg='white')
btn.place(x=55,y=90,width=345,height=50)

lbl3 = tk.Label(root, text ='모델 문장',font=font_py)
lbl4 = tk.Label(root, text ='_________',font=font_py)
lbl5 = tk.Label(root, text ='아이 문장',font=font_py)
lbl6 = tk.Label(root, text ='_________',font=font_py)
lbl9 = tk.Label(root, text ='◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆',font=font_py)
lbl7 = tk.Label(root, text ='결과',font=font_py)
lbl8 = tk.Label(root, text ='_________',font=font_py)
lbl9.place(x=55,y=150,width=345)
lbl3.place(x=10,y=180,width=200)
lbl4.place(x=200,y=180,width=200)
lbl5.place(x=10,y=210,width=200)
lbl6.place(x=200,y=210,width=200)
lbl7.place(x=10,y=240,width=200)
lbl8.place(x=200,y=240,width=200)
lbl10 = tk.Label(root, text ='◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆',font=font_py)
lbl10.place(x=55,y=270,width=345)

root.mainloop()
```   

Output
=====
목표 문장과 입력 문장을 비교해서 결과를 잘 줍니다. 어순이 틀리면 재시도도 나오고 :)  
사실 입력 문장에 동일한 단어가 두 개 이상 있는 케이스는 배제하고 돌아가는 거라  
기획자로서 업무에 쓰일 일은 없기에 나중에 기회가 생긴다면 더 만들어 보고 싶습니다.