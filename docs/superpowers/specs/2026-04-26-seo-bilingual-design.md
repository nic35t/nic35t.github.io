# SEO and Bilingual English Rollout Design

**Date:** 2026-04-26  
**Repo:** `nic35t/nic35t.github.io`  
**Status:** Approved design, ready for implementation planning after user review

## Goal

Improve organic search performance for the existing Korean blog while adding a safe v1 English experience that search engines can index independently.

The first release should:

- preserve existing Korean URLs and their SEO history
- add English article URLs under `/en/`
- expose explicit search-engine language signals such as `hreflang`
- add visible KR/EN toggles on paired articles
- publish English versions for only 10-15 representative posts in the first pass

## Current State

- The blog is a Jekyll site using the Minimal Mistakes theme.
- Korean articles are stored as posts in `_posts`.
- The site already emits basic SEO tags and `BlogPosting` JSON-LD.
- The live site serves UTF-8 HTML correctly.
- There is no bilingual page pairing model, no `hreflang`, and no English landing page.
- The site uses GitHub Pages-compatible pagination, so adding English entries directly to `_posts` would risk mixing English content into the Korean home feed and paginated listings.

## Product Decisions

### 1. URL Strategy

- Keep every existing Korean article URL unchanged.
- Create English article URLs under `/en/...`.
- Do not migrate Korean URLs into `/ko/...`.
- Do not use client-side language switching on a single URL.

### 2. English Content Scope for v1

- Translate only 10-15 representative posts in the first release.
- Prioritize recent and strategically important posts first.
- Leave untranslated Korean posts untouched.
- Hide the language toggle when no paired English page exists.

### 3. English Content Storage Model

- Keep Korean originals in `_posts`.
- Store English counterparts as pages under `_pages/en/` rather than as posts.
- Each English page should use `layout: single` and article-style metadata so it behaves like a post for readers and for SEO.

This avoids breaking Korean pagination while still giving English pages their own crawlable URLs.

## Content Model

### Korean post fields

Selected Korean posts gain:

```yml
lang: ko
translation_key: ai-business-planning-havruta-method
```

### English page fields

Each English page should contain at least:

```yml
layout: single
lang: en
translation_key: ai-business-planning-havruta-method
title: "..."
excerpt: "..."
description: "..."
date: 2026-04-13 00:50:00 +0900
last_modified_at: 2026-04-13T00:50:00+09:00
categories:
  - Business Strategy
tags:
  - AI
permalink: /en/business-strategy/ai-business-planning-havruta-method/
toc: true
toc_sticky: true
```

### Pairing rule

- `translation_key` is the single source of truth for KR/EN page matching.
- A page pair is considered valid only when both sides exist and share the same `translation_key`.

## Rendering and Navigation

### Korean experience

- Keep the existing Korean home, category pages, and pagination behavior intact.
- Do not inject English articles into Korean list pages.

### English experience

- Create a dedicated English landing page at `/en/`.
- The English landing page lists only the translated v1 article set.
- No English pagination is required in v1.

### Navigation

- Add one simple masthead entry or equivalent prominent link to `/en/`.
- Do not create a fully separate English navigation tree in v1.

### Article-level language toggle

- Add a KR/EN switcher near the top of article pages.
- When a translation pair exists, the switcher links directly to the paired page.
- When no pair exists, the switcher is not shown.

## SEO Design

### Canonical rules

- Korean articles use self-canonical Korean URLs.
- English articles use self-canonical English URLs.
- Never canonicalize English pages back to Korean pages.

### `hreflang` rules

- Emit bilingual alternate tags only when a valid paired page exists.
- Use:
  - `ko-KR` for Korean pages
  - `en` for English pages
- Do not emit fake alternates for untranslated articles.

### Page language signals

- Set `<html lang="ko">` on Korean pages.
- Set `<html lang="en">` on English pages.

### Structured data

Keep the existing `BlogPosting` shape for article-like pages and enrich it with:

- `inLanguage`
- `keywords` from tags
- category-derived context such as `about` or section metadata
- `isPartOf` pointing to the blog
- representative image data when available

The home and English landing pages should continue to expose site-level metadata appropriate to their page type.

### Metadata quality

For translated English pages:

- rewrite title, excerpt, and description in natural English
- optimize headings and summaries for English search intent
- preserve the article meaning instead of doing literal sentence-by-sentence conversion

## Files and Areas Expected to Change

Implementation is expected to touch these areas:

- `_config.yml`
  - language-aware site metadata and any safe global defaults needed for bilingual pages
- `_includes/seo.html`
  - `canonical`, `hreflang`, `inLanguage`, and enriched structured data
- `_includes/masthead.html`
  - English landing entry point if the nav is rendered there
- `_layouts` or a new include
  - article language switcher rendering
- `_posts`
  - metadata additions for selected Korean posts
- `_pages/en/`
  - English landing page plus translated English article pages

## Translation Operations for v1

- Translate 10-15 curated posts only.
- Preserve code blocks, screenshots, tables, and technical accuracy.
- Prefer human-edited English phrasing over literal machine-style translation.
- New future posts can continue to launch in Korean first, with English pages added in a follow-up translation step using the same `translation_key` pattern.

## Validation Criteria

Implementation is successful when all of the following are true:

- `bundle exec jekyll build` succeeds
- Korean home pagination still shows only Korean posts
- `/en/` is reachable and lists only translated English entries
- paired KR/EN pages output correct self-canonical URLs
- paired KR/EN pages output matching `hreflang` tags
- article pages expose correct `lang` values and enriched JSON-LD
- `sitemap.xml` includes both Korean originals and English translation pages
- untranslated Korean posts do not expose broken or placeholder English links

## Risks and Guardrails

- Some local file reads may appear mojibake in the terminal; preserve file encoding carefully and verify output in generated HTML when editing translated content.
- The design must stay GitHub Pages-compatible; do not rely on unsupported plugins such as locale-aware pagination plugins.
- Avoid broad navigation or taxonomy duplication in v1. The first release is intentionally scoped to article pages plus one English landing page.

## External References

- Google Search Central: localized versions guidance  
  <https://developers.google.com/search/docs/specialty/international/localized-versions>
- Google Search Central: canonicalization guidance  
  <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Google Search Central: article structured data  
  <https://developers.google.com/search/docs/appearance/structured-data/article>
