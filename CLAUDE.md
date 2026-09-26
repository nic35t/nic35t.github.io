# CLAUDE.md

Guidance for Claude Code sessions in this repository. The full history of how
the site got here is in `docs/PROJECT-HISTORY.md`; read it before large changes.

## What this is

A Korean personal blog (`https://nic35t.github.io`, locale ko-KR) on Jekyll +
a vendored Minimal Mistakes theme, deployed by **GitHub Pages classic** from
`main`. Every merge to `main` deploys; there is no staging.

## Deploy constraints (the ones that bite)

- GitHub Pages compiles Sass with **Ruby Sass 3.7.4**, not the Dart Sass the
  local Jekyll 4 build uses. Mixed-unit `clamp()`/`min()`/`max()` and anything
  with `env()` must be written as `#{"..."}`. Check before pushing style work:
  `scripts/pages-sass-check.rb` (usage in its header).
- Critical CSS is inlined from `_includes/head/critical-css.html`. After any
  style change run `npm run critical` (needs a server on :4000, which
  `scripts/debug.sh` starts) or `doctor` fails on the stale fingerprint.
- `compress_html` collapses inline scripts to one line: use `/* */` comments in
  inline `<script>`, never `//`.
- Files at the repo root without front matter are published as-is; add
  non-site files to `exclude:` in `_config.yml`.

## Checks

- `bundle exec ruby scripts/doctor.rb`: static checks (front matter, excludes,
  critical-CSS fingerprint).
- `scripts/debug.sh --throttle`: build + Playwright diagnostics (overflow,
  tap targets 44px, axe WCAG AA, CLS/INP/LCP, visual regression vs
  `debug-baseline/`). `--update-baseline` after intentional visual changes.
- CI (`.github/workflows/quality.yml`) runs doctor, build, selftest and the
  throttled diagnostics (no visual regression) on every PR and push to main.

## Design system (Apple-style redesign, PR #1)

- Tokens: `_sass/custom/_tokens.scss` (colours only via `var(--token)`, dual
  dark mode: `prefers-color-scheme` + `[data-theme]`). One partial per area in
  `_sass/custom/`. Every rule carries a WHY comment (house style).
- Korean text: `word-break: keep-all` globally. Fonts: Pretendard Variable with
  a one-shot swap allowed only in the first 300ms (`_includes/head/font-swap.html`).
- Contrast, 44px tap targets and reduced motion are enforced by the checks.

## Content

- Posts: `_posts/YYYY-MM-DD-english-slug.md`. `npm run new -- <slug> [--template column|series|tutorial|note]`
  creates a draft. Templates live in `_templates/`.
- Self-check tests: data-only files in `_pages/tests/*.md` rendered by
  `_layouts/quiz.html` + `assets/js/quiz.js` (schema in the layout comment and
  in `docs/WRITING.md` §3). `/tests/` lists them by `order`.
- CMS: Pages CMS (`https://app.pagescms.org`), config `.pages.yml`
  (collections: 글, 글 템플릿, 테스트). Validate schema changes against Pages
  CMS's `lib/config-schema.ts` before shipping.

## Working agreements with the owner

- Communicate in Korean. The owner reads on a phone; keep reports short.
- Merging to `main` = deploying. Merge only after an explicit "배포해" /
  "병합해". After merging, confirm the `pages build and deployment` and
  `site quality` runs on `main` succeeded and report back.
- Keep token use proportionate: the first redesign used large multi-agent
  workflows (~10M fresh + ~500M cache-read tokens) and the owner flagged the
  cost. Default to doing work directly; propose workflows with a cost estimate.

## Environment notes (Claude Code on the web)

- `impeccable.style`, `glif.app` and the live site `nic35t.github.io` are
  blocked by the sandbox network policy (the `glif` MCP server cannot connect).
- Project skills in `.claude/skills/` and MCP servers in `.mcp.json` load
  automatically; see `docs/PROJECT-HISTORY.md` for what each is for.
