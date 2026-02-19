# 테크밋 프리랜서 앱 - 개발 문서

> 이 문서는 개발 환경이 바뀌어도 어디까지 개발됐는지 파악하고 이어서 개발할 수 있도록 작성된 문서입니다.
> 마지막 업데이트: 2026-02-19

---

## 프로젝트 개요

테크밋 소속 **프리랜서 개발자 전용** 웹앱입니다.
- 관리자 기능은 별도 레포지토리에서 관리
- 카카오 로그인 전용 (이메일 로그인 보조 지원)
- 모바일 앱형 UI (max-w-[430px] 고정 폭, 반응형 없음)

---

## 기술 스택

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 16 (App Router) | |
| Language | TypeScript 5 strict | any 타입 금지 |
| Styling | Tailwind CSS v4 + shadcn/ui | New York 스타일, Zinc 색상 |
| Database | Supabase (PostgreSQL) | RLS 적용 권장 |
| Auth | Supabase Auth + 카카오 OAuth | magic link 방식 세션 생성 |
| 알림 | 카카오 알림톡 | 미구현 (TODO) |

---

## 아키텍처

### 디렉토리 구조

```
src/
├── app/
│   ├── api/                        # API 라우트 (서버)
│   │   ├── auth/
│   │   │   ├── kakao/callback/     # 카카오 OAuth 콜백
│   │   │   ├── login/              # 이메일 로그인
│   │   │   ├── logout/             # 로그아웃
│   │   │   ├── signup/             # 회원가입
│   │   │   └── withdraw/           # 회원탈퇴 (소프트 탈퇴)
│   │   ├── applications/           # 지원 관리 (GET, POST, DELETE)
│   │   ├── profile/                # 프로필 관리 (GET, PUT)
│   │   │   ├── availability/       # 투입 가능 상태 변경 (PUT)
│   │   │   └── careers/            # 경력 관리 (POST, PUT, DELETE)
│   │   ├── projects/               # 프로젝트 조회 (GET)
│   │   ├── notices/                # 공지사항 조회 (GET)
│   │   └── settings/notifications/ # 알림 설정 (GET, PUT)
│   ├── (auth)/                     # 인증된 사용자용 (TopBar + BottomNav)
│   │   ├── layout.tsx              # 고정 레이아웃
│   │   ├── page.tsx                # 홈 (/)
│   │   ├── projects/
│   │   │   ├── page.tsx            # 프로젝트 목록
│   │   │   ├── [id]/page.tsx       # 프로젝트 상세
│   │   │   └── applications/page.tsx # 내 신청 내역
│   │   ├── profile/page.tsx        # 내 정보
│   │   └── settings/
│   │       ├── page.tsx            # 설정
│   │       ├── profile/page.tsx    # 내 정보 수정
│   │       └── withdraw/page.tsx   # 회원 탈퇴
│   ├── login/page.tsx              # 로그인 (TopBar/BottomNav 없음)
│   ├── signup/page.tsx             # 회원가입 (TopBar/BottomNav 없음)
│   ├── terms/page.tsx              # 이용약관 (공개)
│   └── privacy/page.tsx           # 개인정보 처리방침 (공개)
├── components/
│   ├── ui/                         # shadcn/ui 기반 (avatar, badge, button, card, separator, skeleton)
│   ├── layout/                     # TopBar, BottomNavigation
│   └── features/
│       ├── projects/               # ProjectCard, ProjectStatusBadge, ApplicationCard, ProjectListClient, ProjectFilters
│       ├── profile/                # ProfileHeader, AvailabilityToggle, TechStackSection, CareerSection
│       └── settings/               # NotificationSettings, LogoutButton
├── lib/
│   ├── api/                        # 클라이언트 API 래퍼 함수 (apiFetch)
│   ├── supabase/                   # Supabase 클라이언트 + 서버사이드 쿼리
│   │   └── queries/                # projects, applications, profile, notices
│   ├── kakao/                      # OAuth (구현됨), 알림톡 (미구현)
│   ├── config/env.ts               # 환경변수 타입 안전 접근
│   ├── constants/status.ts         # 상태 config (색상, 레이블) 중앙 관리
│   └── utils/                      # cn, format, validation
├── hooks/
│   └── useScrolled.ts              # main 엘리먼트 스크롤 감지
├── types/                          # TypeScript 타입 정의
└── middleware.ts                   # 인증 미들웨어
```

### 인증 플로우

