# 테크밋 프리랜서 앱 - 프로젝트 레퍼런스

> 완성된 기능과 구조를 빠르게 파악할 수 있도록 작성된 문서입니다.
> 개발 규칙·아키텍처 기준은 `CLAUDE.md`를 확인하세요.

---

## 프로젝트 개요

테크밋 소속 **프리랜서 개발자 전용** 웹앱입니다.

- 관리자 기능은 별도 레포지토리에서 관리 (techmeet-admin)
- 카카오 OAuth 로그인 + 이메일/비밀번호 로그인 병행 지원
- 모바일 앱형 UI (max-w-[600px] 고정 폭, 반응형 없음)

---

## 기술 스택

| 항목      | 기술                         | 비고                        |
| --------- | ---------------------------- | --------------------------- |
| Framework | Next.js 16 (App Router)      |                             |
| Language  | TypeScript 5 strict          | any 타입 금지               |
| Styling   | Tailwind CSS v4 + shadcn/ui  | New York 스타일, Zinc 색상  |
| Database  | Supabase (PostgreSQL)        | RLS 적용                    |
| Auth      | Supabase Auth + 카카오 OAuth | magic link 방식 세션 생성   |
| 알림      | 카카오 알림톡                | stub 상태 (제공업체 계약 후 구현) |

---

## 아키텍처

### 디렉토리 구조

