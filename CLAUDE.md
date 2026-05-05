> **읽는 순서: 이 파일(CLAUDE.md) → project.md**
> 이 파일은 변경이 거의 없는 개발 규칙·아키텍처 기준입니다.
> 비즈니스 요건·기능 구성·완료 현황은 `project.md`를 확인하세요.

# 프로젝트: techmeet-client

테크밋 소속 프리랜서 개발자를 위한 **프리랜서 전용 웹앱**입니다.
관리자 기능은 별도 레포지토리에서 관리됩니다.

## 프로젝트 목적

- 프리랜서 개발자가 테크밋에서 등록한 개발 프로젝트를 조회하고 지원할 수 있습니다
- 프리랜서가 자신의 경력, 기술 스택, 현재 투입 상태를 직접 관리합니다
- 카카오 알림톡을 통해 신규 프로젝트 등록 시 자동 알림을 받습니다
- techmeet-admin과 동일한 Supabase DB 공유 (스키마: `sql/techmeet-client-admin.sql`)

## 기술 스택

| 항목      | 기술                        |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript 5 (strict mode)  |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| Database  | Supabase (PostgreSQL)       |
| Auth      | 카카오 OAuth (소셜 로그인)  |
| 알림      | 카카오 비즈니스 알림톡 API  |

## 명령어

- `npm run dev`: 개발 서버 시작 (포트 3000)
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 검사

## UI/UX 방향

- **모바일 앱형 웹**: 데스크탑에서 접속해도 모바일 폭(`max-w-[430px]`)으로 중앙 정렬
- 웹/앱 링크 동일 화면 제공 (반응형 X, 고정 모바일 폭)
- **상단 바**: 페이지 타이틀 + 뒤로가기 버튼, 스크롤 시 햄버거 메뉴 표시
- **하단 네비게이션 바**: 홈 / 프로젝트 관리 / 내 정보 / 설정

## 페이지 구조

```
/                          → 홈 (최근 프로젝트, 내 신청 현황, 공지)
/projects                  → 프로젝트 목록
/projects/[id]             → 프로젝트 상세 + 지원하기
/projects/applications     → 내 신청 내역 및 상태
/profile                   → 내 정보 (경력, 기술 스택, 상태 관리)
/settings                  → 설정 (알림, 로그아웃)
/login                     → 카카오 로그인
```

## 아키텍처

```
/src
  /app                     → Next.js App Router 페이지 및 레이아웃
    /api                   → API 라우트 (Supabase 연동, 카카오 알림톡)
    /login                 → 로그인 페이지
    /projects              → 프로젝트 관련 페이지
    /profile               → 내 정보 페이지
    /settings              → 설정 페이지
  /components
    /ui                    → shadcn/ui 기반 재사용 UI 컴포넌트
    /layout                → TopBar, BottomNavigation 등 레이아웃 컴포넌트
    /features              → 기능별 컴포넌트 (projects/, profile/ 등)
  /lib
    /constants             → 상태 config 등 상수 정의 (status.ts)
    /supabase              → Supabase 클라이언트 및 쿼리 함수
    /kakao                 → 카카오 OAuth, 알림톡 API 유틸
    /utils                 → 공통 유틸리티 함수
  /types                   → TypeScript 타입 정의
  /hooks                   → 커스텀 React 훅
```

## 코드 스타일

- TypeScript strict 모드 사용, `any` 타입 금지
- default export 대신 named export 사용
- CSS: Tailwind 유틸리티 클래스 사용, 커스텀 CSS 파일 금지
- 컴포넌트는 `/components/features`에 기능별로 분리
- Server Component 우선, 클라이언트 상태 필요 시에만 `'use client'` 사용

## 모바일 레이아웃 구현 규칙

- 최상위 레이아웃에서 `max-w-[430px] mx-auto` 적용
- 상단 TopBar, 하단 BottomNavigation은 모든 인증된 페이지에 고정
- 콘텐츠 영역은 상단/하단 바 높이만큼 padding 확보

## 상수 및 설정 관리

- 상태 표시 config는 `/lib/constants/status.ts`에서 중앙 관리
  - `PROJECT_STATUS_CONFIG`, `APPLICATION_STATUS_CONFIG`, `AVAILABILITY_STATUS_CONFIG`
  - 컴포넌트에서 로컬 statusConfig 정의 금지, 반드시 import 사용
- 상태 색상은 CSS custom properties 기반 (`--status-success`, `--status-info` 등)

## 유틸리티 함수

- `format.ts`: `formatDate`, `formatShortDate`, `formatDeadlineDays`, `getDeadlineDays`, `formatMonthYear`
- `validation.ts`: `validatePassword`, `validatePhone`, `validateEmail`, `validateAge`, `formatPhone`
- `cn.ts`: Tailwind 클래스 병합 (`clsx` + `tailwind-merge`)

## 컴포넌트 네이밍 규칙

- `{도메인}{역할}` 패턴: `ProjectCard`, `ProjectStatusBadge`, `ApplicationCard`
- features 디렉토리 내 도메인별 분리: `projects/`, `profile/`, `settings/`

## Enum 패턴

- `as const` 객체 + `typeof` 타입 추출 방식 사용
- 예시: `AvailabilityStatus`, `AccountStatus`, `ProjectStatus`, `ApplicationStatus`
- 패턴: `export const Foo = { A: "a", B: "b" } as const;` → `export type Foo = typeof Foo[keyof typeof Foo];`
- API route에서 enum 값 검증 시 `new Set(Object.values(Enum))` 활용

