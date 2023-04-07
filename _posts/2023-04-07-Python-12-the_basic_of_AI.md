---
title: "[Python] Pillow를 이용한 이미지 처리"
excerpt: "파이썬으로 다양한 작업을 쉽게 처리할 수 있도록 도와주는 라이브러리를 추천합니다."
header:
  teaser: /assets/images/noteaser.jpg
last_modified_at: 2023-04-07T12:00:00-05:00
categories:
  - Python 보강
tags:
  - Python
  - TIL
toc: true
toc_sticky: true
---
 
# Pillow

이미지 처리를 위한 라이브러리인 Pillow는    
파이썬으로 이미지 처리를 쉽게 할 수 있도록 도와줍니다.   
    
Pillow를 이용하면 이미지 크기 조정, 필터 적용,    
포맷 변환 등 다양한 작업을 간단한 코드로 수행할 수 있습니다.   
 
아래는 Pillow를 이용한 간단한 이미지 처리 예제입니다.   
    
```python
from PIL import Image, ImageFilter

# 이미지 열기
img = Image.open('image.jpg')

# 이미지 크기 조정
img_resized = img.resize((300, 300))

# 이미지 필터 적용
img_filtered = img.filter(ImageFilter.BLUR)

# 이미지 저장
img_resized.save('image_resized.jpg')
img_filtered.save('image_filtered.jpg')
```

Pillow는 이미지를 다루는 작업에서 매우 유용합니다. 이미지 크기 조정, 필터 적용,      
포맷 변환 등 다양한 작업을 간단한 코드로 수행할 수 있습니다.   
      
Pillow를 사용하면 이미지 처리 작업을 보다 쉽게 할 수 있습니다.    