```
src/
├── proxy.ts                        # 개발 환경 카카오 OAuth 콜백 프록시
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── public-key/         # RSA 공개키 발급 (GET)
│   │   │   ├── login/              # 이메일 로그인 (POST)
│   │   │   ├── logout/             # 로그아웃 (POST)
│   │   │   ├── signup/             # 회원가입 (POST)
│   │   │   ├── password/           # 비밀번호 변경 (PUT)
│   │   │   ├── withdraw/           # 회원탈퇴 (POST)
│   │   │   └── kakao/callback/     # 카카오 OAuth 콜백 (GET)
│   │   ├── applications/           # 지원 목록/추가 (GET, POST)
│   │   │   └── [id]/               # 지원 취소 (DELETE)
│   │   ├── profile/                # 프로필 조회/수정 (GET, PUT)
│   │   │   ├── availability/       # 투입 가능 상태 변경 (PUT)
│   │   │   ├── referrer/           # 추천인 등록 (POST)
│   │   │   ├── careers/            # 경력 추가 (POST)
│   │   │   │   └── [id]/           # 경력 수정/삭제 (PUT, DELETE)
│   │   │   ├── education/          # 학력 추가 (POST)
│   │   │   │   └── [id]/           # 학력 수정/삭제 (PUT, DELETE)
│   │   │   ├── certifications/     # 자격증 추가 (POST)
│   │   │   │   └── [id]/           # 자격증 삭제 (DELETE)
│   │   │   ├── skill-inventories/  # 스킬 인벤토리 추가 (POST)
│   │   │   │   └── [id]/           # 스킬 수정/삭제 (PUT, DELETE)
│   │   │   ├── resumes/            # 이력서 업로드 (POST)
│   │   │   │   └── [id]/           # 이력서 삭제/다운로드 (DELETE, GET /download)
│   │   │   └── contract-documents/[type]/  # 계약 문서 업로드/삭제/다운로드
│   │   ├── projects/               # 프로젝트 목록 (GET, page/pageSize/status/search)
│   │   │   └── [id]/               # 프로젝트 상세 (GET)
│   │   ├── notices/                # 공지사항 목록 (GET)
│   │   ├── notifications/          # 알림톡 발송 이력 (GET)
│   │   └── settings/notifications/ # 알림 설정 조회/변경 (GET, PUT)
│   ├── (auth)/                     # 인증된 사용자용 (TopBar + BottomNav 레이아웃)
│   │   ├── layout.tsx
│   │   ├── error.tsx               # 글로벌 에러 바운더리
│   │   ├── page.tsx                # 홈 (/)
│   │   ├── projects/
│   │   │   ├── page.tsx            # 프로젝트 목록
│   │   │   ├── [id]/page.tsx       # 프로젝트 상세 + 지원하기
│   │   │   └── applications/page.tsx # 내 신청 내역
│   │   ├── profile/page.tsx        # 내 정보 (탭 5개)
│   │   ├── notifications/page.tsx  # 알림 이력
│   │   ├── notices/
│   │   │   ├── page.tsx            # 공지사항 목록
│   │   │   └── [id]/page.tsx       # 공지사항 상세
│   │   └── settings/
│   │       ├── page.tsx            # 설정
│   │       ├── profile/page.tsx    # 내 정보 수정
│   │       ├── password/page.tsx   # 비밀번호 변경
│   │       └── withdraw/page.tsx   # 회원 탈퇴
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── terms/page.tsx              # 이용약관 (공개)
│   └── privacy/page.tsx            # 개인정보 처리방침 (공개)
├── components/
│   ├── ui/                         # badge, bottom-sheet, button, card, confirm-sheet,
│   │                               # date-select-picker, empty-state, error-message, form-field,
│   │                               # input, month-year-picker, nav-link, page-hero, save-button,
│   │                               # separator, skeleton, skeleton-patterns, stats-grid,
│   │                               # switch, textarea, toast, back-button
│   ├── layout/                     # TopBar, BottomNavigation, PullToRefresh
│   └── features/
│       ├── projects/               # ProjectCard, ProjectStatusBadge, ApplicationCard,
│       │                           # ProjectListClient, ProjectFilters, ApplyButton,
│       │                           # ShareButton, RecentProjectsSection, RecordRecentProject
│       ├── profile/                # ProfileHeader, ProfileCompletionBar, ProfileTabsClient,
│       │                           # BasicInfoTab, ProfileBasicForm, AvailabilityEditSheet,
│       │                           # TechStackInput, TechStackSection, CareerSection,
│       │                           # CareerSectionClient, CareerForm, CareerTimelineDot,
│       │                           # ContractDocumentField, KakaoAddressInput
│       │   └── tabs/               # EducationTab, SkillTab, ResumeTab, TabShared
│       ├── notices/                # NoticeListClient
│       ├── referrer/               # ReferrerSection
│       ├── settings/               # NotificationSettings, LogoutButton
│       └── signup/                 # SignupForm, PasswordStrength, PolicyModal
├── lib/
│   ├── api/                        # apiFetch, ApiError (client.ts)
│   │                               # requireAuth, parsePaginationParams (server.ts)
│   │                               # authApi, projectsApi, applicationsApi, profileApi,
│   │                               # noticesApi, notificationsApi, settingsApi (각 도메인)
│   ├── supabase/                   # createClient (browser), createServerClient, createAdminClient
│   │   └── queries/                # projects, applications, profile, notices, notifications, resume
│   ├── kakao/                      # oauth.ts (구현), alimtalk.ts (stub)
│   ├── crypto/                     # client.ts (RSA 암호화), rsa.ts (RSA 복호화)
│   ├── config/env.ts               # 환경변수 타입 안전 접근
│   ├── constants/                  # status.ts, limits.ts, contractDocuments.ts
│   └── utils/                      # cn, format, validation, skills, profile-completion, recent-projects
├── hooks/
│   ├── useSubmit.ts                # 폼 제출 공통 (isLoading/error/try-catch)
│   └── useScrolled.ts              # <main> 스크롤 감지
└── types/                          # project.ts, user.ts, application.ts, notice.ts,
                                    # notification.ts, api.ts, index.ts
```

### 인증 플로우

```
카카오 로그인:
  카카오 버튼 클릭 → kakao.com/oauth/authorize
  → /api/auth/kakao/callback?code=...
  → exchangeCodeForToken → getKakaoUserInfo
  → 기존 회원: magic link 세션 → / 리다이렉트
  → 신규 회원: /signup?email=...&name=...&birth_date=...&phone=... 리다이렉트

이메일 로그인:
  RSA 공개키 발급 → 비밀번호 암호화 → POST /api/auth/login

회원가입:
  카카오 OAuth 선행 (signup_email 쿠키 검증)
  → 폼 입력 (이메일, 이름, 비밀번호, 생년월일, 전화번호, 추천인)
  → 약관 동의 (만 14세/이용약관/개인정보 필수, 마케팅 선택)
  → 비밀번호 RSA 암호화 → POST /api/auth/signup → / 리다이렉트

탈퇴 회원:
  미들웨어에서 profiles.account_status = 'withdrawn' 감지
  → /login?error=withdrawn 리다이렉트
```

### 레이아웃 구조