```
카카오 로그인 버튼 클릭
    → kakao.com/oauth/authorize
    → /api/auth/kakao/callback?code=...
    → exchangeCodeForToken(code) → kakao access token
    → getKakaoUserInfo(accessToken) → { email, name, kakaoId }

기존 회원:
    → supabase.auth.admin.generateLink (magic link)
    → supabase.auth.verifyOtp (OTP 교환 → session 생성)
    → 홈(/) 리다이렉트

신규 회원:
    → /signup?email=...&name=...&kakao_id=...
    → 회원가입 폼 입력 (비밀번호, 생년월일, 전화번호, 약관 동의)
    → POST /api/auth/signup
    → supabase.auth.signUp
    → profiles 테이블 업데이트 (phone, kakao_id, notification_marketing, account_status)
    → 홈(/) 리다이렉트
```

### 레이아웃 구조

```
전체 화면
└── max-w-[430px] mx-auto (데스크탑에서 중앙 정렬)
    ├── TopBar (fixed top, h-14) - 페이지 타이틀, 뒤로가기, 스크롤시 햄버거
    ├── <main> (h-screen, overflow-y-auto, pt-14, pb-16) - 스크롤 컨텍스트
    └── BottomNavigation (fixed bottom, h-16) - 홈/프로젝트/내정보/설정
```

---

## 데이터베이스 스키마 (Supabase)

### profiles 테이블
```sql
id                        uuid (auth.users.id FK)
name                      text
email                     text
phone                     text
avatar_url                text
headline                  text
bio                       text
tech_stack                text[]
availability_status       text ('available' | 'partial' | 'unavailable')
experience_years          int
kakao_id                  text
notification_new_project  boolean (default: true)
notification_application_update boolean (default: true)
notification_marketing    boolean (default: false)
account_status            text (default: 'active') -- 'active' | 'withdrawn'
withdrawn_at              timestamptz
created_at                timestamptz
updated_at                timestamptz
```

### careers 테이블
```sql
id            uuid
profile_id    uuid (profiles.id FK)
company       text
role          text
start_date    date
end_date      date
is_current    boolean
description   text
tech_stack    text[]
```

### projects 테이블
```sql
id                  uuid
title               text
description         text
client_name         text
project_type        text
work_type           text ('remote' | 'onsite' | 'hybrid')
status              text ('recruiting' | 'in_progress' | 'completed' | 'cancelled')
tech_stack          text[]
budget_min          int
budget_max          int
duration_start_date date
duration_end_date   date
deadline            date
headcount           int
location            text
requirements        text[]
created_at          timestamptz
updated_at          timestamptz
```

### applications 테이블
```sql
id             uuid
project_id     uuid (projects.id FK)
freelancer_id  uuid (profiles.id FK)
status         text ('pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'withdrawn')
cover_letter   text
expected_rate  int
applied_at     timestamptz
updated_at     timestamptz
```

### notices 테이블
```sql
id           uuid
title        text
content      text
is_important boolean
created_at   timestamptz
```

---

## 비즈니스 로직

### 투입 가능 상태
- `available` (투입 가능), `partial` (일부 가능), `unavailable` (투입 불가)
- 프리랜서가 직접 토글 → API로 즉시 저장 → 매니저 화면에 반영
- 상태 색상: 가능=초록, 일부=노랑, 불가=빨강

### 프로젝트 지원
- 모집중 상태일 때만 지원 버튼 활성화
- 지원 상태 플로우: 검토대기 → 검토중 → 면접예정 → 합격/불합격
- 회원이 직접 취소 가능 (withdrawn)

### 알림 설정
- 신규 프로젝트 알림, 신청 상태 변경 알림, 마케팅 알림
- 카카오 알림톡으로 발송 예정 (현재 미구현)
- 마케팅 수신 동의는 회원가입 시 선택 동의 → DB 저장

### 회원 탈퇴 (소프트 탈퇴)
- `profiles.account_status = 'withdrawn'`, `withdrawn_at` 기록
- Supabase Auth 계정은 유지 (물리 삭제 아님)
- 탈퇴 후 30일 데이터 보관 (개인정보 처리방침 기준)

---

## ✅ 완료된 기능