## API Route 보안 패턴

- 모든 인증 필요 API route는 핸들러 최상단에서 `createServerClient()` → `getUser()` → 미인증 시 401 반환
- query 함수 내부의 auth 체크는 방어적 레이어 (API route 레벨 체크가 우선)
- enum 값 입력은 API route에서 유효성 검증 후 query 함수에 전달

## 에러 처리 패턴

- 날짜 유틸: 내부 `parseDate` 헬퍼가 잘못된 날짜 시 Error throw
- API 라우트: try-catch + NextResponse.json({ error }) 형태, 미인증 → 401, 잘못된 입력 → 400
- 클라이언트 폼: useState로 error 메시지 관리, 제출 시 검증
- 클라이언트 데이터 로드 실패: loadError state + 에러 메시지 UI 표시

## 폼 검증 패턴

- 클라이언트: 제출 전 `validation.ts` 함수로 검증 → 에러 메시지 표시
- 서버: API 라우트에서 동일 검증 재실행 (이중 검증)
- 공통 검증 함수: `validatePhone`, `validateBirthDate`, `validatePassword`, `validateEmail` (`validation.ts`)
- 날짜 역전 검사: `startDate < endDate` 비교 (문자열 비교로 동작, ISO 8601 형식 전제)
- 길이 제한 규칙: 이름 50자, 회사명·직무·학교명·프로젝트명 100자, 자기소개 500자

## 글자 수 카운터 패턴

- `FormField`의 `hint` prop에 `` `${value.length}/최대자수` `` 전달
- 입력 필드에 `maxLength` 속성 함께 적용 (하드 제한)
- Textarea는 `onChange`에서 `.slice(0, 최대자수)` 적용

## 에러 바운더리 패턴

- `src/app/(auth)/error.tsx` — (auth) 그룹 글로벌 폴백 (AlertCircle 아이콘 + 재시도 버튼)
- Server Component에서 throw 발생 시 자동으로 error.tsx 표시
- 개별 섹션 실패가 전체 페이지를 중단시키지 않아야 할 때는 `Promise.allSettled` 사용

## BottomSheet 패턴

- 하단에서 올라오는 모달 → `src/components/ui/bottom-sheet.tsx` 사용
- Props: `{ open, onClose, hasBottomNav?, children }`
- BottomNavigation 위에 표시 필요 시 `hasBottomNav={true}` (pb-16 추가)
- 내부 컨텐츠는 children으로 전달, 패딩/레이아웃은 children 내부에서 처리

## 수평 스크롤 패턴

- 컨테이너 밖으로 블리드: `-mx-4 px-4` + `overflow-x-auto scrollbar-none`
- 카드 리스트 등에서 모바일 폭을 넘어 스크롤 가능한 UI에 사용

## 접근성 규칙

- 커스텀 인터랙티브 요소에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` 필수
- 토글 버튼에 `role="switch"` + `aria-checked` 적용
- `aria-label` 필요 시 한국어로 작성

## 다크 모드

- CSS custom properties로 `.dark` 클래스 기반 정의됨
- 현재 미사용 상태 (토글 UI 미구현)

## 환경변수 관리

- `lib/config/env.ts`에서 getter 기반 lazy validation으로 타입 안전 접근
- `publicEnv`: 클라이언트/서버 모두 사용 (`NEXT_PUBLIC_` 접두사)
- `serverEnv`: 서버 전용 (`SUPABASE_SERVICE_ROLE_KEY` 등)

## 공통 컴포넌트

- `TechStackInput` (`components/features/profile/`): 기술 스택 입력 (Enter/추가 버튼, 태그 삭제)
- `CareerTimelineDot` (`components/features/profile/`): 경력 타임라인 dot + line
- `BottomSheet` (`components/ui/`): 하단 모달 오버레이

## Supabase 클라이언트 사용

| 상황                                          | 클라이언트                                            |
| --------------------------------------------- | ----------------------------------------------------- |
| Client Component                              | `createClient()` from `@/lib/supabase/client`         |
| Server Component / API Route (인증 세션 필요) | `createServerClient()` from `@/lib/supabase/server`   |
| API Route (RLS bypass — 추천인 검색 등)       | `@/lib/supabase/server` + `SUPABASE_SERVICE_ROLE_KEY` |

## 중요 사항

- `.env` 파일은 절대 커밋하지 마세요
- Supabase 클라이언트는 `/lib/supabase`에서만 초기화
- 카카오 알림톡 API 키는 환경변수로만 관리
- 인증이 필요한 페이지는 Supabase Auth 미들웨어로 보호

## 작업 모드 설정

### Accept Edits On 모드

사용자가 **"accept edits on"** 을 입력하면 아래 규칙을 즉시 적용한다.

- Claude가 작업 중 확인이 필요한 모든 질문(파일 수정, DB 마이그레이션, 패키지 설치, API 변경 등)에 대해 **자동으로 yes로 간주하고 즉시 실행**한다.
- 중간에 "진행할까요?", "확인해주세요", "어떻게 할까요?" 등의 질문 없이 계획한 모든 단계를 연속으로 수행한다.
- 작업 완료 후 변경 사항을 한 번에 요약해서 보고한다.

### Accept Edits Off 모드

사용자가 **"accept edits off"** 를 입력하면 기본 동작으로 복귀한다.

- 파괴적 작업(DB 마이그레이션, 파일 대량 수정 등)은 실행 전 확인을 요청한다.
