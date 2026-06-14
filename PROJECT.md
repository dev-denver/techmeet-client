# 테크밋 프리랜서 앱 - 개발 문서

> 이 문서는 개발 환경이 바뀌어도 어디까지 개발됐는지 파악하고 이어서 개발할 수 있도록 작성된 문서입니다.
> 마지막 업데이트: 2026-06-12 (전체 품질 업그레이드: 유효성 검사·성능·UI/UX·유지보수성)

---

## 프로젝트 개요

테크밋 소속 **프리랜서 개발자 전용** 웹앱입니다.

- 관리자 기능은 별도 레포지토리에서 관리 (https://github.com/dev-denver/techmeet-admin)
- 카카오 로그인 전용 (이메일 로그인 보조 지원)
- 모바일 앱형 UI (max-w-[600px] 고정 폭, 반응형 없음)

---

## 기술 스택

| 항목      | 기술                         | 비고                       |
| --------- | ---------------------------- | -------------------------- |
| Framework | Next.js 16 (App Router)      |                            |
| Language  | TypeScript 5 strict          | any 타입 금지              |
| Styling   | Tailwind CSS v4 + shadcn/ui  | New York 스타일, Zinc 색상 |
| Database  | Supabase (PostgreSQL)        | RLS 적용 권장              |
| Auth      | Supabase Auth + 카카오 OAuth | magic link 방식 세션 생성  |
| 알림      | 카카오 알림톡 (미구현)       | TODO 항목                  |

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
│   │   ├── applications/           # 지원 관리 (GET, POST)
│   │   │   └── [id]/               # 지원 취소 (DELETE)
│   │   ├── profile/                # 프로필 조회/수정 (GET, PUT)
│   │   │   ├── availability/       # 투입 가능 상태 변경 (PUT)
│   │   │   ├── referrer/           # 추천인 등록 (POST)
│   │   │   │   ├── search/         # 추천인 검색 (GET, admin client)
│   │   │   │   └── lookup/         # 추천인 단건 조회 (GET)
│   │   │   ├── careers/            # 경력 목록/추가 (GET, POST)
│   │   │   │   └── [id]/           # 경력 수정/삭제 (PUT, DELETE)
│   │   │   ├── education/          # 학력 목록/추가 (GET, POST)
│   │   │   │   └── [id]/           # 학력 수정/삭제 (PUT, DELETE)
│   │   │   ├── certifications/     # 자격증 목록/추가 (GET, POST)
│   │   │   │   └── [id]/           # 자격증 수정/삭제 (PUT, DELETE)
│   │   │   └── skill-inventories/  # 스킬 인벤토리 목록/추가 (GET, POST)
│   │   │       └── [id]/           # 스킬 인벤토리 수정/삭제 (PUT, DELETE)
│   │   ├── projects/               # 프로젝트 목록 조회 (GET, page/pageSize/status 지원)
│   │   │   └── [id]/               # 프로젝트 상세 조회 (GET)
│   │   ├── notices/                # 공지사항 목록 조회 (GET)
│   │   ├── notifications/          # 알림톡 발송 이력 조회 (GET)
│   │   └── settings/notifications/ # 알림 설정 (GET, PUT)
│   ├── (auth)/                     # 인증된 사용자용 (TopBar + BottomNav)
│   │   ├── layout.tsx              # 고정 레이아웃
│   │   ├── page.tsx                # 홈 (/)
│   │   ├── notices/
│   │   │   └── [id]/page.tsx       # 공지사항 상세
│   │   ├── notifications/
│   │   │   └── page.tsx            # 알림 이력 (카카오 알림톡 발송 내역)
│   │   ├── projects/
│   │   │   ├── page.tsx            # 프로젝트 목록 (더보기 페이지네이션)
│   │   │   ├── [id]/page.tsx       # 프로젝트 상세 + 지원하기
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
│   ├── ui/                         # shadcn/ui 기반 + 공통 컴포넌트
│   │                               # 기본: badge, bottom-sheet, button, card, input, textarea, separator, skeleton
│   │                               # 공통: empty-state, error-message, page-hero, stats-grid, skeleton-patterns
│   ├── layout/                     # TopBar, BottomNavigation
│   └── features/
│       ├── projects/               # ProjectCard, ProjectStatusBadge, ApplicationCard,
│       │                           # ProjectListClient (더보기 페이지네이션), ProjectFilters,
│       │                           # ApplyButton (지원 폼 + BottomSheet), ShareButton (공유 링크 복사)
│       ├── profile/                # ProfileHeader, AvailabilityToggle,
│       │                           # TechStackSection, TechStackInput, CareerSection,
│       │                           # CareerSectionClient (CRUD), CareerTimelineDot,
│       │                           # ProfileTabsClient (탭: 기본정보/학력자격증/경력사항/스킬인벤토리)
│       │   └── tabs/               # EducationTab (학력+자격증 CRUD), SkillTab (스킬 인벤토리 CRUD), TabShared
│       ├── referrer/               # ReferrerSection, ReferrerSearchModal (BottomSheet)
│       └── settings/               # NotificationSettings, LogoutButton
├── lib/
│   ├── api/                        # API 관련 헬퍼
│   │   ├── client.ts               # 클라이언트용: apiFetch 래퍼, ApiError 클래스 (브라우저에서 import)
│   │   ├── server.ts               # 서버 전용: requireAuth(), parsePaginationParams() (API Route에서만 import)
│   │   ├── projects.ts             # projectsApi (getList, getById)
│   │   ├── applications.ts         # applicationsApi (getList, create, withdraw)
│   │   ├── profile.ts              # profileApi (get, update, updateAvailability, career CRUD)
│   │   ├── notices.ts              # noticesApi (getList)
│   │   ├── auth.ts                 # authApi (signup, login)
│   │   ├── settings.ts             # settingsApi (getNotifications, updateNotifications)
│   │   ├── notifications.ts        # notificationsApi (알림톡 발송 이력 조회)
│   │   └── index.ts                # re-export (client.ts 기반 함수만 포함, server.ts 제외)
│   ├── supabase/                   # Supabase 클라이언트 + 서버사이드 쿼리
│   │   ├── client.ts               # 브라우저용 클라이언트 (createClient)
│   │   ├── server.ts               # 서버용 클라이언트: createServerClient (세션), createAdminClient (RLS 우회)
│   │   └── queries/                # projects, applications, profile, notices
│   ├── kakao/                      # OAuth (구현됨), 알림톡 (미구현 스텁)
│   ├── config/env.ts               # 환경변수 타입 안전 접근
│   ├── constants/status.ts         # 상태 config (색상, 레이블) 중앙 관리
│   └── utils/                      # cn, format, validation
├── hooks/
│   └── useScrolled.ts              # main 엘리먼트 스크롤 감지
├── types/                          # TypeScript 타입 정의
│   ├── project.ts, user.ts, application.ts, notice.ts
│   ├── api.ts                      # API 요청/응답 타입
│   └── index.ts                    # re-export
├── middleware.ts                   # 인증 미들웨어 (탈퇴 회원 차단 포함)
└── public/
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

탈퇴 회원:
    → 미들웨어에서 profiles.account_status = 'withdrawn' 감지
    → /login?error=withdrawn 리다이렉트
```

### 레이아웃 구조

```
전체 화면
└── max-w-[600px] mx-auto (데스크탑에서 중앙 정렬)
    ├── TopBar (fixed top, h-14) - 페이지 타이틀, 뒤로가기, 스크롤시 햄버거
    ├── <main> (h-screen, overflow-y-auto, pt-14, pb-16) - 스크롤 컨텍스트
    └── BottomNavigation (fixed bottom, h-16) - 홈/프로젝트/내정보/설정
```

---

## 비즈니스 로직

### 투입 가능 상태

- `available` (투입 가능), `partial` (일부 가능), `unavailable` (투입 불가)
- 3단계 토글로 순환 변경
- 프리랜서가 직접 토글 → PUT /api/profile/availability → 즉시 저장
- 상태 색상: `src/lib/constants/status.ts`의 `AVAILABILITY_STATUS_CONFIG`, `AVAILABILITY_TOGGLE_CONFIG`

### 프로젝트 지원

- 모집중(`recruiting`) 상태일 때만 지원 버튼 활성화
- 지원 상태 플로우: 검토대기 → 검토중 → 면접예정 → 합격/불합격
- pending 상태에서만 회원이 직접 취소 가능 (status → 'withdrawn')

### 프로젝트 목록 페이지네이션

- 서버에서 첫 10개 SSR, 클라이언트에서 "더보기" 버튼으로 추가 로드
- 필터 변경 시 페이지 리셋 후 `/api/projects?status=&page=1&pageSize=10` 재호출
- `ProjectListClient`에서 누적 데이터 관리

### 알림

- 카카오 알림톡: 미구현 (`lib/kakao/alimtalk.ts` 스텁 상태)

### 회원 탈퇴 (소프트 탈퇴)

- `profiles.account_status = 'withdrawn'`, `withdrawn_at` 기록
- Supabase Auth 계정은 유지 (물리 삭제 아님)
- 탈퇴 후 30일 데이터 보관 (개인정보 처리방침 기준)
- 미들웨어에서 재로그인 시 `/login?error=withdrawn`으로 차단

---

## ✅ 완료된 기능

### 인증

- [x] 카카오 OAuth 로그인 (exchangeCodeForToken → magic link 세션)
- [x] 이메일/비밀번호 로그인
- [x] 카카오 신규 회원 → 회원가입 페이지 리다이렉트
- [x] Supabase Auth 미들웨어 (보호된 라우트 + 탈퇴 회원 차단)
- [x] 로그아웃
- [x] 회원가입 시 법적 동의 (이용약관, 개인정보처리방침, 마케팅, 만 14세)
- [x] 회원 탈퇴 (소프트 탈퇴, account_status 변경)
- [x] 이용약관 페이지 (/terms)
- [x] 개인정보 처리방침 페이지 (/privacy)

### 프로젝트

- [x] 프로젝트 목록 조회 (필터: 전체/모집중/진행중/완료)
- [x] 프로젝트 목록 페이지네이션 ("더보기", pageSize=10, 필터 연동)
- [x] 프로젝트 상세 페이지 (기본 정보, 기술 스택, 자격 요건, 마감일)
- [x] 프로젝트 상태 배지
- [x] 지원하기 폼 (cover_letter, expected_rate 입력 → POST /api/applications)

### 지원

- [x] 내 신청 내역 조회
- [x] 신청 상태별 정렬
- [x] ApplicationCard compact 모드 (홈 화면 수평 스크롤)
- [x] 지원 취소 (pending 상태에서 취소 버튼 → DELETE /api/applications/[id])

### 프로필

- [x] 프로필 헤더 (이름, 한줄소개, 경력연수)
- [x] 투입 가능 상태 토글 (PUT /api/profile/availability) - 3단계: 투입 가능 / 일부 가능 / 투입 불가
- [x] 기술 스택 표시
- [x] 경력 추가/수정/삭제 (CareerSectionClient, /api/profile/careers CRUD)
- [x] 자기 소개 표시
- [x] 내 정보 수정 (/settings/profile)
- [x] 프로필 탭 구조 (기본정보 / 학력·자격증 / 경력사항 / 스킬 인벤토리) — ProfileTabsClient
- [x] 학력 CRUD (EducationTab, /api/profile/education/ CRUD)
- [x] 자격증 CRUD (EducationTab 내 통합, /api/profile/certifications/ CRUD)
- [x] 스킬 인벤토리 CRUD (SkillTab, /api/profile/skill-inventories/ CRUD)
- [x] 계약 정보 (기본정보 하위 섹션, 2026-06-14): 계약형태(사업자/3.3%) 선택, 사업자 정보(사업자명/사업자번호/사업장주소/사업자등록증) + 계좌 정보(은행/계좌번호/계좌이미지) — 파일은 `contract-documents` 버킷에 즉시 업로드 (ContractDocumentField, /api/profile/contract-documents/[type])

### 설정

- [x] 계정 정보 표시 (이름, 이메일, 카카오 ID)
- [x] 알림 설정 토글 (GET/PUT /api/settings/notifications)
- [x] 내 정보 수정 링크
- [x] 개인정보 처리방침 / 이용약관 링크
- [x] 회원 탈퇴 UI 및 API
- [x] 추천인 등록 (미등록 시 등록 버튼 → 모달, 등록 후 이름 read-only 표시)
- [x] 비밀번호 변경 (/settings/password)

### 추천인

- [x] 회원가입 시 추천인 선택 (선택 사항, 이름/전화번호 검색)
- [x] 설정 페이지에서 추후 등록 가능 (미등록 시)
- [x] 추천인 1명 제한, 등록 후 클라이언트 변경 불가 (관리자만 변경)
- [x] 전화번호 마스킹 (010-\*\*\*\*-5678)
- [x] API: GET /api/profile/referrer/search, POST /api/profile/referrer

### 알림

- [x] 알림 이력 페이지 (/notifications) — 카카오 알림톡 발송 내역, 상태 배지(발송 완료/실패/처리중), 서비스 유형 아이콘(프로젝트/공지/개별)
- [x] GET /api/notifications — alimtalk_logs 조회 (graceful fallback 적용)

### 홈

- [x] 인사 배너 (이름, 투입 가능 상태 배지)
- [x] 내 신청 현황 (최근 3건, 전체보기 링크)
- [x] 최근 프로젝트 (모집중 3건, 전체보기 링크)
- [x] 공지사항 목록 (중요 표시 포함)
- [x] 공지사항 상세 페이지 (/notices/[id])

### UI/UX

- [x] TopBar (뒤로가기, 스크롤 시 햄버거 메뉴)
- [x] BottomNavigation (홈/프로젝트/내정보/설정)
- [x] 모든 (auth) 페이지 로딩 스켈레톤 (loading.tsx)
- [x] 모바일 고정 폭 (max-w-[600px])
- [x] 수평 스크롤 (-mx-4 px-4 + scrollbar-none) 패턴
- [x] 글로벌 에러 바운더리 (auth)/error.tsx — 페이지 렌더링 실패 시 재시도 UI

### 코드 품질 고도화 (2026-05-05)

- [x] API 유효성 검사 강화: PUT /api/profile (이름 50자·phone·birthDate·experienceMonths·gender)
- [x] API 유효성 검사 강화: POST/PUT /api/profile/careers (길이·날짜 역전)
- [x] API 유효성 검사 강화: POST /api/applications (coverLetter 20자·expectedRate 1~9999)
- [x] API 유효성 검사 강화: education·skill-inventories (길이·날짜 역전)
- [x] GET /api/projects page/pageSize 범위 방어 (Math.min/max)
- [x] 클라이언트 글자 수 카운터: 이름 (50자), 자기소개 (500자)
- [x] 주요 복잡 로직에 개발자 주석 추가 (KakaoAddressInput, RSA, proxy, profile queries 등)
- [x] 홈·신청내역·알림 페이지 — 개별 데이터 로드 실패 시 graceful fallback 처리

### 코드 최적화 리팩토링 (2026-05-31)

- [x] `requireAuth()` 헬퍼 추출 — 13개 보호된 API route의 인증 3-liner 공통화 (`lib/api/server.ts`)
- [x] `parsePaginationParams()` 추출 — projects·notifications route 파라미터 파싱 일관화
- [x] `createAdminClient()` 추출 — referrer lookup/search의 인라인 admin 클라이언트 생성 공통화
- [x] `maskPhone()`, `UUID_REGEX` 중복 제거 — format.ts / validation.ts로 이동
- [x] 공통 UI 컴포넌트 추가: `EmptyState`, `ErrorMessage`, `PageHero`, `StatsGrid`, `SkeletonCard/SkeletonBadgeRow/SkeletonSectionHeader`
- [x] 접근성 개선: BottomNavigation `aria-current`, DateSelectPicker/MonthYearPicker `focus-visible`, SaveButton `aria-busy`

### 전체 품질 업그레이드 (2026-06-12)

**유효성 검사·로직 보완**

- [x] `lib/constants/limits.ts` 신규 — 길이/범위 제한 상수 `LIMITS` 중앙 관리
- [x] `validateLength`, `validateStringArray` 헬퍼 추가 (`lib/utils/validation.ts`)
- [x] POST /api/auth/signup — 이름 길이(≤50) 검증, `referrer_id` UUID 검증
- [x] PUT /api/profile — bio/affiliation/department/positionTitle/militaryService/address 길이 검증, experienceYears 0~50 정수 검증, gender enum 검증(Set 기반), joiningDate 날짜 검증, techStack 배열 검증
- [x] careers POST/PUT — description/techStack 검증 + **POST 라우트에 누락되어 있던 `requireAuth()` 추가 (보안 결함 수정)**
- [x] education/certifications/skill-inventories — 요청 바디 타입 지정(`Partial<...Request>`), 길이/배열 검증 추가
- [x] 모든 `[id]` 라우트에 `UUID_REGEX` 검증 추가 (careers/education/certifications/skill-inventories/applications/resumes)
- [x] 검색어 길이 상한: `/api/projects` search, `/api/profile/referrer/search` q (`LIMITS.SEARCH_MAX`)
- [x] 로그인 페이지 이메일 입력 `maxLength` 적용

**성능 최적화**

- [x] `getProfile()` — referrer 순차 조회 제거, `referrer:referrer_id(name)` self-join embed로 통합
- [x] 프로젝트 상세 페이지 — 중복 `auth.getUser()` 호출 제거 (profileResult 재사용)
- [x] 스킬 매칭 2중 순회 제거 — `getMatchedSkillSet()` (`lib/utils/skills.ts`)로 단일 Set 계산
- [x] `ProjectListClient` — fetch 실패 시 loadError 표시 + 요청 시퀀스 ref로 stale 응답 무시
- [x] `getRecentProjects()` — localStorage 접근 try-catch (프라이빗 모드 SecurityError 대응)
- [x] `getProjects`/`getNotices`/`getProfileResumes` — select 컬럼 명시화 (Row 인터페이스와 1:1)

**UI/UX 개선**

- [x] `ConfirmSheet` 신규 — EducationTab/SkillTab의 `confirm()` 대체
- [x] `ToastProvider`/`useToast` 신규 — CRUD 성공 시 토스트 피드백 (EducationTab/SkillTab/CareerSectionClient/ProfileTabsClient)
- [x] ProfileTabsClient 투입 상태 저장 — 침묵 실패 제거, 에러 토스트 + `profileApi` 이관
- [x] 터치 타깃·focus-visible 보강: TopBar 뒤로가기/알림 버튼, TabShared 수정/삭제 버튼, CareerSectionClient 아이콘 버튼, BottomNavigation, DashedAddButton 등
- [x] 시맨틱 색상 토큰 표준화: (auth)/error.tsx, login, withdraw, ProfileBasicForm — raw `red-*`/`zinc-*` → `destructive`/`foreground`/`muted-foreground` (카카오 브랜드색 `#FEE500`는 유지)

**유지보수성**

- [x] `useSubmit` 훅 신규 — 폼 제출 isLoading/error 처리 공통화
- [x] raw fetch → `*Api` + `useSubmit` 이관: EducationTab, SkillTab, CareerSectionClient, ApplyButton, ApplicationCard, ProfileBasicForm, ProfileTabsClient
- [x] 대형 파일 분리: CareerSectionClient → `CareerForm.tsx` 분리, ProfileTabsClient → `BasicInfoTab.tsx` 분리 (로직 변경 없음)
- [x] `PullToRefresh` — non-null assertion(`main!`) 제거
- [x] CLAUDE.md/PROJECT.md `max-w-[430px]` → `600px` 표기 정정, BottomSheet 기본폭(sm=430px) 안내 추가, 폼 제출 패턴(useSubmit) 문서화
- [x] `apiFetch`/`ApiError` 확장 — `code` 필드(탈퇴 계정 등 에러 코드 식별) + `FormData` 바디 지원(Content-Type 강제 지정 안 함)
- [x] `authApi` 신규 — `signup`/`login`/`logout`/`withdraw`/`getPublicKey` (타입 불일치였던 `SignupRequest`/`LoginRequest`를 실제 요청 바디에 맞게 수정)
- [x] `profileApi` 확장 — `searchReferrer`/`lookupReferrer`/`setReferrer`/`uploadResume`/`deleteResume`
- [x] raw fetch → `*Api` + `useSubmit`/`useToast` 이관 (후속): NotificationSettings, ReferrerSection, ReferrerSearchModal, LogoutButton
- [x] ResumeTab — FormData 업로드/삭제를 `profileApi.uploadResume`/`deleteResume` + `ApiError`로 이관
- [x] SignupForm/login/withdraw — public-key 조회, 추천인 lookup, 회원가입/로그인/탈퇴를 `authApi`/`profileApi`로 이관 (탈퇴 계정 로그인 시 `code` 기반 안내 메시지 처리)

### 비밀번호 변경 (2026-06-12)

- [x] PUT /api/auth/password 신규 — `requireAuth()` + `createAdminClient()`로 현재 비밀번호 검증(`signInWithPassword`) 후 `auth.admin.updateUserById`로 변경 (세션 쿠키 영향 없음)
- [x] `authApi.changePassword()` 추가, `ChangePasswordRequest` 타입 추가
- [x] `/settings/password` 페이지 신규 — 현재/새/새 비밀번호 확인 입력, `PasswordStrength`(SignupForm에서 공유 컴포넌트로 분리) 표시, RSA 암호화 후 제출
- [x] TopBar `pageTitles`/`isDetailPage`에 `/settings/password` 추가, 설정 페이지에 "비밀번호 변경" 링크 추가
- [x] `Switch` 컴포넌트 신규 (`components/ui/switch.tsx`) — NotificationSettings의 로컬 `Toggle`을 공통화

---

## 🔧 TODO

### 높은 우선순위

- [ ] **카카오 알림톡 연동**: `lib/kakao/alimtalk.ts` 현재 console.log 스텁 상태
  - 알림톡 API 제공사 계약 필요 (센트온)
  - 신규 프로젝트 등록 시 → 대상 프리랜서 전체 발송
  - 지원 상태 변경 시 → 해당 프리랜서에게 발송
- [ ] **DB 마이그레이션 수동 적용 필요**: `supabase/migrations/20260614120000_profile-contract-info.sql`
  - `profiles` 테이블에 계약 정보 컬럼 10개 추가 + `contract-documents` storage 버킷/정책 생성
  - 적용 전까지 계약 정보 섹션 저장/파일 업로드 동작 안 함 (Supabase CLI `supabase db push` 또는 대시보드 SQL Editor에서 실행)

---

## DB 주요 테이블

- `profiles` — 프리랜서 프로필 (account_status, withdrawn_at, referrer_id 포함)
- `careers` — 경력 (is_current, tech_stack 포함)
- `projects` — 프로젝트 (admin 관리, client 읽기 전용)
- `notices` — 공지사항 (notice_type: immediate/scheduled, start_at/end_at, attachments jsonb 포함)
- `applications` — 지원 내역 (available_start_date·admin_memo는 admin 전용 컬럼)
- `admin_users` — 관리자 계정 (service_role 전용)
- `alimtalk_templates` + `alimtalk_logs` — 알림톡 서식·발송 이력 (service_role 전용)
- `admin_audit_logs` — 관리자 감사 로그 (service_role 전용)

전체 DDL: `sql/techmeet-client-admin.sql`

---

## 개발 시 주의사항

1. **컴포넌트 상태 관리**: Server Component 기본, 인터랙션 필요 시만 `'use client'`
2. **상태 색상**: `src/lib/constants/status.ts`에서만 관리, 컴포넌트에서 로컬 정의 금지
3. **타입 안전**: `any` 타입 금지, `unknown` 후 타입 가드 사용
4. **스크롤 감지**: `window`가 아닌 `<main>` 엘리먼트 기준 (`useScrolled` 훅)
5. **공개 경로**: `/terms`, `/privacy`는 미들웨어에서 인증 없이 접근 가능
6. **API Route 인증**: 모든 인증 필요 API route에서 `requireAuth()` (`lib/api/server.ts`) 사용 — 직접 `createServerClient().auth.getUser()` 패턴 사용 금지
7. **BottomSheet 사용**: 하단 모달 패턴은 `components/ui/bottom-sheet.tsx` 공통 컴포넌트 사용
8. **focus-visible**: 커스텀 input/button에 `focus-visible:` 접두사 사용 (`focus:` 금지)
9. **클라이언트 API 호출**: `lib/api/` 모듈의 `*Api` 객체 사용 (apiFetch 직접 호출 금지)

---

## 개발 명령어

```bash
npm run dev     # 개발 서버 (포트 3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```
