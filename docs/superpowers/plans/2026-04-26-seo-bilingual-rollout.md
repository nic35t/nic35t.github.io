# SEO and Bilingual English Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve search visibility and add a crawlable English v1 experience by keeping Korean URLs intact, adding `/en/` English counterparts, and wiring canonical, `hreflang`, and on-page language toggles.

**Architecture:** Korean source posts remain in `_posts`, while English article pages live under `_pages/en/` so they can be indexed without contaminating Korean post pagination. Shared SEO and pairing logic lives in Liquid includes and front matter fields (`lang`, `translation_key`), with a dedicated English landing page and a small masthead entry for discovery.

**Tech Stack:** Jekyll, Minimal Mistakes, Liquid includes/layouts, GitHub Pages-compatible plugins, Markdown content pages

---

### Task 1: Prepare a Safe Working Branch

**Files:**
- Modify: none
- Verify: repository state only

- [ ] **Step 1: Create a feature branch from the current checkout**

Run:

```powershell
Set-Location -LiteralPath 'C:\Users\leesa\Documents\Codex\2026-04-25-github-plugin-github-openai-curated-https\nic35t.github.io'
git switch -c feature/seo-bilingual-v1
```

Expected: branch changes from `main` to `feature/seo-bilingual-v1` while preserving the current uncommitted setup changes.

- [ ] **Step 2: Verify the branch and dirty baseline**

Run:

```powershell
git branch --show-current
git status --short --branch
```

Expected:
- current branch is `feature/seo-bilingual-v1`
- existing `Gemfile` and `_config.yml` edits remain visible

- [ ] **Step 3: Commit the plan document only if it is still uncommitted on the feature branch**

Run:

```powershell
git log --oneline -1
```

Expected:
- either the latest commit is already `docs: add seo bilingual design spec`
- or, if the plan file itself is still uncommitted, commit only the plan/design docs before implementation proceeds

### Task 2: Make Layouts and SEO Language-Aware

**Files:**
- Modify: `_layouts/default.html`
- Modify: `_includes/seo.html`
- Modify: `_includes/masthead.html`
- Create: `_includes/language-switcher.html`
- Test: local Jekyll build output for home and article pages

- [ ] **Step 1: Write the failing verification checklist**

Define these expected outcomes before editing:

```text
1. A Korean post with lang: ko renders <html lang="ko">.
2. An English page with lang: en renders <html lang="en">.
3. A paired Korean page emits self-canonical plus hreflang=en alternate.
4. A paired English page emits self-canonical plus hreflang=ko-KR alternate.
5. An unpaired Korean page emits no broken alternate.
6. The masthead contains an English entry point.
```

- [ ] **Step 2: Update `_layouts/default.html` to use page-aware language resolution**

Replace the hard-coded root language expression with page-aware logic:

```liquid
{% assign page_lang = page.lang | default: site.locale | slice: 0, 2 | default: "en" %}
<html lang="{{ page_lang }}" class="no-js">
```

Expected: article pages can render `ko` or `en` independently of the global `site.locale`.

- [ ] **Step 3: Extend `_includes/seo.html` with language pairing logic**

Add Liquid logic near the top to derive:

```liquid
{% assign current_lang = page.lang | default: 'ko' %}
{% assign current_translation_key = page.translation_key %}
{% assign all_translation_docs = site.posts | concat: site.pages %}
{% assign paired_doc = nil %}
{% if current_translation_key %}
  {% for doc in all_translation_docs %}
    {% if doc.translation_key == current_translation_key and doc.url != page.url and doc.lang != current_lang %}
      {% assign paired_doc = doc %}
      {% break %}
    {% endif %}
  {% endfor %}
{% endif %}
```

Then extend metadata output so that:
- `canonical` remains self-referential
- `alternate` tags are emitted only when `paired_doc` exists
- `og:locale` resolves to `ko_KR` for Korean pages and `en_US` for English pages
- JSON-LD includes `inLanguage`, `keywords`, and category context

- [ ] **Step 4: Add the article language toggle include**

Create `_includes/language-switcher.html` with behavior like:

```liquid
{% assign current_lang = page.lang | default: 'ko' %}
{% assign current_translation_key = page.translation_key %}
{% assign paired_doc = nil %}
{% if current_translation_key %}
  {% assign all_translation_docs = site.posts | concat: site.pages %}
  {% for doc in all_translation_docs %}
    {% if doc.translation_key == current_translation_key and doc.url != page.url and doc.lang != current_lang %}
      {% assign paired_doc = doc %}
      {% break %}
    {% endif %}
  {% endfor %}
{% endif %}
{% if paired_doc %}
<nav class="page__language-switcher" aria-label="Language switcher">
  {% if current_lang == 'ko' %}
    <strong>한국어</strong>
    <span aria-hidden="true">|</span>
    <a href="{{ paired_doc.url | relative_url }}">English</a>
  {% else %}
    <a href="{{ paired_doc.url | relative_url }}">한국어</a>
    <span aria-hidden="true">|</span>
    <strong>English</strong>
  {% endif %}
</nav>
{% endif %}
```

