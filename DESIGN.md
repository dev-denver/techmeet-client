---
name: TechMeet
description: 테크밋 소속 프리랜서 개발자를 위한 프로젝트 매칭 앱
colors:
  curated-ink: "oklch(0.21 0.006 285.885)"
  paper-white: "oklch(1 0 0)"
  desk-surface: "oklch(0.91 0.005 286)"
  ink: "oklch(0.141 0.005 285.823)"
  soft-ink: "oklch(0.552 0.016 285.938)"
  quiet-gray: "oklch(0.967 0.001 286.375)"
  hairline-tint: "oklch(0.975 0.001 286.375)"
  hairline: "oklch(0.92 0.004 286.32)"
  paper-white-ink: "oklch(0.985 0 0)"
  alert-red: "oklch(0.577 0.245 27.325)"
  status-success: "oklch(0.5 0.135 150)"
  status-info: "oklch(0.48 0.125 252)"
  status-warning: "oklch(0.56 0.15 72)"
  status-danger: "oklch(0.5 0.17 24)"
  status-neutral: "oklch(0.55 0.01 286)"
  status-purple: "oklch(0.5 0.13 300)"
typography:
  title:
    fontFamily: "Pretendard Variable, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Pretendard Variable, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Pretendard Variable, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  stat-value:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  micro:
    fontFamily: "Pretendard Variable, -apple-system, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
components:
  button-primary:
    backgroundColor: "{colors.curated-ink}"
    textColor: "{colors.paper-white-ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "oklch(0.21 0.006 285.885 / 0.9)"
  card:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  chip:
    backgroundColor: "{colors.quiet-gray}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
---

# Design System: TechMeet

## Overview

**Creative North Star: "The Curated Desk (엄선된 책상)"**

TechMeet client는 아무 정보나 쌓아 올린 게시판이 아니라, 테크밋이 미리 골라 정돈해 둔 책상 위에 프리랜서가 앉는 경험이다. 화면에 보이는 모든 프로젝트는 이미 한 번 걸러진 것이라는 신뢰가 디자인의 출발점이며, 그래서 이 시스템은 소리치지 않는다. 거의 무채색(zinc/neutral)에 가까운 팔레트, 절제된 그림자, 여백과 보더로만 위계를 만드는 태도는 우연이 아니라 "검증된 것만 보여준다"는 포지셔닝을 시각적으로 반복하는 의도된 선택이다.

밀도는 낮지 않다. 카드 하나에 상태·마감·기술스택·기간·근무형태·위치·인원까지 담기지만, 동일한 회색조 파운데이션 위에서 정보가 조용히 정렬되어 있어 "많지만 정돈되어 있다"는 인상을 준다. 색은 의미를 전달할 때만(상태 배지, 마감 임박, 매칭 성공) 등장하고, 그 외에는 무채색이 기본값이다.

**Key Characteristics:**
- 거의 무채색(zinc 계열) 파운데이션, 색은 의미 전달용으로만 사용
- 그림자 대신 border/hairline으로 표면을 구분하는 플랫한 위계
- 모바일 앱형 고정 폭(600px) 프레임, 상단 다크 히어로(`bg-primary`) + 하단 화이트 콘텐츠의 반복 구조
- pill/chip으로 메타데이터를 나열하는 정보 밀도형 카드

## Colors

전체적으로 채도가 매우 낮은 zinc/neutral 팔레트이며, 의미를 전달해야 하는 지점에서만 채도 있는 status 컬러가 등장한다. 브랜드 포인트 컬러(단일 액센트)는 의도적으로 두지 않는다 — "검증된 곳만 노출한다"는 클로즈드 플랫폼 포지셔닝을 색으로도 절제해서 표현한다는 확정된 방향이며, 개선이 필요한 결함이 아니다.

### Primary
- **Curated Ink** (`oklch(0.21 0.006 285.885)`): 상단 히어로 배경(`bg-primary`), primary 버튼, 강조 텍스트. 화면에서 가장 어두운 표면이자 유일한 "브랜드 톤".

