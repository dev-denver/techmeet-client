# 테크밋 프리랜서 앱 - 개발 문서

> 이 문서는 개발 환경이 바뀌어도 어디까지 개발됐는지 파악하고 이어서 개발할 수 있도록 작성된 문서입니다.
> 마지막 업데이트: 2026-02-21

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
| Database | Supabase (PostgreSQL + Storage) | RLS 적용 권장 |
| Auth | Supabase Auth + 카카오 OAuth | magic link 방식 세션 생성 |
| 알림 | 카카오 알림톡 (미구현) | |

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
│   │   │   ├── avatar/             # 프로필 사진 업로드 (POST) → Supabase Storage
│   │   │   ├── availability/       # 투입 가능 상태 변경 (PUT)
│   │   │   ├── referrer/           # 추천인 등록 (POST)
│   │   │   │   └── search/         # 추천인 검색 (GET, admin client)
│   │   │   └── careers/            # 경력 목록/추가 (GET, POST)
│   │   │       └── [id]/           # 경력 수정/삭제 (PUT, DELETE)
│   │   ├── projects/               # 프로젝트 목록 조회 (GET, page/pageSize/status 지원)
│   │   │   └── [id]/               # 프로젝트 상세 조회 (GET)
│   │   ├── notices/                # 공지사항 목록 조회 (GET)
│   │   └── settings/notifications/ # 알림 설정 (GET, PUT)
│   ├── (auth)/                     # 인증된 사용자용 (TopBar + BottomNav)
│   │   ├── layout.tsx              # 고정 레이아웃
│   │   ├── page.tsx                # 홈 (/)
│   │   ├── notices/
│   │   │   └── [id]/page.tsx       # 공지사항 상세
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
│   ├── ui/                         # shadcn/ui 기반 (avatar, badge, button, card, separator, skeleton, bottom-sheet)
│   ├── layout/                     # TopBar, BottomNavigation
│   └── features/
│       ├── projects/               # ProjectCard, ProjectStatusBadge, ApplicationCard,
│       │                           # ProjectListClient (더보기 페이지네이션), ProjectFilters,
│       │                           # ApplyButton (지원 폼 + BottomSheet)
│       ├── profile/                # ProfileHeader, AvatarUpload, AvailabilityToggle,
│       │                           # TechStackSection, TechStackInput, CareerSection,
│       │                           # CareerSectionClient (CRUD), CareerTimelineDot
│       ├── referrer/               # ReferrerSection, ReferrerSearchModal (BottomSheet)
│       └── settings/               # NotificationSettings, LogoutButton
├── lib/
│   ├── supabase/                   # Supabase 클라이언트 + 서버사이드 쿼리
│   │   ├── client.ts               # 브라우저용 클라이언트
│   │   ├── server.ts               # 서버용 클라이언트 (쿠키 기반 세션)
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
└── max-w-[430px] mx-auto (데스크탑에서 중앙 정렬)
    ├── TopBar (fixed top, h-14) - 페이지 타이틀, 뒤로가기, 스크롤시 햄버거
    ├── <main> (h-screen, overflow-y-auto, pt-14, pb-16) - 스크롤 컨텍스트
    └── BottomNavigation (fixed bottom, h-16) - 홈/프로젝트/내정보/설정
```

### 프로필 사진 업로드 플로우

```
사용자가 프로필 사진 클릭 (AvatarUpload 컴포넌트)
    → 파일 선택 (JPG/PNG/WebP, 최대 5MB)
    → POST /api/profile/avatar (multipart/form-data)
    → Supabase Storage avatars/{userId}/avatar (upsert: true)
    → profiles.avatar_url 업데이트 (URL + ?t={timestamp} 캐시 무효화)
    → 클라이언트 화면 즉시 갱신
```

---

## 데이터베이스 스키마 (Supabase)

### profiles 테이블
```sql
id                              uuid  PRIMARY KEY (auth.users.id FK)
name                            text  NOT NULL
email                           text  NOT NULL
phone                           text
avatar_url                      text  -- Supabase Storage 공개 URL
headline                        text
bio                             text
tech_stack                      text[]
availability_status             text  DEFAULT 'available'  -- 'available' | 'partial' | 'unavailable'
experience_years                int   DEFAULT 0
kakao_id                        text
notification_new_project        boolean DEFAULT true
notification_application_update boolean DEFAULT true
notification_marketing          boolean DEFAULT false
account_status                  text  DEFAULT 'active'  -- 'active' | 'withdrawn'
withdrawn_at                    timestamptz
referrer_id                     uuid  REFERENCES profiles(id) ON DELETE SET NULL
created_at                      timestamptz DEFAULT now()
updated_at                      timestamptz DEFAULT now()
```

### careers 테이블
```sql
id            uuid    PRIMARY KEY DEFAULT gen_random_uuid()
profile_id    uuid    REFERENCES profiles(id) ON DELETE CASCADE
company       text    NOT NULL
role          text    NOT NULL
start_date    date    NOT NULL
end_date      date
is_current    boolean DEFAULT false
description   text
tech_stack    text[]
```

### projects 테이블
```sql
id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid()
title               text    NOT NULL
description         text
client_name         text
project_type        text
work_type           text    -- 'remote' | 'onsite' | 'hybrid'
status              text    -- 'recruiting' | 'in_progress' | 'completed' | 'cancelled'
tech_stack          text[]
budget_min          int
budget_max          int
duration_start_date date
duration_end_date   date
deadline            date
headcount           int
location            text
requirements        text[]
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

