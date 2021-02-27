---
title: "1) drop, iloc[].reset_index()-불필요한 행 날리고, 추출해서 새로운 프레임 만들기"
last_modified_at: 2021-02-27T19:28:00-05:00
categories:
  - 내가 쓰려고 정리하는 PANDAS
tags:
  - Python
  - PANDAS
  - Data Analysis
---

# Pandas 사용법 _ 서비스 데이터 분석


```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
```


```python
df_test = pd.read_csv("C:/Users/leesa/Desktop/소상공인시장진흥공단_상가(상권)정보 업종코드_20200512.csv",encoding='euc-kr')
```


```python
df_test
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
      <th>소분류명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A01</td>
      <td>삼계탕전문</td>
    </tr>
    <tr>
      <th>1</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A02</td>
      <td>닭갈비전문</td>
    </tr>
    <tr>
      <th>2</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A16</td>
      <td>보리밥전문</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A09</td>
      <td>오리고기전문</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A07</td>
      <td>토종닭전문</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>832</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A07</td>
      <td>주택전시장</td>
    </tr>
    <tr>
      <th>833</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A02</td>
      <td>건축물시설관리</td>
    </tr>
    <tr>
      <th>834</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A03</td>
      <td>재건축조합</td>
    </tr>
    <tr>
      <th>835</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A01</td>
      <td>오피스텔관리</td>
    </tr>
    <tr>
      <th>836</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L02</td>
      <td>부동산임대</td>
      <td>L02A03</td>
      <td>임대-쇼핑센타/상점</td>
    </tr>
  </tbody>
</table>
<p>837 rows × 7 columns</p>
</div>



## Case #1 데이터를 읽어, 표현하는 방법


```python
df_test.columns
```




    Index(['상권분석(8대업종)', '대분류코드', '대분류명', '중분류코드', '중분류명', '소분류코드', '소분류명'], dtype='object')




```python
df_test.index
```




    RangeIndex(start=0, stop=837, step=1)



### `1) count()는 그룹에 묶인 수를 세는 것`


```python
df_test.groupby(["대분류코드"]).count()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
      <th>소분류명</th>
    </tr>
    <tr>
      <th>대분류코드</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>D</th>
      <td>256</td>
      <td>256</td>
      <td>256</td>
      <td>256</td>
      <td>256</td>
      <td>256</td>
    </tr>
    <tr>
      <th>F</th>
      <td>161</td>
      <td>161</td>
      <td>161</td>
      <td>161</td>
      <td>161</td>
      <td>161</td>
    </tr>
    <tr>
      <th>L</th>
      <td>18</td>
      <td>18</td>
      <td>18</td>
      <td>18</td>
      <td>18</td>
      <td>18</td>
    </tr>
    <tr>
      <th>N</th>
      <td>64</td>
      <td>64</td>
      <td>64</td>
      <td>64</td>
      <td>64</td>
      <td>64</td>
    </tr>
    <tr>
      <th>O</th>
      <td>5</td>
      <td>5</td>
      <td>5</td>
      <td>5</td>
      <td>5</td>
      <td>5</td>
    </tr>
    <tr>
      <th>P</th>
      <td>48</td>
      <td>48</td>
      <td>48</td>
      <td>48</td>
      <td>48</td>
      <td>48</td>
    </tr>
    <tr>
      <th>Q</th>
      <td>117</td>
      <td>117</td>
      <td>117</td>
      <td>117</td>
      <td>117</td>
      <td>117</td>
    </tr>
    <tr>
      <th>R</th>
      <td>168</td>
      <td>168</td>
      <td>168</td>
      <td>168</td>
      <td>168</td>
      <td>168</td>
    </tr>
  </tbody>
</table>
</div>



### 2) `중분류 칼럼을 특정하면, 그 칼럼을 중심으로 coount하지만 큰 차이는 없음 _ 단, 시리즈로 표현됨`


```python
df_test.groupby(["대분류코드"])["중분류코드"].count()
```




    대분류코드
    D    256
    F    161
    L     18
    N     64
    O      5
    P     48
    Q    117
    R    168
    Name: 중분류코드, dtype: int64



### 3) `행을 삭제하는 방법`