### 인증
- [x] 카카오 OAuth 로그인 (exchangeCodeForToken → getKakaoUserInfo → magic link 세션)
- [x] 이메일/비밀번호 로그인
- [x] 카카오 신규 회원 → 회원가입 페이지 리다이렉트
- [x] Supabase Auth 미들웨어 (보호된 라우트 처리)
- [x] 로그아웃
- [x] 회원가입 시 법적 동의 (이용약관, 개인정보처리방침, 마케팅, 만 14세 확인)
- [x] 이용약관 페이지 (/terms)
- [x] 개인정보 처리방침 페이지 (/privacy)
- [x] 회원 탈퇴 (소프트 탈퇴, account_status 변경)

### 프로젝트
- [x] 프로젝트 목록 조회 (필터: 전체/모집중/진행중/완료)
- [x] 프로젝트 상세 페이지
- [x] 프로젝트 상태 배지

### 지원
- [x] 내 신청 내역 조회
- [x] 신청 상태별 정렬

### 프로필
- [x] 프로필 헤더 (이름, 한줄소개, 경력연수)
- [x] 투입 가능 상태 토글 (API 연동 완료)
- [x] 기술 스택 표시
- [x] 경력 타임라인 표시
- [x] 내 정보 수정 (/settings/profile)

### 설정
- [x] 알림 설정 토글 (API 연동 완료)
- [x] 내 정보 수정 링크
- [x] 회원 탈퇴 UI 및 API

### UI/UX
- [x] TopBar (뒤로가기, 스크롤 시 햄버거 메뉴)
- [x] BottomNavigation (홈/프로젝트/내정보/설정)
- [x] 모든 페이지 로딩 스켈레톤 (loading.tsx)
- [x] 모바일 고정 폭 (max-w-[430px])

---

## 🔧 진행해야 할 기능 (TODO)

### 높은 우선순위

- [ ] **지원하기 기능 완성**: 프로젝트 상세 페이지에서 실제로 지원 폼 제출 (cover_letter, expected_rate 입력)
- [ ] **카카오 알림톡 연동**: `lib/kakao/alimtalk.ts` 구현 필요
  - 신규 프로젝트 등록 시 → 대상 프리랜서 전체 알림톡 발송
  - 지원 상태 변경 시 → 해당 프리랜서에게 알림톡 발송
  - 알림톡 API 제공사 선택 필요 (솔라피, 카카오 비즈니스, 쿨SMS 등)
- [ ] **경력 추가/수정/삭제 UI**: CareerSection에 편집 기능 없음, 현재 DB에만 API 존재
- [ ] **지원 취소 기능**: ApplicationCard에 취소 버튼 추가 (withdraw API는 구현됨)
- [ ] **탈퇴 회원 미들웨어 처리**: account_status = 'withdrawn'인 경우 로그인 차단 또는 안내 페이지

### 중간 우선순위

- [ ] **공지사항 상세 페이지**: 현재 목록에서 내용을 카드에 표시하지만 상세 페이지 없음
- [ ] **프로필 사진 업로드**: Supabase Storage 연동 필요
- [ ] **프로젝트 무한 스크롤/페이지네이션**: 현재 pageSize=20 고정 (전체 로드)
- [ ] **비밀번호 변경**: 설정에서 비밀번호 변경 기능

### 낮은 우선순위

- [ ] **다크 모드 토글**: globals.css에 `.dark` CSS 변수 정의됨, UI 미구현
- [ ] **푸시 알림 (PWA)**: Web Push 알림 추가 고려
- [ ] **에러 바운더리**: 페이지별 error.tsx 추가

---

## 환경변수 목록

`.env.local`에 설정 필요:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Kakao OAuth
NEXT_PUBLIC_KAKAO_REST_API_KEY=
NEXT_PUBLIC_KAKAO_REDIRECT_URI=
KAKAO_REST_API_KEY=
KAKAO_REDIRECT_URI=

# Kakao 알림톡 (미사용 중)
KAKAO_ALIMTALK_APP_KEY=
KAKAO_ALIMTALK_SENDER_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=development
```

---

## 개발 시 주의사항

1. **컴포넌트 상태 관리**: Server Component 기본, 인터랙션 필요 시만 `'use client'`
2. **상태 색상**: `src/lib/constants/status.ts`에서만 관리, 컴포넌트에서 로컬 정의 금지
3. **타입 안전**: `any` 타입 금지, `unknown` 후 타입 가드 사용
4. **스크롤 감지**: `window`가 아닌 `<main>` 엘리먼트 기준 (`useScrolled` 훅)
5. **공개 경로**: `/terms`, `/privacy` 는 미들웨어에서 인증 없이 접근 가능

---

## 개발 명령어

```bash
npm run dev     # 개발 서버 (포트 3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```