### applications 테이블
```sql
id             uuid    PRIMARY KEY DEFAULT gen_random_uuid()
project_id     uuid    REFERENCES projects(id)
freelancer_id  uuid    REFERENCES profiles(id)
status         text    -- 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'withdrawn'
cover_letter   text
expected_rate  int
applied_at     timestamptz DEFAULT now()
updated_at     timestamptz DEFAULT now()
```

### notices 테이블
```sql
id           uuid    PRIMARY KEY DEFAULT gen_random_uuid()
title        text    NOT NULL
content      text
is_important boolean DEFAULT false
created_at   timestamptz DEFAULT now()
```

---

## Supabase Storage 설정

### avatars 버킷
- **Public 버킷** (공개 읽기)
- 경로 패턴: `avatars/{user_id}/avatar`
- 허용 MIME: `image/jpeg`, `image/png`, `image/webp`
- 최대 파일 크기: 5MB

### RLS 정책 (권장)
```sql
-- 업로드: 자기 폴더만 가능
CREATE POLICY "users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 덮어쓰기: 자기 파일만 가능
CREATE POLICY "users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 비즈니스 로직

### 투입 가능 상태
- `available` (투입 가능), `partial` (일부 가능), `unavailable` (투입 불가)
- 프리랜서가 직접 토글 → PUT /api/profile/availability → 즉시 저장
- 상태 색상: `src/lib/constants/status.ts`의 `AVAILABILITY_STATUS_CONFIG`

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
- [x] 프로필 사진 업로드 (Supabase Storage, AvatarUpload 컴포넌트)
- [x] 투입 가능 상태 토글 (PUT /api/profile/availability)
- [x] 기술 스택 표시
- [x] 경력 추가/수정/삭제 (CareerSectionClient, /api/profile/careers CRUD)
- [x] 자기 소개 표시
- [x] 내 정보 수정 (/settings/profile)

### 설정
- [x] 계정 정보 표시 (이름, 이메일, 카카오 ID)
- [x] 알림 설정 토글 (GET/PUT /api/settings/notifications)
- [x] 내 정보 수정 링크
- [x] 개인정보 처리방침 / 이용약관 링크
- [x] 회원 탈퇴 UI 및 API
- [x] 추천인 등록 (미등록 시 등록 버튼 → 모달, 등록 후 이름 read-only 표시)

### 추천인
- [x] 회원가입 시 추천인 선택 (선택 사항, 이름/전화번호 검색)
- [x] 설정 페이지에서 추후 등록 가능 (미등록 시)
- [x] 추천인 1명 제한, 등록 후 클라이언트 변경 불가 (관리자만 변경)
- [x] 전화번호 마스킹 (010-****-5678)
- [x] API: GET /api/profile/referrer/search, POST /api/profile/referrer

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
- [x] 모바일 고정 폭 (max-w-[430px])
- [x] 수평 스크롤 (-mx-4 px-4 + scrollbar-none) 패턴

---

## 🔧 TODO

### 높은 우선순위

- [ ] **카카오 알림톡 연동**: `lib/kakao/alimtalk.ts` 현재 console.log 스텁 상태
  - 알림톡 API 제공사 계약 필요 (NHN Cloud, 솔라피, 쿨SMS 등)
  - 신규 프로젝트 등록 시 → 대상 프리랜서 전체 발송
  - 지원 상태 변경 시 → 해당 프리랜서에게 발송

### 낮은 우선순위

- [ ] **비밀번호 변경**: 이메일 로그인 계정용 비밀번호 변경 기능
- [ ] **다크 모드 토글**: globals.css에 `.dark` CSS 변수 정의됨, 토글 UI 미구현
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

## Supabase 신규 설정 체크리스트

- [ ] `avatars` Storage 버킷 생성 (Public)
- [ ] `avatars` 버킷 RLS 정책 설정 (위 정책 참고)
- [ ] `profiles.account_status` 컬럼 추가 (기존 rows default 'active')
- [ ] `profiles.withdrawn_at` 컬럼 추가
- [ ] `profiles.referrer_id` 컬럼 추가 (uuid, REFERENCES profiles(id) ON DELETE SET NULL)

---

## 개발 시 주의사항

1. **컴포넌트 상태 관리**: Server Component 기본, 인터랙션 필요 시만 `'use client'`
2. **상태 색상**: `src/lib/constants/status.ts`에서만 관리, 컴포넌트에서 로컬 정의 금지
3. **타입 안전**: `any` 타입 금지, `unknown` 후 타입 가드 사용
4. **스크롤 감지**: `window`가 아닌 `<main>` 엘리먼트 기준 (`useScrolled` 훅)
5. **공개 경로**: `/terms`, `/privacy`는 미들웨어에서 인증 없이 접근 가능
6. **Storage 업로드**: API Route에서 처리 (클라이언트에서 직접 Supabase Storage 호출 금지)
7. **API Route 인증**: 모든 인증 필요 API route 핸들러 최상단에서 `getUser()` → 미인증 시 401 반환
8. **BottomSheet 사용**: 하단 모달 패턴은 `components/ui/bottom-sheet.tsx` 공통 컴포넌트 사용
9. **focus-visible**: 커스텀 input/button에 `focus-visible:` 접두사 사용 (`focus:` 금지)

---

## 개발 명령어

```bash
npm run dev     # 개발 서버 (포트 3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```