```
전체 화면
└── max-w-[600px] mx-auto
    ├── TopBar (fixed top, h-14)        페이지 타이틀, 뒤로가기, 스크롤시 햄버거
    ├── <main> (h-screen, overflow-y-auto, pt-14, pb-16)   스크롤 컨텍스트
    └── BottomNavigation (fixed bottom, h-16)   홈/프로젝트/내정보/설정
```

---

## 비즈니스 로직

### 투입 가능 상태

- `available` (투입 가능) / `partial` (일부 가능, 예정일 필요) / `unavailable` (투입 불가)
- `AvailabilityEditSheet`에서 선택 → PUT /api/profile/availability

### 프로젝트 지원

- 모집중(`recruiting`) + 마감일 이전일 때만 지원 버튼 활성화
- 지원 상태 플로우: `pending → reviewing → interview → accepted / rejected`
- `pending` 상태에서만 프리랜서가 직접 취소 가능 (`pending → withdrawn`)

### 페이지네이션

- 서버에서 첫 10개 SSR, 클라이언트에서 "더보기" 버튼으로 누적 로드
- 필터/검색 변경 시 페이지 리셋

### 최근 본 프로젝트

- localStorage 기반, 서버에서 존재 여부 검증 후 오래된 항목 자동 제거
- `useSyncExternalStore`로 탭 간 동기화

### 회원 탈퇴

- 소프트 탈퇴: `profiles.account_status = 'withdrawn'` + `withdrawn_at` 기록
- Supabase Auth 계정은 유지 (물리 삭제 아님)
- 탈퇴 후 30일 데이터 보관 (개인정보 처리방침)

### 프로필 완성도

- 5개 탭(기본정보/학력자격증/경력사항/스킬인벤토리/이력서) × 항목별 가중치 계산
- `lib/utils/profile-completion.ts`에서 0~100% 산출

---

## 구현된 기능

### 인증

- 카카오 OAuth 로그인 (exchangeCodeForToken → magic link 세션)
- 이메일/비밀번호 로그인 (RSA 암호화)
- 카카오 신규 회원 → 회원가입 페이지 리다이렉트
- 회원가입 시 법적 동의 (이용약관, 개인정보처리방침, 마케팅, 만 14세)
- 비밀번호 강도 표시 (`PasswordStrength`)
- 약관 인라인 모달 (`PolicyModal`)
- 비밀번호 변경 (`/settings/password`, RSA 암호화, `PasswordStrength` 공유)
- Supabase Auth 미들웨어 (보호된 라우트 + 탈퇴 회원 차단)
- 로그아웃, 회원 탈퇴 (소프트 탈퇴)
- 이용약관 (/terms), 개인정보 처리방침 (/privacy)

### 홈

- 인사 배너 (이름, 투입 가능 상태 배지, 예정일)
- 지원 현황 통계 (전체/검토 중/면접/합격)
- 내 신청 현황 (최근 3건 가로 스크롤, 전체보기)
- 모집 중인 프로젝트 (최신 3건, 기술 매칭 표시)
- 공지사항 미리보기 (최신 2건, 중요 공지 강조)
- 최근 본 프로젝트 (localStorage 기반, 서버 존재 검증)

### 프로젝트

- 목록: SSR 초기 데이터 + 클라이언트 더보기 (10개씩)
- 검색 (300ms 디바운스), 상태 필터 (전체/모집중/완료)
- 프로젝트 카드: 상태 배지, D-Day, 기술 매칭 수, 기술 스택 태그
- 상세: 히어로 섹션, 기술 매칭 강조, 요구 사항, 마감일
- 최근 본 프로젝트 기록 (localStorage)
- 공유 버튼 (Web Share API + 클립보드 복사 폴백)
- 고정 하단 CTA (지원하기 / 지원완료 / 취소됨 / 마감 상태별)
- 지원 폼: BottomSheet, 참고사항(1000자), 희망 단가(만원/월, 1~9999)
- 중복 지원 방지, 마감일/모집상태 서버 검증

### 내 신청 현황

- 상태별 통계 (PageHero + StatsGrid)
- 신청 카드: 상태 배지, 지원일, 프로젝트명, 참고사항, 희망 단가
- 지원 취소 (pending 상태만, 인라인 2단계 확인)

### 프로필 (5탭)

