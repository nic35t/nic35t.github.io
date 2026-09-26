# 프로젝트 작업 기록

2026년 9월 24~26일 Claude Code(웹) 세션에서 진행한 작업을 정리한 문서입니다.
다음 작업 때 무엇이 왜 이렇게 되어 있는지 빠르게 파악하는 용도입니다.
짧은 요약본은 저장소 루트의 `CLAUDE.md`에 있고, Claude가 새 세션을 시작할 때
자동으로 읽습니다.

## 1. 작업 타임라인 (모두 `main`에 병합·배포 완료)

| PR | 내용 | 핵심 파일 |
| --- | --- | --- |
| #1 | 디자인 스킬·MCP 설치 + 애플 스타일 전면 개편 | `_sass/custom/*`, `_layouts/*`, `_includes/*`, `.claude/skills/`, `.mcp.json` |
| #2 | 파비콘 교체, 불안정하던 INP 자체 테스트 수정 | `favicon.ico`, `assets/images/favicon-32.png`, `apple-touch-icon.png`, `scripts/selftest.mjs` |
| #3 | 글쓰기 CMS(Pages CMS), 글 템플릿 4종, `npm run new`, 글쓰기 가이드 | `.pages.yml`, `_templates/`, `scripts/new-post.mjs`, `docs/WRITING.md` |
| #4 | AI 에이전트 활용 성향 테스트 추가 | `_pages/tests/ai-agent-test.md` (PR #6에서 데이터 형식으로 전환) |
| #5 | 상단 메뉴를 `Test` 하나로 통합, 테스트 모음 페이지 | `_pages/tests.md`, `_data/navigation.yml`, `_includes/masthead.html` |
| #6 | 테스트를 데이터 기반 엔진으로 전환, 테스트 2종 추가, CMS 테스트 메뉴 | `_layouts/quiz.html`, `assets/js/quiz.js`, `_pages/tests/*.md` |

### 1-1. 애플 스타일 개편 (PR #1)의 주요 결정

- 디자인 방향: 애플 편집형 페이지(apple.com 타일, Newsroom). 48px 반투명
  상단 메뉴, 무채색 배경, 파란색은 누를 수 있는 곳에만.
- 홈: 최신 글 히어로 → 원화 스테이블코인 시리즈 검은 타일(태그
  `원화 스테이블코인 심층분석`, `index.html`의 `home_series.tag`) → 최근 글 2×2.
- 글: 가운데 692px 칼럼, 한글 `keep-all` 줄바꿈, 넓은 화면에서 오른쪽 목차.
- 다크 모드: `#000`/`#1d1d1f`, 긴 본문은 `#e0e0e5`로 한 단계 부드럽게.
- 폰트: Pretendard Variable. 300ms 안에 도착(캐시)할 때만 교체하고, 늦으면
  그 페이지는 시스템 폰트 유지. 폰트 교체로 인한 레이아웃 흔들림(CLS)이
  0.29에서 0.006으로 줄었습니다.
- 소유자 승인 항목(한 줄로 되돌릴 수 있음): 반투명 메뉴(`--nav-bg`), 투자
  테스트 선택지 이모지 제거, 가짜 1.5초 "분석 중" 대기 제거.
- Font Awesome 제거(아이콘을 쓰는 곳이 없어짐), 스크롤스파이 오프셋을
  메뉴 높이로 측정.

### 1-2. 테스트 시스템 (PR #4~#6)

- 테스트 = `_pages/tests/*.md`의 front matter 데이터뿐입니다. HTML이나 JS를
  건드리지 않고 CMS **테스트** 메뉴에서 만들고 고칩니다.
- 구조: 두 축(a, b), 질문마다 한 축에 점수(질문 내 최고점으로 나눠 0~1),
  축별 0~100 → 두 축 모두 35~65면 `middle`, 아니면 `low/high-low/high` 사분면.
- 현재 테스트 4종: AI 에이전트(`/ai-agent-test/`), 투자(`/investment-test/`),
  디지털 자산 신뢰(`/web3-trust-test/`), 기획 사고(`/planning-test/`).
- 테스트 페이지는 `_config.yml` 기본값으로 `layout: quiz`,
  `nav_parent: /tests/`, `classes: [wide, layout--single]`를 받습니다
  (`layout--single` 클래스가 빠지면 좌우 여백이 16px 생김).

## 2. 설치한 스킬 (`.claude/skills/`, 새 세션에서 자동 로드)

