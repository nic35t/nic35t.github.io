---
title: "[Python] 태그를 비교하는 툴 만들기"
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

이제 `Tag Writer`도 `Tag Checker`도 만들어서 데이터를 쌓았는데,   
내가 읽었던 도서와 유사한 도서를 추천받기 위해서는 데이터를 비교해야하니   
배운 수준에서 유사한 도서 비교 추천을 위한 `무언가`를 만들어 보았습니다.  

> **_넷플릭스 같은 태그 기반 추천 시스템을 기획하는 것_**

도서가 가진 태그 값을 비교해서 유사도를 계산하는 방식으로 만들었는데   
정말 단순한 비교라서 :) 언젠가 실력을 키운다면, 제대로 만들어보고 싶습니다.   


Process
=====
```
목표 : 태그 비교하는 툴 만들기
```
```python
#Tag Recommend v0.2 Jeremy Lee
def compare(DB_cate,NR_cate) :
	count = 0
	total = 0
	for cate_keys in DB_cate.keys() :
		for meaning_keys in DB_cate[cate_keys].keys():
			total = total +1
			if DB_cate[cate_keys][meaning_keys] == NR_cate[cate_keys][meaning_keys] :
				count = count +1
			else :
				count = count
	average = count/total*100
	return (average)		

# 데이터 불러오기
import ast
Now_Reading=open(input('Now reading :')+'.txt')
for NR in Now_Reading:
	NR=NR.rstrip()
	NR=ast.literal_eval(NR)

with open(input("Enter the file : ")+'.txt') as DATABASE :
	for DB in DATABASE :
		DB = DB.rstrip()
		DB = ast.literal_eval(DB)

# 일치
		for Book_title in DB.keys():
			Book_categories = DB[Book_title]
			pct=compare(Book_categories,NR['Nowreading'])
			print("지금 읽은 책은 '"+Book_title+"'책과","{:4.2f}".format(pct),'% 유사합니다.')
```   


Output
=====
그래도 처음으로 데이터라는 걸 쌀아서 비교한다는 생각으로 해본 코딩이었습니다.   
글을 올리며 코드를 살펴보니, `ast` 안써도 됐었나 싶네요.