**탭 1: 기본정보**
- 이름, 성별, 생년월일, 휴대폰, 이메일, 주소
- 자기소개, 기술 스택
- 투입 가능 상태 변경 (`AvailabilityEditSheet`)
- 계약 형태 (사업자/개인): 사업자명, 번호, 사업장 주소, 사업자등록증 업로드
- 계좌 정보: 은행명, 계좌번호, 계좌 이미지 업로드
- 카카오 주소 검색 연동 (`KakaoAddressInput`)

**탭 2: 학력/자격증**
- 학력 CRUD (BottomSheet): 학교명, 학위, 전공, 입학/졸업년월, 졸업 여부
- 자격증 CRUD (BottomSheet): 자격증명, 취득년월

**탭 3: 경력사항**
- 타임라인 UI (`CareerTimelineDot`)
- 경력 CRUD (BottomSheet): 회사명, 직무, 기간, 현재 재직 여부, 설명, 기술 스택

**탭 4: 스킬 인벤토리**
- 프로젝트 단위 스킬 기록 CRUD (BottomSheet)
- 필드: 프로젝트명, 기간, 고객사, 소속회사, 산업분야, 응용분야, 역할
- 개발환경: 기종, OS, 개발언어(태그), DBMS, TOOL(태그), 기타
- 카드 접기/펼치기

**탭 5: 이력서**
- PDF/DOC/DOCX/HWP 업로드 (최대 10MB, 최대 10개)
- 파일명, 크기, 업로드 날짜 표시
- 다운로드 (signed URL), 삭제

**공통**
- 프로필 완성도 바 (`ProfileCompletionBar`): 0~100%, 미완료 항목 CTA

### 알림

- 카카오 알림톡 발송 내역 목록
- 서비스 타입별 아이콘 (프로젝트/공지/개별)
- 발송 상태 배지 (발송 완료/실패/처리중)
- 페이지네이션 (20개씩)

### 공지사항

- 목록: 총 공지 수, 더보기 (10개씩), 중요 공지 강조
- 상세: 제목, 날짜, 본문, 첨부파일 다운로드, 이전/다음 네비게이션

### 설정

- 계정 정보 (이름, 이메일, 전화번호)
- 추천인 등록 (`ReferrerSection`): 미등록 시 입력/등록, 등록 후 read-only
- 내 정보 수정 (`/settings/profile`)
- 비밀번호 변경 (`/settings/password`)
- 알림 설정: 개인정보 수집 동의 토글, SMS 수신 동의 토글 (개인정보 동의 선행 필요)
- 개인정보 처리방침/이용약관 링크
- 로그아웃, 회원 탈퇴 링크

### 추천인

- 회원가입 시 선택 (이름/전화번호 검색)
- 설정 페이지에서 미등록 시 등록 가능
- 1명 제한, 등록 후 프리랜서 변경 불가 (관리자만 가능)
- 전화번호 마스킹 표시

---

