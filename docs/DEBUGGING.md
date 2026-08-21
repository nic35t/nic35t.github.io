# 디버깅 가이드

이 사이트는 Jekyll 정적 사이트라 "빌드 성공 = 정상"이 아니다.
빌드는 통과하는데 실제로는 깨져 있는 문제(레이아웃 오버플로, z-index에 가려진
버튼, 잘못된 타임존, 발행되면 안 되는 파일 유출)를 잡기 위한 도구 모음이다.

## 준비

```bash
scripts/setup.sh
```

Ruby gem(Jekyll)과 Node 패키지(Playwright)를 설치한다. 여러 번 실행해도 안전하다.

> 웹 세션에서 매번 자동 실행하고 싶다면 `.claude/settings.json`에 SessionStart
> 훅으로 `bash scripts/setup.sh`를 등록하면 된다.

## 한 번에 전체 점검

```bash
scripts/debug.sh
```

세 단계를 순서대로 돈다.

1. **정적 점검** (`scripts/doctor.rb`) — 빌드 전 설정/front matter 검사
2. **Jekyll 빌드** — Sass deprecation 노이즈를 걷어내고 진짜 에러만 표시
3. **브라우저 진단** (`scripts/diagnose.mjs`) — 실제 Chromium으로 페이지를 열어 검사

에러가 하나라도 있으면 종료 코드 1을 반환한다.

유용한 옵션:

```bash
scripts/debug.sh --skip-build                  # _site 재사용
scripts/debug.sh --viewport mobile             # 뷰포트 하나만
scripts/debug.sh --paths /,/investment-test/   # 특정 페이지만
scripts/debug.sh --external                    # 외부 CDN 실패도 보고
```

결과는 `debug-report/`에 남는다.

| 파일 | 내용 |
| --- | --- |
| `report.md` | 사람이 읽는 요약 |
| `report.json` | 기계가 읽는 원본 |
| `screenshots/` | 페이지 × 뷰포트 전체 스크린샷 |

## 각 검사가 잡아내는 것

### 정적 점검 — `npm run doctor`

| 검사 | 잡는 문제 |
| --- | --- |
| `timezone` | `Asis/Seoul` 같은 오타. 빌드는 통과하지만 모든 글 날짜가 UTC로 밀린다 |
| `plugins` | `_config.yml`에는 있는데 Gemfile에 없는 플러그인. GitHub Pages는 조용히 무시하지만 로컬 빌드는 죽는다 |
| `exclude` | `banner.js`, `*.gemspec` 처럼 `_site`로 복사되어 공개되는 파일 |
| `frontmatter` | 파일명 날짜 오류(글이 아예 발행 안 됨), 미래 날짜, 파싱 불가 YAML, 제목 누락 |
| `permalink` | 중복 permalink — 한쪽 페이지가 조용히 덮어써진다 |

### 브라우저 진단 — `npm run diagnose`

모바일(375) / 태블릿(768) / 데스크톱(1440) 세 뷰포트에서 각 페이지를 연다.

| 검사 | 잡는 문제 |
| --- | --- |
| `overflow` | 가로 스크롤. 원인이 되는 **가장 바깥쪽** 요소와 삐져나온 px를 지목한다 |
| `click-blocked` | 요소 중심점에 `elementFromPoint`를 쏴서, 다른 요소가 위에 덮여 클릭을 먹는지 확인. 햄버거 메뉴가 안 눌리는 부류의 버그 |
| `tap-target` | 모바일에서 44px 미만인 컨트롤 (본문 링크는 제외) |
| `broken-image` | 같은 오리진 이미지 로드 실패 |
| `js-error` | 실제 스크립트 예외 (리소스 로드 실패 메아리는 제외) |
| `request-failed` | 같은 오리진 요청 실패 = 에러. 외부 CDN은 `--external`일 때만 보고 |
| `stacking` | z-index 맵. 실패가 아니라, z-index 버그가 났을 때 손에 쥐고 있어야 할 자료 |

### 진단기 자체 테스트

```bash
npm run selftest
```

검사 로직을 픽스처에 돌린다. **반드시 잡아야 하는 케이스**(가려진 버튼, 넘치는
div, 작은 탭 타겟)와 **절대 잡으면 안 되는 케이스**(화면 밖에 있는 스킵 링크)를
같이 검증한다. 검사 조건을 손볼 때 여기부터 확인할 것.

## 실제 기기에서 디버깅 — `?debug=1`

배포된 사이트든 로컬이든 URL 뒤에 `?debug=1`을 붙이면 화면 하단에 패널이 뜬다.

```
https://nic35t.github.io/?debug=1
```

패널이 보여주는 것: 현재 뷰포트, 오버플로 원인 요소, 가려진 컨트롤과 **덮은
요소의 z-index**, 작은 탭 타겟, JS 에러, z-index 스택 순서.

- `outline` 버튼 — 문제 요소를 화면에서 빨강/노랑 테두리로 표시
- `rescan` 버튼 — 다시 측정 (회전·리사이즈 시 자동 재측정)
- `×` 버튼 — 플래그 해제 후 종료

플래그는 `localStorage`에 저장되어 페이지를 옮겨다녀도 유지된다. 콘솔에서
`localStorage.debugOverlay = "1"` 로 켜고 `×`로 끈다.

일반 방문자에게는 비용이 없다. 로더가 조건을 먼저 확인하고, 해당할 때만
`assets/js/debug-overlay.js`를 요청한다.

## 로컬에서 눈으로 보기

```bash
scripts/serve.sh     # http://127.0.0.1:4000, live reload
```

## 알려진 노이즈

- **Sass deprecation 경고 200여 개** — 테마가 들고 있는 Susy/Breakpoint가
  옛 문법(`$a / $b`)을 쓴다. `scripts/debug.sh`가 걸러낸다.
- **외부 CDN 실패** — 샌드박스에서는 jsdelivr, Google Fonts, 애널리틱스가 막혀
  있다. 기본적으로 보고하지 않는다. 실제로 확인하려면 `--external`.
- **`remote_theme`** — GitHub Pages에서만 동작한다. 로컬 빌드는 저장소 안의
  `_sass` / `_includes` / `_layouts`를 쓰므로, 테마 업스트림과 차이가 나면
  로컬과 배포 결과가 다를 수 있다.