- [ ] **Step 5: Render the language switcher at the top of article content**

Insert this include in `_layouts/single.html` immediately after the header/meta area and before `.page__content`:

```liquid
{% include language-switcher.html %}
```

- [ ] **Step 6: Add an English landing entry to the masthead**

Append a stable nav item to `_data/navigation.yml`:

```yml
  - title: "English"
    url: /en/
```

Expected: `_includes/masthead.html` will render it automatically without additional loop changes.

- [ ] **Step 7: Run a build to verify metadata generation**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll build
```

Expected: build succeeds and the generated `_site` contains updated HTML language tags and SEO metadata.

- [ ] **Step 8: Commit the shared SEO/layout changes**

Run:

```powershell
git add _layouts/default.html _layouts/single.html _includes/seo.html _includes/language-switcher.html _data/navigation.yml
git commit -m "feat: add bilingual seo and language switcher"
```

### Task 3: Create the English Landing Experience

**Files:**
- Create: `_pages/en/index.md`
- Optionally create: `_pages/en/` subdirectory if missing
- Optionally modify: `_data/ui-text.yml` only if a small English label override is needed
- Test: generated `/en/index.html`

- [ ] **Step 1: Write the failing content expectation**

Expected English landing page behaviors:

```text
1. /en/ exists.
2. It lists only the translated v1 English pages.
3. It uses English copy and does not depend on Korean pagination.
```

- [ ] **Step 2: Create the `/en/` landing page**

Create `_pages/en/index.md` with content like:

```md
---
title: "English"
permalink: /en/
layout: archive
lang: en
author_profile: true
description: "English versions of selected posts from Not a Know-IT-All."
---

Welcome to the English edition of selected posts from **Not a Know-IT-All**.

{% assign english_pages = site.pages | where: "lang", "en" | where_exp: "item", "item.translation_key" | sort: "date" | reverse %}
<div class="entries-list">
{% for post in english_pages %}
  {% unless post.url == '/en/' %}
    {% include archive-single.html %}
  {% endunless %}
{% endfor %}
</div>
```

- [ ] **Step 3: Update `_includes/archive-single.html` so it works for pages and posts**

Refactor the include to normalize `document = include.post | default: post | default: page`, then use `document` consistently for title, excerpt, teaser, URL, and meta rendering. This is required because the English landing page will feed pages, not posts.

Suggested normalization pattern:

```liquid
{% assign document = include.post | default: post | default: page %}
```

- [ ] **Step 4: Run build verification**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll build
```

Expected: `_site/en/index.html` is generated and lists only English pages.

- [ ] **Step 5: Commit the English landing page work**

Run:

```powershell
git add _pages/en/index.md _includes/archive-single.html
git commit -m "feat: add english landing page"
```

### Task 4: Add Translation Metadata to the Korean Source Set

**Files:**
- Modify:
  - `_posts/2026-04-13-AI-Business-Planning-Havruta-Method.md`
  - `_posts/2025-10-11-korea-blockchain-regulation-crossroads.md`
  - `_posts/2025-10-11-k-stablecoin-opportunities.md`
  - `_posts/2025-10-11-k-stablecoin-strategy-step-one.md`
  - `_posts/2025-09-22-what-is-stablecoin.md`
  - `_posts/2025-09-22-won-status-in-global-market.md`
  - `_posts/2025-09-22-won-as-big-hand-in-crypto.md`
  - `_posts/2025-09-22-reason-for-weak-won.md`
  - `_posts/2025-09-22-stablecoin-revenue-model.md`
  - `_posts/2025-09-22-role-of-government.md`
  - `_posts/2025-09-22-paradox-of-outdated-regulation.md`
  - `_posts/2025-09-22-the-future-with-won-stablecoin.md`
- Test: front matter parsing in build

- [ ] **Step 1: Write the failing metadata requirement**

Each selected Korean source file must contain:

```yml
lang: ko
translation_key: <stable-slug>
```

- [ ] **Step 2: Patch the twelve selected Korean files**

Use these exact keys:

```text
AI-Business-Planning-Havruta-Method -> ai-business-planning-havruta-method
korea-blockchain-regulation-crossroads -> korea-blockchain-regulation-crossroads
k-stablecoin-opportunities -> k-stablecoin-opportunities
k-stablecoin-strategy-step-one -> k-stablecoin-strategy-step-one
what-is-stablecoin -> what-is-stablecoin
won-status-in-global-market -> won-status-in-global-market
won-as-big-hand-in-crypto -> won-as-big-hand-in-crypto
reason-for-weak-won -> reason-for-weak-won
stablecoin-revenue-model -> stablecoin-revenue-model
role-of-government -> role-of-government
paradox-of-outdated-regulation -> paradox-of-outdated-regulation
the-future-with-won-stablecoin -> the-future-with-won-stablecoin
```

