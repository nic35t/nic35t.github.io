---
title: "[Python] 검색API 활용해서 문장 바로 뒤에 오는 단어 모으기"
last_modified_at: 2021-02-28T19:28:00-05:00
categories:
  - 답답해서 해본 Python
tags:
  - Python
---

Input
=====

학습 서비스를 기획하면서 영어 표현 패턴에 필요한 단어를 정리해야 했습니다.   
메타를 만드는 일을 하게 된거죠. 처음에는 `NLP`를 이용해서 해준다고 했는데,   
개발자 분이 **그건 못하겠다**고 하셔서 울며 겨자먹기로 **구글링해서 정리할까**하다   
생각보다 시간을 오래 잡아먹는 일이어서, 일을 대신할 프로그램을 만들어 보기로 했습니다.   

> **_나 대신 번거로운 일을 할 프로그램 만들기_**   

`API`도 어떻게 쓰는지 찾아보면서 또 지식의 맵을 밝혔습니다.:smile:     
`DOS`의 모습이 아닌 그래도 `GUI`해보고 싶어서 `Tkinter`를 적극적으로 이용했습니다.   

또, `Tag` 작업물 이후에 그래도 `데이터 분석`해보겠다고   
`Pandas`를 배워서 기본 자료형이 아닌 `DataFrame`도 써봤습니다.   
(`Pandas`를 쓰니 엑셀로 저장도 할 수 있어서 좋더군요 :smile:)   

Process
=====
```
목표 : 검색API 활용해서 입력된 문장 뒤에 오는 단어 수집하기
```
```python
import tkinter as tk
from tkinter import font
import pandas as pd
import urllib3
import json

def Click():
    query_origin = txt.get()
    url = "https://dapi.kakao.com/v2/search/web"
    df_final = pd.DataFrame(index=range(0), columns=['contents'])
    for i in range(숫자):
        query = "?sort=accuracy&page=" + str(i + 1) + "&size=숫자&query=" + query_origin
        header = {'Authorization': 'KakaoAK 개인 키 값'}
        http = urllib3.PoolManager()
        response = http.request(method="GET", url=url + query, headers=header)
        result_json = json.loads(str(response.data, "utf-8"))
        df_add = pd.DataFrame(result_json['documents'])
        df_final = pd.concat([df_final, df_add], ignore_index='True')

    df_keyword = df_final['contents'].str.replace("</b>", "").str.replace('<b>', "").str.replace('.', "").str.lower()
    df_keyword = df_keyword.str.extract(query_origin.lower() + '\s([A-Za-z]*?)\s').dropna(axis=0)
    lbl8.configure(text="C:\Python\[save]" + str(query_origin) + ".xlsx", font=font_py2, fg='green')
    df_keyword.to_excel("C:\Python\[save]" + str(query_origin) + ".xlsx")


root = tk.Tk()
root.title("search_to_xls_v0.1")
root.geometry('300x200')
font_py = tk.font.Font(family='여기어때 잘난체 OTF', size=15)
font_py2 = tk.font.Font(family='여기어때 잘난체 OTF', size=10)

file_lbl = tk.Label(root, text='> 검색어 <', font=font_py)
txt = tk.Entry(root, font=font_py, fg='gray')
btn = tk.Button(root, text="검색", command=Click, font=font_py)
lbl7 = tk.Label(root, text="저장 경로", font=font_py)
lbl8 = tk.Label(root, text="----------------------", font=font_py, fg='red')

file_lbl.place(x=90, y=10)
txt.place(x=30, y=40, width=250, height=30)
btn.place(x=30, y=80, width=250, height=30)
lbl7.place(x=90, y=120, width=120)
lbl8.place(x=30, y=150)

root.mainloop()
```   


Output
=====
업무에 있어 스스로 도움되는 프로그램을 만들었다는 점에서 만족스러웠습니다.   
아는 것이 늘어날 수록 조금은 덜 복잡한 무언가를 만들 수 있다는 생각이 들었습니다.   
언젠가 **이 코드도 더 간략할 수 있지 않았을까?**라는 보는 눈이 생기길 바라며...