```python
df_test.drop([1,2],inplace=True)
df_test
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
      <th>소분류명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A01</td>
      <td>삼계탕전문</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A09</td>
      <td>오리고기전문</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A07</td>
      <td>토종닭전문</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A10</td>
      <td>닭내장/닭발요리</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
      <td>돌솥/비빕밥전문점</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>832</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A07</td>
      <td>주택전시장</td>
    </tr>
    <tr>
      <th>833</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A02</td>
      <td>건축물시설관리</td>
    </tr>
    <tr>
      <th>834</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A03</td>
      <td>재건축조합</td>
    </tr>
    <tr>
      <th>835</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A01</td>
      <td>오피스텔관리</td>
    </tr>
    <tr>
      <th>836</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L02</td>
      <td>부동산임대</td>
      <td>L02A03</td>
      <td>임대-쇼핑센타/상점</td>
    </tr>
  </tbody>
</table>
<p>835 rows × 7 columns</p>
</div>




```python
df_test.drop(range(3,5),inplace=True)
df_test
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
      <th>소분류명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A01</td>
      <td>삼계탕전문</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A10</td>
      <td>닭내장/닭발요리</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
      <td>돌솥/비빕밥전문점</td>
    </tr>
    <tr>
      <th>7</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
      <td>버섯전문점</td>
    </tr>
    <tr>
      <th>8</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
      <td>쌈밥전문</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>832</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A07</td>
      <td>주택전시장</td>
    </tr>
    <tr>
      <th>833</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A02</td>
      <td>건축물시설관리</td>
    </tr>
    <tr>
      <th>834</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A03</td>
      <td>재건축조합</td>
    </tr>
    <tr>
      <th>835</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A01</td>
      <td>오피스텔관리</td>
    </tr>
    <tr>
      <th>836</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L02</td>
      <td>부동산임대</td>
      <td>L02A03</td>
      <td>임대-쇼핑센타/상점</td>
    </tr>
  </tbody>
</table>
<p>833 rows × 7 columns</p>
</div>



### 4) 열을 삭제하는 방법


```python
df_test.drop(["소분류명"],axis =1,inplace=True)
df_test
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A01</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A10</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
    </tr>
    <tr>
      <th>7</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>8</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>832</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A07</td>
    </tr>
    <tr>
      <th>833</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A02</td>
    </tr>
    <tr>
      <th>834</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A03</td>
    </tr>
    <tr>
      <th>835</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A01</td>
    </tr>
    <tr>
      <th>836</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L02</td>
      <td>부동산임대</td>
      <td>L02A03</td>
    </tr>
  </tbody>
</table>
<p>833 rows × 6 columns</p>
</div>



`행이나 열을 삭제할 때, 인덱싱이 아닌 range나 항목의 리스트로 삭제할 영역 지정`

`인덱싱은 추출하는 목적 _ 즉, 그 값을 subset하는 경우, drop은 인덱싱의 성격과 반대로 인덱싱은 drop에 사용하지 않음`

### 5) `그룹으로 만들고, 숫자 세고, 데이터 프레임으로 만들기


```python
df_new = df_test.groupby(["대분류코드"])["중분류코드"].count().reset_index()
df_new
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>대분류코드</th>
      <th>중분류코드</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>D</td>
      <td>256</td>
    </tr>
    <tr>
      <th>1</th>
      <td>F</td>
      <td>161</td>
    </tr>
    <tr>
      <th>2</th>
      <td>L</td>
      <td>18</td>
    </tr>
    <tr>
      <th>3</th>
      <td>N</td>
      <td>64</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>5</td>
    </tr>
    <tr>
      <th>5</th>
      <td>P</td>
      <td>48</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Q</td>
      <td>113</td>
    </tr>
    <tr>
      <th>7</th>
      <td>R</td>
      <td>168</td>
    </tr>
  </tbody>
</table>
</div>



`인덱스와 칼럼 함수를 쓰는 것은, 결국 리스트를 만드는 것, 리스트는 인덱싱이 가능`

### `발췌한 데이터프레임으로 새로운 데이터 프레임을 만들려면`

### `1) reset_index(drop=True)를 사용해 기존 인덱스를 없앤 프레인을 만들고`

### `2) 칼럼 값을 바꾸고 싶다면, 리스트를 대응 시킨다`


```python
df_copy.reset_index(drop=True,inplace=True)
df_copy
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A01</td>
    </tr>
    <tr>
      <th>1</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A10</td>
    </tr>
    <tr>
      <th>2</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>828</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A07</td>
    </tr>
    <tr>
      <th>829</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A02</td>
    </tr>
    <tr>
      <th>830</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A03</td>
    </tr>
    <tr>
      <th>831</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L04</td>
      <td>평가/개발/관리</td>
      <td>L04A01</td>
    </tr>
    <tr>
      <th>832</th>
      <td>O</td>
      <td>L</td>
      <td>부동산</td>
      <td>L02</td>
      <td>부동산임대</td>
      <td>L02A03</td>
    </tr>
  </tbody>
</table>
<p>833 rows × 6 columns</p>
</div>




```python
list(df_copy.iloc[1])
```




    ['O', 'Q', '음식', 'Q05', '닭/오리요리', 'Q05A10']




