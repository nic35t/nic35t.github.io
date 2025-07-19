---
title: "[Python] 태그를 양산하는 툴 만들기"
excerpt: "효율적으로 일을 하려고 만들었습니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2021-02-28T19:28:00-05:00
categories: [Projects]
tags:
  - Python
  - PJT
toc: true
toc_sticky: true
---

Input
=====

처음 `Tag Writer`를 만들었는데, 그 목적은 처음 기준을 잡을 때 용도여서   
만들어진 기준으로 양산을 위한 `Tag Checker`를 만들고 싶었습니다.

> **_넷플릭스 같은 태그 기반 추천 시스템을 기획하는 것_**

목표가 거대해서 이게 무슨 의미일까 싶었지만 게임에서 지역을 탐험하며 맵을 밝히듯   
비전공자로서 영역을 넓힌다는 생각으로 탐구하며 만들어 보았습니다.


Process
=====
```
목표 : 태그 양산하는 툴 만들기
```
```python
#Tag Checker v0.2 Jeremy Lee
def checker(check) :
	check = DB[check]
	for check_keys in check.keys():
		check_keys = check_keys.rstrip()
		print("[카테고리] :",check_keys,"\n")
		for meaning_keys in check[check_keys].keys():
			meaning_keys = meaning_keys.rstrip()
			print(meaning_keys+"의 값을 입력하세요.")
			tag_values = input ("+/- : ")
			tag_categories_dic[str(meaning_keys)] = tag_values
			print("입력되었습니다","\n")
		Book_Title_dic[str(check_keys)] = tag_categories_dic
		print(Book_Title_dic)
	Book_Title_db[Book_Title]=Book_Title_dic
	print(Book_Title_db)

Book_Title = input ("도서명 : ")
Book_Title_db = dict()
Book_Title_dic = dict()
tag_categories_dic = dict()

#태깅 기준
DB={'Nowreading':{'주인공': {'남자': '+', '연소': '+', '영웅': '+', '실존인물': '-'}, '장르': {'우화': '-', '창작': '-', '신화': '-', '전설': '+', '개작': '+'}, '시대배경': {'고려': '-', '조선': '+', '근대': '-', '현대': '-'}, '공간배경': {'실내': '+', '건물': '+', '한옥': '+'}, '분위기': {'모험': '+', '명랑': '-', '과학': '-', '역사': '-', '순정': '-', '서정': '-', '가정': '-'}, '대상연령': {'1세': '-', '2세': '-', '3세': '-', '4세': '-', '5세': '-', '6세': '+', '7세': '+', '8세': '+', '9세': '+'}, '제작국가': {'한국': '+', '중국': '-', '미국': '-', '영국': '-', '스페인': '-'}}}
#예시 데이터

for check in DB.keys():
	checker(check)

print (Book_Title_db)

save_file = input("저장할 파일명을 입력하세요 :")
with open(str(save_file)+".txt",'w') as file :
    file.write(str(Book_Title_db))
```   


Output
=====
이것도 앞선 첫 작처럼 다른 연구 업무를 하게 되어 기획 자체가 의미없어졌지만,   
그래도 나름 `def`를 처음 활용해서 만들어 봤습니다. :)