- [ ] **Step 3: Run build verification**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll build
```

Expected: no front matter parse errors.

- [ ] **Step 4: Commit the Korean metadata changes**

Run:

```powershell
git add _posts/2026-04-13-AI-Business-Planning-Havruta-Method.md _posts/2025-10-11-korea-blockchain-regulation-crossroads.md _posts/2025-10-11-k-stablecoin-opportunities.md _posts/2025-10-11-k-stablecoin-strategy-step-one.md _posts/2025-09-22-what-is-stablecoin.md _posts/2025-09-22-won-status-in-global-market.md _posts/2025-09-22-won-as-big-hand-in-crypto.md _posts/2025-09-22-reason-for-weak-won.md _posts/2025-09-22-stablecoin-revenue-model.md _posts/2025-09-22-role-of-government.md _posts/2025-09-22-paradox-of-outdated-regulation.md _posts/2025-09-22-the-future-with-won-stablecoin.md
git commit -m "feat: tag korean posts for translation pairing"
```

### Task 5: Create the First English Article Set

**Files:**
- Create:
  - `_pages/en/ai-business-planning-havruta-method.md`
  - `_pages/en/korea-blockchain-regulation-crossroads.md`
  - `_pages/en/k-stablecoin-opportunities.md`
  - `_pages/en/k-stablecoin-strategy-step-one.md`
  - `_pages/en/what-is-stablecoin.md`
  - `_pages/en/won-status-in-global-market.md`
  - `_pages/en/won-as-big-hand-in-crypto.md`
  - `_pages/en/reason-for-weak-won.md`
  - `_pages/en/stablecoin-revenue-model.md`
  - `_pages/en/role-of-government.md`
  - `_pages/en/paradox-of-outdated-regulation.md`
  - `_pages/en/the-future-with-won-stablecoin.md`
- Test: page generation and pairing

- [ ] **Step 1: Create one English page template and confirm the shape**

Use this structure for each page:

```md
---
title: "Why AI Fails at Business Planning and How the Havruta Method Fixes It"
excerpt: "Use AI as an interviewer, not a guesser, to extract the real logic behind a business plan."
description: "A practical framework for using AI to interrogate and refine a business plan through structured questioning."
layout: single
lang: en
translation_key: ai-business-planning-havruta-method
date: 2026-04-13 00:50:00 +0900
last_modified_at: 2026-04-13T00:50:00+09:00
categories:
  - Business Strategy
tags:
  - AI
  - Business Planning
  - Havruta
  - Prompt Design
permalink: /en/business-strategy/ai-business-planning-havruta-method/
toc: true
toc_sticky: true
---
```

- [ ] **Step 2: Translate the remaining 11 pages with edited English titles and summaries**

Rules:
- preserve article intent
- keep code blocks and images intact
- rewrite the heading hierarchy in natural English
- avoid literal transliteration when an English search phrase is clearer

- [ ] **Step 3: Run a full build**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll build
```

Expected: all English pages build successfully and appear in `/en/`.

- [ ] **Step 4: Commit the English article batch**

Run:

```powershell
git add _pages/en/*.md
git commit -m "feat: add first english article batch"
```

### Task 6: Verify Search Signals and User Navigation

**Files:**
- Verify generated `_site` output only
- No new source files required unless fixes are discovered

- [ ] **Step 1: Verify homepage and English landing output**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll serve --host 127.0.0.1 --port 4001
```

Then manually check:
- `http://127.0.0.1:4001/`
- `http://127.0.0.1:4001/en/`

Expected:
- Korean homepage remains Korean-only
- English landing is reachable and lists English pages only

- [ ] **Step 2: Verify paired article metadata**

Open one Korean/English pair in browser or inspect generated HTML in `_site`. Confirm:

```text
1. canonical points to the current page URL
2. hreflang alternates point to the paired page
3. html lang changes between ko and en
4. language switcher links in both directions
5. title/description/JSON-LD are language-appropriate
```

- [ ] **Step 3: Verify sitemap coverage**

Run:

```powershell
Select-String -Path '_site/sitemap.xml' -Pattern '/en/'
```

Expected: translated English URLs are present in the generated sitemap.

- [ ] **Step 4: Commit any final verification fixes**

Run:

```powershell
git status --short
git add <only any remaining fix files>
git commit -m "fix: polish bilingual seo rollout"
```

### Task 7: Prepare Delivery

**Files:**
- Verify repository status only

- [ ] **Step 1: Run final build verification**

Run:

```powershell
$env:Path = 'C:\Ruby33-x64\bin;' + $env:Path
bundle exec jekyll build
```

Expected: exit code 0.

- [ ] **Step 2: Review final git status**

Run:

```powershell
git status --short --branch
git log --oneline -5
```

Expected: all intended feature work is committed on `feature/seo-bilingual-v1`.

- [ ] **Step 3: Summarize outcomes**

Report:
- which shared templates changed
- which posts were paired
- which English pages were added
- what verification passed
- any residual limitations, especially untranslated articles remaining Korean-only