## API 엔드포인트 목록

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/auth/public-key` | GET | RSA 공개키 발급 |
| `/api/auth/signup` | POST | 회원가입 |
| `/api/auth/login` | POST | 이메일 로그인 |
| `/api/auth/logout` | POST | 로그아웃 |
| `/api/auth/withdraw` | POST | 회원탈퇴 |
| `/api/auth/password` | PUT | 비밀번호 변경 |
| `/api/auth/kakao/callback` | GET | 카카오 OAuth 콜백 |
| `/api/projects` | GET | 프로젝트 목록 (status, page, pageSize, search) |
| `/api/projects/[id]` | GET | 프로젝트 상세 |
| `/api/applications` | GET | 내 지원 목록 |
| `/api/applications` | POST | 지원 신청 |
| `/api/applications/[id]` | DELETE | 지원 취소 |
| `/api/profile` | GET | 프로필 전체 조회 |
| `/api/profile` | PUT | 기본정보 수정 |
| `/api/profile/availability` | PUT | 투입 가능 상태 변경 |
| `/api/profile/referrer` | POST | 추천인 등록 |
| `/api/profile/careers` | POST | 경력 추가 |
| `/api/profile/careers/[id]` | PUT / DELETE | 경력 수정/삭제 |
| `/api/profile/education` | POST | 학력 추가 |
| `/api/profile/education/[id]` | PUT / DELETE | 학력 수정/삭제 |
| `/api/profile/certifications` | POST | 자격증 추가 |
| `/api/profile/certifications/[id]` | DELETE | 자격증 삭제 |
| `/api/profile/skill-inventories` | POST | 스킬 인벤토리 추가 |
| `/api/profile/skill-inventories/[id]` | PUT / DELETE | 스킬 수정/삭제 |
| `/api/profile/resumes` | POST | 이력서 업로드 |
| `/api/profile/resumes/[id]` | DELETE | 이력서 삭제 |
| `/api/profile/resumes/[id]/download` | GET | 이력서 다운로드 |
| `/api/profile/contract-documents/[type]` | POST / DELETE | 계약 문서 업로드/삭제 |
| `/api/profile/contract-documents/[type]/download` | GET | 계약 문서 다운로드 |
| `/api/notices` | GET | 공지사항 목록 (page, pageSize) |
| `/api/notifications` | GET | 알림톡 이력 (page, pageSize) |
| `/api/settings/notifications` | GET / PUT | 알림 설정 조회/변경 |

---

## DB 주요 테이블

| 테이블 | 구분 | 설명 |
|--------|------|------|
| `profiles` | CLIENT | 프리랜서 프로필 (id = auth.users.id) |
| `careers` | CLIENT | 경력 (is_current, tech_stack 포함) |
| `educations` | CLIENT | 학력 |
| `certifications` | CLIENT | 자격증 |
| `skill_inventories` | CLIENT | 스킬 인벤토리 (프로젝트 경험) |
| `profile_resumes` | CLIENT | 이력서 파일 (Storage 버킷 연동) |
| `projects` | SHARED | 프로젝트 (admin 관리, client 읽기) |
| `notices` | SHARED | 공지사항 (notice_type: immediate/scheduled, attachments jsonb) |
| `applications` | CLIENT | 지원 내역 (available_start_date·admin_memo는 admin 전용) |
| `admin_users` | ADMIN | 관리자 계정 (service_role 전용) |
| `alimtalk_templates` | ADMIN | 카카오 알림톡 서식 (service_role 전용) |
| `alimtalk_logs` | ADMIN/CLIENT | 알림톡 발송 이력 (본인 이력 client 조회 가능) |
| `admin_audit_logs` | ADMIN | 관리자 감사 로그 (service_role 전용) |

전체 DDL: `sql/techmeet-client-admin.sql`

### Storage 버킷

| 버킷 | 공개 | 용도 |
|------|------|------|
| `resumes` | private | 이력서 파일 |
| `contract-documents` | private | 사업자등록증, 계좌 이미지 |

---

## 환경변수

### 클라이언트 공개 (NEXT_PUBLIC_)

| 변수명 | 용도 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | 앱 기본 URL |
| `NEXT_PUBLIC_APP_ENV` | 환경 구분 (development / production) |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY` | 카카오 OAuth REST API 키 |
| `NEXT_PUBLIC_KAKAO_REDIRECT_URI` | 카카오 OAuth 리다이렉트 URI |

### 서버 전용

| 변수명 | 용도 |
|--------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL (서버 측) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 (RLS 우회) |
| `KAKAO_REST_API_KEY` | 카카오 OAuth REST API 키 (서버) |
| `KAKAO_REDIRECT_URI` | 카카오 OAuth 리다이렉트 URI (서버) |
| `KAKAO_CLIENT_SECRET` | 카카오 OAuth 클라이언트 시크릿 |
| `KAKAO_ALIMTALK_APP_KEY` | 카카오 알림톡 앱 키 |
| `KAKAO_ALIMTALK_SENDER_KEY` | 카카오 알림톡 발신 키 |
| `AUTH_RSA_PUBLIC_KEY` | RSA 공개키 (비밀번호 암호화) |
| `AUTH_RSA_PRIVATE_KEY` | RSA 개인키 (서버 복호화) |

---

## TODO

- **카카오 알림톡 실제 연동**: `lib/kakao/alimtalk.ts` 현재 console.log stub 상태
  - 제공업체(NHN Cloud, 솔라피 등) 계약 필요
  - 연동 후 구현할 기능: 신규 프로젝트 등록 시 대상 프리랜서 전체 발송, 지원 상태 변경 시 해당 프리랜서 발송

---

## 개발 명령어

```bash
npm run dev     # 개발 서버 (포트 3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```