### Neutral
- **Paper White** (`oklch(1 0 0)`): 카드/배경/팝오버 기본색.
- **Desk Surface** (`oklch(0.91 0.005 286)`): 페이지 바깥 배경(`--page-bg`). 카드가 놓이는 "책상 표면".
- **Ink** (`oklch(0.141 0.005 285.823)`): 본문 텍스트.
- **Soft Ink** (`oklch(0.552 0.016 285.938)`): 보조 텍스트(`text-muted-foreground`).
- **Quiet Gray** (`oklch(0.967 0.001 286.375)`): muted 배경, chip/pill 배경.
- **Hairline** (`oklch(0.92 0.004 286.32)`): border/input 기본선.

### Semantic (Status)
저채도 무채색 파운데이션 위에서 도드라져 보이도록, 상태 색은 기존 원색에 가까운 채도(chroma 0.17~0.2) 대신 톤을 낮춘 깊은 색(chroma 0.125~0.17, lightness 0.48~0.56)으로 통일했다. "검증된 것만 노출한다"는 절제된 톤에 맞춰 캔디 컬러가 아닌 잉크에 가까운 톤으로 상태를 전달하되, 흰 배경 대비 4.5:1 이상을 확보해 배지 텍스트·솔리드 버튼(흰 텍스트) 양쪽에서 모두 안전하다.
- **Verified Green** (`oklch(0.5 0.135 150)`, `status-success`): 매칭 성공, 승인, 투입 가능.
- **Info Blue** (`oklch(0.48 0.125 252)`, `status-info`): 안내성 정보, 투입 가능 예정.
- **Pending Amber** (`oklch(0.56 0.15 72)`, `status-warning`): 대기/검토 중. 기존 `oklch(0.75 0.15 80)`는 흰 배경 대비 2.26:1로 WCAG AA(4.5:1)를 충족하지 못해 조정.
- **Alert Red** (`oklch(0.5 0.17 24)`, `status-danger` / `oklch(0.577 0.245 27.325)` destructive): 마감 임박, 반려, 파괴적 액션, 투입 불가.
- **Neutral Status** (`oklch(0.55 0.01 286)`, `status-neutral`): 중립 상태.
- **Highlight Purple** (`oklch(0.5 0.13 300)`, `status-purple`): 기타 강조 상태.

### Named Rules
**The One Voice Rule.** 채도 있는 색은 오직 `--status-*` 시맨틱 토큰을 통해서만 등장한다. 장식 목적의 임의 색상 사용은 금지.

## Typography

**Body/Display Font:** Pretendard Variable (weight 45–920, 한글 최적화)
**Mono Font:** Geist Mono (통계 수치 등 tabular-nums 용도)

**Character:** 한글 가변 폰트 하나로 본문부터 제목까지 모두 소화하는 단일 패밀리 전략. 위계는 폰트가 아니라 굵기(weight)와 크기 단계로만 만든다.

### Hierarchy
- **Title** (700, `1rem`/16px, leading-snug): 섹션 헤더("내 신청 현황"), 카드 제목(프로젝트명), 히어로 인사말.
- **Body** (400, `0.875rem`/14px, leading-normal): 본문 설명, 목록 텍스트.
- **Label** (500, `0.75rem`/12px): 배지, chip, 보조 라벨, 타임스탬프.
- **Stat Value** (700, `1.25rem`/20px, mono, tabular-nums): 히어로 영역 통계 숫자(StatsGrid).
- **Micro** (500, `0.625rem`/10px): 필드 캡션(폼 소항목 라벨), 알림 타임스탬프, 초소형 배지 텍스트처럼 Label보다 한 단계 더 보조적인 텍스트. 앱 전역(BasicInfoTab, SkillTab, notifications, StatsGrid의 `labelSize="10px"` 등)에 이미 일관되게 쓰이던 5번째 스텝을 문서화한 것 — 새로 도입한 크기가 아니다. 본문 대비 대비가 낮은 자리(어두운 히어로 위 `/50` 텍스트 등)에서는 남용하지 않는다.

### Named Rules
**The Two-Weight Rule.** 위계는 `text-xs`~`text-lg` 좁은 크기 범위 안에서 굵기(regular/semibold/bold) 차이로만 표현한다. 큰 디스플레이 사이즈(2xl 이상)는 쓰지 않는다.

## Layout

