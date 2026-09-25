---
title: "테스트"
description: "스스로를 돌아보는 짧은 자기 점검 테스트 모음"
permalink: /tests/
layout: archive
author_profile: false
---
{%- comment -%}
  One nav entry for every self-check test. Each test is a data file in
  _pages/tests/ (layout: quiz), so this list builds itself: a test added in
  the CMS appears here, ordered by its "order" field. The tests are pages, not
  posts, so post-tile.html (which reads post dates and categories) does not
  fit; the tile markup is written out on the category landings' grid.
{%- endcomment -%}
{%- assign tests = site.pages | where: "layout", "quiz" | sort: "order" -%}
<p class="archive-header__lede">스스로를 돌아보는 짧은 자기 점검 테스트입니다. 각 10문항 안팎, 2~3분이면 끝납니다.</p>
<div class="tile-grid">
  {%- for t in tests %}
  <article class="tile tile--default">
    {%- if t.eyebrow %}<p class="tile__eyebrow">{{ t.eyebrow }}</p>{% endif %}
    <h2 class="tile__title no_toc"><a href="{{ t.url | relative_url }}">{{ t.title }}</a></h2>
    <p class="tile__excerpt">{{ t.description }}</p>
    <p class="tile__meta">{{ t.questions.size }}문항 · 두 축 · 결과 유형 {{ t.results.size }}가지</p>
  </article>
  {%- endfor %}
</div>
