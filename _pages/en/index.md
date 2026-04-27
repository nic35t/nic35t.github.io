---
title: "English"
permalink: /en/
layout: archive
lang: en
translation_key: home
author_profile: true
description: "English editions of selected posts from Not a Know-IT-All."
excerpt: "Browse the first English editions of selected essays on AI planning, stablecoins, regulation, and the Korean won."
---

Welcome to the English edition of selected posts from **Not a Know-IT-All**.

This first rollout focuses on representative essays about AI planning, stablecoins, digital-asset regulation, and the Korean won. More English editions can be added over time while the original Korean posts remain unchanged.

{% assign english_pages = site.pages | where: "lang", "en" | where_exp: "item", "item.translation_key" | sort: "date" | reverse %}
<div class="entries-list">
{% for post in english_pages %}
  {% unless post.url == '/en/' %}
    {% include archive-single.html post=post %}
  {% endunless %}
{% endfor %}
</div>