`max-w-[600px] mx-auto` 고정 폭 모바일 앱 셸이 모든 레이아웃의 기준이다. 데스크톱에서도 늘어나지 않고 중앙 정렬된 앱 프레임으로 보인다. 콘텐츠는 `px-4`(16px) 또는 `px-5`(20px) 좌우 여백 그리드를 따르고, 섹션은 `border-b`로 구분한다(카드 자체 그림자보다 구분선이 우선). 리스트 아이템 간격은 `space-y-3`(12px), 인라인 요소 간격은 `gap-1.5`~`gap-2`(6–8px)가 반복된다.

## Elevation & Depth

플랫 우선(flat-by-default) 시스템이다. 카드에 `shadow` 유틸리티가 존재하긴 하지만(shadcn 기본값) 실제 페이지에서는 `border` + 배경색 차이로 표면을 구분하는 방식이 압도적으로 많이 쓰인다. 별도의 layered/lifted 그림자 언어는 없다.

### Named Rules
**The Border-Over-Shadow Rule.** 표면 구분은 그림자가 아니라 hairline border(`border-border`)와 배경 대비(`bg-card` vs `bg-muted/50`)로 만든다. 그림자는 바텀시트/토스트처럼 화면 위로 떠오르는 오버레이에서만 의미가 있다.

## Shapes

라운드는 `--radius: 0.625rem`(10px)을 기준으로 한 4단계 스케일(`sm` 6px / `md` 8px / `lg` 10px / `xl` 14px)과, chip/pill에 쓰이는 `rounded-full`이 함께 쓰인다. 버튼·입력은 `md`, 카드는 `xl`, 배지/필은 `full`이 기본값이다. 보더는 항상 1px hairline.

## Components

### Buttons
- **Shape:** `rounded-md`(8px)
- **Primary:** `bg-primary`(Curated Ink) 배경 + `text-primary-foreground`, `h-9 px-4 py-2`
- **Hover:** `bg-primary/90` — 불투명도만 살짝 낮추는 절제된 피드백, 스케일/그림자 변화 없음
- **Secondary/Outline/Ghost:** 배경 대신 border 또는 `hover:bg-accent`로만 구분되는 저채도 변형

### Chips / Pills (프로젝트 카드 메타데이터)
- **Style:** `bg-muted/50` 배경 + `border border-border` + `rounded-full`, 아이콘(14px lucide) + 12px 텍스트
- **State:** 마감 임박일 때만 `bg-status-danger/10 text-status-danger`로 색이 들어감; 그 외에는 전부 무채색

### Cards / Containers
- **Corner Style:** `rounded-xl`(14px)
- **Background:** `bg-card`(Paper White), border 1px hairline
- **Shadow Strategy:** 그림자 없음(Elevation 참조) — hover 시 `border-muted-foreground/40`로만 반응
- **Internal Padding:** `px-4 pt-4 pb-4`, 내부 요소는 `space-y-3`

### Badges (상태 표시)
- **Style:** `rounded-md`, `px-2.5 py-0.5`, `text-xs font-semibold`
- **State:** variant(`default`/`secondary`/`destructive`/`outline`)로만 구분, 상태별 실제 색상은 `PROJECT_STATUS_CONFIG` 등 status.ts에서 주입

### Navigation (하단 탭 / 상단 바)
- **Style:** 아이콘 + 라벨 조합, 활성 항목은 `aria-current="page"` + 색상 대비로만 표시. 전환 애니메이션 없음.

## Do's and Don'ts

### Do:
- **Do** 색은 `--status-*` 토큰을 통해서만, 의미가 있을 때만 사용한다 (마감 임박, 매칭 성공, 승인 등).
- **Do** 표면 구분은 그림자보다 border와 배경 대비를 우선한다(The Border-Over-Shadow Rule).
- **Do** 위계는 크기보다 굵기 차이로 표현한다(The Two-Weight Rule).
- **Do** 모든 인증 페이지는 `max-w-[600px]` 고정 폭 프레임 안에서 구성한다.

### Don't:
- **Don't** 장식 목적의 그라디언트, 다채로운 브랜드 액센트 컬러를 새로 도입하지 않는다 — 무채색 기조는 의도된 절제이지 미완성이 아니다.
- **Don't** 카드/버튼에 큰 그림자나 확대(scale) 인터랙션을 추가해 "튀는" 느낌을 만들지 않는다.
- **Don't** 디스플레이급 큰 타이포(2xl 이상)로 임팩트를 주려 하지 않는다 — 위계는 굵기로 해결한다.
