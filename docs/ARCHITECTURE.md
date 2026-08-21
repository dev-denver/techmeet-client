# 아키텍처

> 기술 스택과 계층별 설계 원칙을 다룹니다. 기능별 상세 구조와 API 목록은 `PROJECT.md`를 참고하세요.

## 기술 스택

| 항목      | 기술                        |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript 5 (strict mode)  |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| Database  | Supabase (PostgreSQL)       |
| Auth      | 카카오 OAuth (소셜 로그인)  |
| 알림      | 카카오 비즈니스 알림톡 API (stub, 프리랜서 대상) + 센드온 SMS (구현, 관리자 대상) |

## 페이지 구조

```
/                          → 홈 (프로필 완성도, 내 신청 현황, 모집 중 프로젝트, 공지)
/projects                  → 프로젝트 목록
/projects/[id]             → 프로젝트 상세 + 지원하기
/projects/applications     → 내 신청 내역 및 상태
/profile                   → 내 정보 (기본정보, 학력/자격증, 경력사항, 스킬 인벤토리, 이력서)
/notifications             → 알림 이력 (카카오 알림톡 발송 내역)
/notices                   → 공지사항 목록
/notices/[id]              → 공지사항 상세
/settings                  → 설정 (알림, 추천인, 로그아웃)
/settings/profile          → 내 정보 수정
/settings/password         → 비밀번호 변경
/settings/withdraw         → 회원 탈퇴
/login                     → 카카오 로그인
/signup                    → 회원가입 (카카오 OAuth 플로우 선행)
/terms                     → 이용약관 (공개)
/privacy                   → 개인정보 처리방침 (공개)
```

## 디렉토리 계층 원칙

```
/src
  proxy.ts                 → Next.js proxy 컨벤션 파일 (Next.js 16부터 middleware.ts를 대체하는 명칭)
                             Supabase 세션 갱신 + 인증 가드 + 탈퇴 회원 차단 — 전체 환경에서 동작
  /app                     → Next.js App Router 페이지 및 레이아웃
    /api                   → API 라우트 (Supabase 연동, 카카오 알림톡, 센드온 SMS)
    /(auth)                → 인증 필요 페이지 그룹 (TopBar + BottomNavigation 레이아웃)
    opengraph-image.tsx, robots.ts, sitemap.ts → SEO 관련 특수 라우트 파일
  /components
    /ui                    → shadcn/ui 기반 재사용 UI 컴포넌트
    /layout                → TopBar, BottomNavigation, PullToRefresh 레이아웃 컴포넌트
    /features              → 기능별 컴포넌트 (도메인 디렉토리로 분리)
  /lib
    /api                   → 클라이언트 API 호출 함수 (client.ts, server.ts, 도메인별 *Api)
    /config                → env.ts (환경변수 타입 안전 접근)
    /constants             → status.ts, limits.ts, contractDocuments.ts,
                             pageTitles.ts, profileTabs.ts, resume.ts, index.ts
    /crypto                → client.ts (RSA 암호화), rsa.ts (RSA 복호화)
    /supabase              → client.ts, server.ts (createServerClient, createAdminClient), /queries
    /kakao                 → oauth.ts (카카오 OAuth), alimtalk.ts (알림톡 발송, stub)
    /sms                   → sendon.ts (센드온 SMS 발송 — 신규 지원 시 관리자 알림)
    /utils                 → cn.ts, format.ts, validation.ts, skills.ts,
                             profile-completion.ts, recent-projects.ts
  /types                   → project.ts, user.ts, application.ts, notice.ts, notification.ts,
                             api.ts, index.ts
  /hooks                   → useScrolled.ts, useSubmit.ts
```

기능별 상세 파일 목록(컴포넌트/쿼리 함수 단위)은 `PROJECT.md`의 디렉토리 구조 참고.

## 계층별 설계 원칙

- **Server Component 우선**: 클라이언트 상태가 필요할 때만 `'use client'` 사용.
- **API Route → Supabase**: 인증 필요 API route는 반드시 `requireAuth()`(`lib/api/server.ts`)로 시작.
- **클라이언트 → API**: 클라이언트 컴포넌트는 raw `fetch` 대신 `lib/api/`의 `*Api` 객체를 통해 API 라우트 호출.
- **DB 접근은 API 라우트/쿼리 함수로 한정**: 클라이언트 컴포넌트에서 Supabase를 직접 쿼리하지 않음 (인증 세션 확인용 `createClient()` 제외).

## Supabase 클라이언트 사용

| 상황                                          | 클라이언트                                          |
| --------------------------------------------- | --------------------------------------------------- |
| Client Component                              | `createClient()` from `@/lib/supabase/client`       |
| Server Component / API Route (인증 세션 필요) | `createServerClient()` from `@/lib/supabase/server` |
| API Route (RLS bypass — 추천인 검색 등)       | `createAdminClient()` from `@/lib/supabase/server`  |

> `createAdminClient()`는 service_role 키를 사용해 RLS를 우회합니다. 반드시 서버 사이드에서만 호출해야 합니다.

## 모바일 레이아웃 구현 규칙

- 최상위 레이아웃에서 `max-w-[600px] mx-auto` 적용
- 상단 TopBar, 하단 BottomNavigation은 모든 인증된 페이지에 고정
- 콘텐츠 영역은 상단/하단 바 높이만큼 padding 확보
- 반응형(breakpoint 분기)이 아닌 고정 모바일 폭 — 데스크탑 접속 시에도 동일 폭 중앙 정렬

## 환경변수 관리

- `lib/config/env.ts`에서 getter 기반 lazy validation으로 타입 안전 접근
- `publicEnv`: 클라이언트/서버 모두 사용 (`NEXT_PUBLIC_` 접두사)
- `serverEnv`: 서버 전용 (`SUPABASE_SERVICE_ROLE_KEY`, `AUTH_RSA_PUBLIC_KEY`, `AUTH_RSA_PRIVATE_KEY`,
  `SENDON_ID`/`SENDON_API_KEY`/`SENDON_FROM`/`SENDON_ADMIN_NOTIFY_PHONE`/`SENDON_PROXY_URL` 등)
- 전체 변수 목록은 `PROJECT.md`의 "환경변수" 섹션 참고

## 중요 사항

- `.env` 파일은 절대 커밋하지 않는다
- Supabase 클라이언트는 `/lib/supabase`에서만 초기화한다
- 카카오 알림톡·센드온 SMS 등 외부 API 키는 환경변수로만 관리한다
- 인증이 필요한 페이지는 Supabase Auth 미들웨어로 보호한다