```python
df_copy2 = df_copy.iloc[2:10].reset_index(drop=True)
df_copy2
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>상권분석(8대업종)</th>
      <th>대분류코드</th>
      <th>대분류명</th>
      <th>중분류코드</th>
      <th>중분류명</th>
      <th>소분류코드</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
    </tr>
    <tr>
      <th>1</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>2</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A04</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A18</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A11</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q03</td>
      <td>일식/수산물</td>
      <td>Q03A05</td>
    </tr>
    <tr>
      <th>7</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A12</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_copy2.columns = list(df_copy.iloc[1])
df_copy2
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>O</th>
      <th>Q</th>
      <th>음식</th>
      <th>Q05</th>
      <th>닭/오리요리</th>
      <th>Q05A10</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
    </tr>
    <tr>
      <th>1</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>2</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A04</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A18</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A11</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q03</td>
      <td>일식/수산물</td>
      <td>Q03A05</td>
    </tr>
    <tr>
      <th>7</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A12</td>
    </tr>
  </tbody>
</table>
</div>



## `상기 방법 외 한 번에 하는 방법`

1) `Value를 활용해 인덱싱한 영역의 값만 뽑고` 2) `DataFrame을 만든다`


```python
df_copy.iloc[2:10].values
```




    array([['O', 'Q', '음식', 'Q01', '한식', 'Q01A06'],
           ['O', 'Q', '음식', 'Q01', '한식', 'Q01A17'],
           ['O', 'Q', '음식', 'Q01', '한식', 'Q01A10'],
           ['O', 'Q', '음식', 'Q05', '닭/오리요리', 'Q05A04'],
           ['O', 'Q', '음식', 'Q01', '한식', 'Q01A18'],
           ['O', 'Q', '음식', 'Q01', '한식', 'Q01A11'],
           ['O', 'Q', '음식', 'Q03', '일식/수산물', 'Q03A05'],
           ['O', 'Q', '음식', 'Q01', '한식', 'Q01A12']], dtype=object)




```python
df_copy3 = pd.DataFrame(data=df_copy.iloc[2:10].values,columns=list(df_copy.iloc[1]))
```


```python
df_copy3
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>O</th>
      <th>Q</th>
      <th>음식</th>
      <th>Q05</th>
      <th>닭/오리요리</th>
      <th>Q05A10</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A06</td>
    </tr>
    <tr>
      <th>1</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>2</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>3</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A04</td>
    </tr>
    <tr>
      <th>4</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A18</td>
    </tr>
    <tr>
      <th>5</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A11</td>
    </tr>
    <tr>
      <th>6</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q03</td>
      <td>일식/수산물</td>
      <td>Q03A05</td>
    </tr>
    <tr>
      <th>7</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A12</td>
    </tr>
  </tbody>
</table>
</div>



## 인사이트
### `결론`
#### 1) 엑셀 데이터에 불필요한 부분이 있다면, drop([`리스트`]) 한다. (행 삭제 시) _ 열은 axis = 1 추가
#### 2) 인덱스를 바꾸고 싶다면, reset_index(drop=True)
#### 3) 칼럼이 2줄일 경우, 하나를 고른다면, 데이터 부분을  iloc[:]으로 뽑고 reset_index()한 뒤 , 원하는 칼럼 줄의 iloc[] 뽑아 칼럼명 변경
####      index나 columns를 호출하고 그 수만큼 값을 주면, 인덱스명 칼럼명 변경 가능, values도 iloc 호출 후 값 치환 가능


```python
df_copy3.index = ['A','B','A','B','A','A','B','A']
df_copy3.index[0]
```




    'A'




```python
df_copy3.iloc[0] = (0,1,2,4,5,6)
df_copy3
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>O</th>
      <th>Q</th>
      <th>음식</th>
      <th>Q05</th>
      <th>닭/오리요리</th>
      <th>Q05A10</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A</th>
      <td>0</td>
      <td>1</td>
      <td>2</td>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
    <tr>
      <th>B</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A17</td>
    </tr>
    <tr>
      <th>A</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A10</td>
    </tr>
    <tr>
      <th>B</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q05</td>
      <td>닭/오리요리</td>
      <td>Q05A04</td>
    </tr>
    <tr>
      <th>A</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A18</td>
    </tr>
    <tr>
      <th>A</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A11</td>
    </tr>
    <tr>
      <th>B</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q03</td>
      <td>일식/수산물</td>
      <td>Q03A05</td>
    </tr>
    <tr>
      <th>A</th>
      <td>O</td>
      <td>Q</td>
      <td>음식</td>
      <td>Q01</td>
      <td>한식</td>
      <td>Q01A12</td>
    </tr>
  </tbody>
</table>
</div>



리스트는 기본적으로 인덱싱 치환이 가능하지만, PD에서는 인덱스 치환은 불가능


```python

```