| 스킬 | 출처 | 용도 | 이번에 쓴 곳 |
| --- | --- | --- | --- |
| apple-design | emilkowalski/skills | 애플식 인터페이스·모션 원칙 | 디자인 방향, 메뉴, 타일 |
| emil-design-eng | emilkowalski/skills | UI 완성도, 컴포넌트 디테일 | 모션, 버튼 |
| animate | emilkowalski/skills | 애니메이션 설계·구현 | 메뉴 시트, 페이지 전환 |
| review-animations | emilkowalski/skills | 기존 모션 검토 | 모션 검토 |
| improve-animations | emilkowalski/skills | 모션 전체 감사 계획 | (진단 단계) |
| find-animation-opportunities | emilkowalski/skills | 모션이 필요한 곳 찾기 | (진단 단계) |
| animation-vocabulary | emilkowalski/skills | 모션 효과 이름 사전 | 참고용 |
| pick-ui-library | emilkowalski/skills | UI 라이브러리 선택 | 미사용 |
| prototype | emilkowalski/skills | 빠른 프로토타입 | 미사용 |
| mobile-native | emilkowalski/skills | 모바일 웹을 앱처럼 | 모바일 메뉴, 탭 영역 |
| design-taste-frontend | Leonxlnx/taste-skill | 템플릿 같지 않은 디자인 | 홈 구성, 아카이브 |
| impeccable | pbakaus/impeccable | 디자인 감사·타이포·접근성 | 타이포, 검토 |

- 설치 명령: `npx skills@latest add <repo> --skill <이름> --agent claude-code --yes --copy`
  (버전 고정은 `skills-lock.json`).
- `impeccable`은 공식 설치 명령(`npx impeccable install`)이 `impeccable.style`
  다운로드를 쓰는데, 웹 환경에서는 차단되어 `npx skills add pbakaus/impeccable`로
  설치했습니다. 이 경로로는 훅 등 부가 기능이 빠질 수 있습니다.

## 3. MCP 서버 (`.mcp.json`, 프로젝트 범위)

| 서버 | 명령 | 상태 |
| --- | --- | --- |
| playwright | `npx @playwright/mcp@latest` | 동작 |
| chrome-devtools | `npx chrome-devtools-mcp@latest` | 동작 |
| glif | `https://glif.app/api/mcp` (HTTP) | 웹 환경 네트워크 정책으로 연결 실패. 로컬이나 허용 도메인 추가 시 사용 가능 |

- 웹 세션에는 GitHub MCP(PR 생성·병합·CI 조회)와 원격 세션 도구(예약 확인,
  PR 알림 구독)도 연결되어 있어, 이번 작업의 PR과 배포 확인은 모두 이 도구로
  했습니다.

## 4. 검증 도구와 사용법

| 도구 | 명령 | 잡는 것 |
| --- | --- | --- |
| 정적 점검 | `bundle exec ruby scripts/doctor.rb` | front matter, 파일명 날짜, 공개되면 안 되는 파일, 핵심 CSS 최신 여부 |
| 전체 진단 | `scripts/debug.sh --throttle` | 가로 넘침, 44px 탭 영역, 접근성(axe), CLS·INP·LCP, 화면 회귀 |
| 기준 화면 갱신 | `scripts/debug.sh --throttle --update-baseline` | 의도한 디자인 변경 후 |
| 핵심 CSS 재생성 | `npm run critical` (서버 필요) | 스타일 변경 후 필수 |
| Pages Sass 호환 | `scripts/pages-sass-check.rb` (사용법은 파일 머리말) | GitHub Pages(Ruby Sass 3.7.4)에서만 깨지는 문법 |
| 새 글 초안 | `npm run new -- <slug> --template <종류>` | 날짜·front matter 실수 방지 |

GitHub CI는 PR과 `main` push마다 정적 점검, 빌드, 자체 테스트, 진단을 돌립니다
(화면 회귀는 로컬 전용).

## 5. 배운 점 · 다음에 주의할 것

- **토큰 비용:** 첫 개편은 다중 에이전트 워크플로우(22개 에이전트)로 진행해
  신규 약 10M·캐시 읽기 약 5억 토큰(API 정가 환산 약 $200~230)이 들었습니다.
  이후 작업은 직접 진행해 훨씬 적게 들었습니다. 큰 작업도 먼저 직접 해 보고,
  워크플로우는 비용 추정과 함께 제안하는 쪽이 낫습니다.
- **배포 권한:** Claude가 스스로 `main`에 병합하는 예약은 권한 시스템이
  막습니다. 병합은 소유자의 "배포해"를 받은 뒤 바로 합니다.
- **Pages와 로컬 빌드 차이:** 로컬은 Dart Sass, Pages는 Ruby Sass입니다.
  스타일 변경 시 `pages-sass-check.rb`를 꼭 돌리세요.
- **자체 테스트의 시간 경계:** INP 자체 테스트가 CI에서 정확히 16ms로 한 번
  실패한 적이 있어 허용 범위를 넓혔습니다(PR #2).
- **CMS와 옛 글:** 날짜가 없는 글을 CMS로 저장하면 현재 시각으로 바뀌는
  문제가 있어, 22개 글에 파일명 날짜를 명시했습니다(URL·날짜 변화 없음 확인).

## 6. 남은 아이디어 (하지 않음)

- 글 안의 시리즈 이동 표시("원화 스테이블코인 심층분석 3/15 · 이전 · 다음")와
  시리즈 목록 페이지.
- Tech·SQL 카테고리 전용 목록 페이지.
- `analytics.html`과 `head/custom.html`에서 gtag가 두 번 로드되는 문제 정리.
- CI에 Pages Sass 점검과 다크 모드 접근성 점검 추가.
- 플랫폼별 대체 폰트 크기 보정(폰트 교체 흔들림을 0에 가깝게).
