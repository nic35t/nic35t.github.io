---
title: "테스트"
description: "스스로를 돌아보는 짧은 자기 점검 테스트 모음"
permalink: /tests/
layout: archive
author_profile: false
---
{%- comment -%}
  One nav entry for every self-check test. The tests are pages, not posts, so
  post-tile.html (which reads post dates and categories) does not fit; the
  markup below is the same tile shape by hand, on the category landings'
  grid, so it picks up the same styles.
{%- endcomment -%}
<p class="archive-header__lede">스스로를 돌아보는 짧은 자기 점검 테스트입니다. 각 10문항, 2~3분이면 끝납니다.</p>
<div class="tile-grid">
  <article class="tile tile--default">
    <p class="tile__eyebrow">AI</p>
    <h2 class="tile__title no_toc"><a href="{{ '/ai-agent-test/' | relative_url }}">AI 에이전트 활용 성향 테스트</a></h2>
    <p class="tile__excerpt">AI에게 얼마나 맡기는가, 그리고 어디까지 연결하는가. MCP와 스킬로 보는 10문항.</p>
    <p class="tile__meta">10문항 · 두 축 · 결과 유형 5가지</p>
  </article>
  <article class="tile tile--default">
    <p class="tile__eyebrow">투자</p>
    <h2 class="tile__title no_toc"><a href="{{ '/investment-test/' | relative_url }}">투자 성향 테스트</a></h2>
    <p class="tile__excerpt">위험을 얼마나 견디는가, 그리고 무엇을 근거로 결정하는가. 행동경제학의 편향으로 보는 10문항.</p>
    <p class="tile__meta">10문항 · 두 축 · 결과 유형 5가지</p>
  </article>
</div>
