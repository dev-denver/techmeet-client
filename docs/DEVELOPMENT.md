# 개발 컨벤션

> 코딩 컨벤션, 네이밍, 반복되는 구현 패턴을 다룹니다. 기술 스택·계층 구조는 `ARCHITECTURE.md`, 도메인 지식은 `PROJECT.md`를 참고하세요.

## 코드 스타일

- TypeScript strict 모드 사용, `any` 타입 금지
- default export 대신 named export 사용 (page.tsx / layout.tsx 제외)
- CSS: Tailwind 유틸리티 클래스 사용, 커스텀 CSS 파일 금지
- 컴포넌트는 `/components/features`에 기능별로 분리
- Server Component 우선, 클라이언트 상태 필요 시에만 `'use client'` 사용

## 컴포넌트 네이밍 규칙

- `{도메인}{역할}` 패턴: `ProjectCard`, `ProjectStatusBadge`, `ApplicationCard`
- features 디렉토리 내 도메인별 분리: `projects/`, `profile/`, `settings/`, `notices/`, `referrer/`, `signup/`

## Enum 패턴

- `as const` 객체 + `typeof` 타입 추출 방식 사용
- 예시: `AvailabilityStatus`, `AccountStatus`, `ProjectStatus`, `ApplicationStatus`
- 패턴: `export const Foo = { A: "a", B: "b" } as const;` → `export type Foo = typeof Foo[keyof typeof Foo];`
- API route에서 enum 값 검증 시 `new Set(Object.values(Enum))` 활용

## 상수 및 설정 관리

- 상태 표시 config는 `/lib/constants/status.ts`에서 중앙 관리
  - `PROJECT_STATUS_CONFIG`, `APPLICATION_STATUS_CONFIG`, `AVAILABILITY_STATUS_CONFIG`
  - 컴포넌트에서 로컬 statusConfig 정의 금지, 반드시 import 사용
- 상태 색상은 CSS custom properties 기반 (`--status-success`, `--status-info` 등)
- 입력 길이·범위 제한은 `/lib/constants/limits.ts`의 `LIMITS` 객체에서 중앙 관리
  - 클라이언트 `maxLength`와 서버 검증이 반드시 같은 상수를 사용 (값 하드코딩 금지)
- 계약 문서 타입 정의는 `/lib/constants/contractDocuments.ts`에서 관리
- 시맨틱 색상 토큰 사용: 에러는 `text-destructive`/`bg-destructive/10`, 본문은 `text-foreground`, 보조 텍스트는 `text-muted-foreground` (raw `red-*`/`zinc-*` 직접 사용 금지, 카카오 브랜드 `#FEE500` 등 브랜드 색상은 예외)

## 유틸리티 함수

- `format.ts`: `formatDate`, `formatShortDate`, `formatDeadlineDays`, `getDeadlineDays`, `formatMonthYear`, `maskPhone`, `formatWorkType`
- `validation.ts`: `validatePassword`, `validatePhone`, `validateEmail`, `formatPhone`, `UUID_REGEX`, `validateLength`, `validateStringArray`
- `cn.ts`: Tailwind 클래스 병합 (`clsx` + `tailwind-merge`)
- `skills.ts`: `getMySkills`, `countSkillMatches`, `isSkillMatched`, `getMatchedSkillSet`
- `profile-completion.ts`: 프로필 완성도 계산 (5탭, 항목별 가중치)
- `recent-projects.ts`: localStorage 최근 본 프로젝트 CRUD + `useSyncExternalStore` 구독

## API Route 보안 패턴

- 모든 인증 필요 API route는 `requireAuth()` (`lib/api/server.ts`) 사용
  ```ts
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;
  ```
- `requireAuth()`는 내부적으로 Supabase 클라이언트를 생성하므로, 이후 DB 작업에 별도 `createServerClient()`가 필요한 경우 추가 생성 허용 (소수)
- query 함수 내부의 auth 체크는 방어적 레이어 (API route 레벨 체크가 우선)
- enum 값 입력은 API route에서 유효성 검증 후 query 함수에 전달
- 페이지네이션 파라미터는 `parsePaginationParams(searchParams, { maxPageSize })` 사용

## RSA 암호화 패턴

- 비밀번호는 클라이언트에서 RSA 공개키로 암호화 후 전송, 서버에서 복호화
- 적용 범위: 로그인 (`/api/auth/login`), 회원가입 (`/api/auth/signup`), 비밀번호 변경 (`/api/auth/password`),
  회원 탈퇴 시 비밀번호 재확인 (`/api/auth/withdraw`)
- 공개키 발급: `GET /api/auth/public-key` → 클라이언트 `lib/crypto/client.ts`의 `encryptPassword()`로 암호화
- 복호화: 서버 `lib/crypto/rsa.ts`의 `decryptPassword()`
- 탈퇴처럼 "재확인"이 목적일 때는 복호화한 비밀번호를 `persistSession: false` admin 클라이언트로
  `signInWithPassword()` 검증에만 사용하고 현재 세션에는 영향을 주지 않는다

## SMS 발송 패턴 (센드온)

- 관리자 알림(신규 지원 발생)은 `lib/sms/sendon.ts`의 `notifyAdminOfNewApplication()` 사용
- 발송 실패가 원래 요청(지원 신청)을 막지 않도록 별도 try-catch로 격리하고 `console.error`만 남긴다
- 센드온은 발신 IP 화이트리스트를 요구 — `SENDON_PROXY_URL` 지정 시 `https-proxy-agent`로 고정 IP 프록시를
  경유하며, 모듈이 실제로 쓰이는 런타임 시점에만 적용해 빌드 단계 네트워크 요청에는 영향을 주지 않는다
- 카카오 알림톡(`lib/kakao/alimtalk.ts`, 프리랜서 대상)과는 별개 채널이며 알림톡은 아직 stub 상태

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

## 페이지 타이틀 패턴

- `(auth)` 그룹 라우트의 타이틀은 `lib/constants/pageTitles.ts`의 `PAGE_TITLES` 상수를 단일 소스로 사용
- TopBar 헤더(h1)와 각 라우트 `layout.tsx`/`page.tsx`의 `metadata.title`이 동일 값을 참조하도록 동기화
- 라우트를 추가/변경할 때는 `PAGE_TITLES`에 항목을 먼저 추가한 뒤 TopBar와 metadata 양쪽에서 이를 참조

## 로딩 상태 패턴

- `(auth)` 그룹 라우트마다 `loading.tsx`를 병행 배치해 Suspense 로딩 UI 제공
- `Skeleton` / `SkeletonCard` / `SkeletonBadgeRow` / `SkeletonSectionHeader` 조합으로 실제 레이아웃과 유사한 스켈레톤 구성

## BottomSheet 패턴

- 하단에서 올라오는 모달 → `src/components/ui/bottom-sheet.tsx` 사용
- Props: `{ open, onClose, header?, footer?, children }`
- 너비는 항상 `max-w-[600px]`로 앱 프레임과 동일 (모바일에서는 100vw로 자동 축소)
- 배경 오버레이(`inset-0`)와 패널(`max-h-[85vh]`, `items-end`)이 화면 전체를 덮어 BottomNavigation도 함께 가려짐 (열려있는 동안 BottomNavigation 비표시)
- 내부 컨텐츠는 children으로 전달, 패딩/레이아웃은 children 내부에서 처리
- 삭제 등 파괴적 작업 확인은 `window.confirm()` 대신 `ConfirmSheet` (`components/ui/confirm-sheet.tsx`) 사용

## 폼 제출 패턴 (useSubmit + \*Api + Toast)

- 클라이언트 폼 제출은 `useSubmit()` 훅 (`src/hooks/useSubmit.ts`) 사용 — 로딩/에러/try-catch 공통화
- API 호출은 반드시 `lib/api/`의 `*Api` 객체 사용 (`profileApi`, `applicationsApi` 등) — raw `fetch("/api/...")` 금지
- 저장/삭제 성공 피드백은 `useToast()` (`components/ui/toast.tsx`)의 `showToast("저장되었습니다")` 사용
  - `ToastProvider`는 `(auth)/layout.tsx`에 마운트되어 있음 ((auth) 그룹 안에서만 사용 가능)
- 예시:
  ```ts
  const { isLoading, error, submit } = useSubmit();
  await submit(() => profileApi.deleteCareer(id), {
    onSuccess: () => {
      showToast("삭제되었습니다");
      router.refresh();
    },
  });
  ```

## 파일 업로드 패턴 (이력서 / 계약 문서)

- 이력서: `POST /api/profile/resumes` (multipart/form-data), Storage 버킷 `resumes` (private)
  - 허용 MIME: PDF, DOC, DOCX, HWP / 최대 10MB / 최대 10개
  - 다운로드: `GET /api/profile/resumes/[id]/download` (서버에서 signed URL 생성 후 리다이렉트)
- 계약 문서: `POST /api/profile/contract-documents/[type]`, Storage 버킷 `contract-documents` (private)
  - type: `business_registration` (사업자등록증), `bank_account_image` (계좌 이미지)
  - 다운로드: `GET /api/profile/contract-documents/[type]/download`
- Storage 경로: `{auth.uid()}/{filename}` — RLS 정책에서 폴더명으로 본인 여부 검증

## 수평 스크롤 패턴

- 컨테이너 밖으로 블리드: `-mx-4 px-4` + `overflow-x-auto scrollbar-none`
- 카드 리스트 등에서 모바일 폭을 넘어 스크롤 가능한 UI에 사용

## 접근성 규칙

- 커스텀 인터랙티브 요소에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` 필수
- 토글 버튼에 `role="switch"` + `aria-checked` 적용
- `aria-label` 필요 시 한국어로 작성
- 네비게이션 활성 항목에 `aria-current="page"` 적용 (BottomNavigation)
- 로딩 중인 제출 버튼에 `aria-busy={isLoading || undefined}` 적용 (SaveButton)

## 공통 컴포넌트

- `TechStackInput` (`components/features/profile/`): 기술 스택 입력 (Enter/추가 버튼, 태그 삭제)
- `CareerTimelineDot` (`components/features/profile/`): 경력 타임라인 dot + line
- `ProfileCompletionBar` (`components/features/profile/`): 프로필 완성도 바 + 미완료 항목 CTA 버튼
- `NoticeListClient` (`components/features/notices/`): 공지사항 목록 더보기 페이지네이션
- `ShareButton` (`components/features/projects/`): Web Share API + 클립보드 복사 폴백
- `BottomSheet` (`components/ui/`): 하단 모달 오버레이
- `ConfirmSheet` (`components/ui/`): 삭제 확인 바텀시트 (`{ open, title, description?, confirmLabel?, destructive?, isLoading?, onConfirm, onClose }`)
- `ToastProvider` / `useToast` (`components/ui/toast.tsx`): 경량 토스트 (성공/에러 피드백, 의존성 없음)
- `EmptyState` (`components/ui/`): 데이터 없을 때 빈 상태 표시 (icon, title, description, action, iconShape, iconSize)
- `ErrorMessage` (`components/ui/`): 폼 서버 오류 메시지 (size="xs"|"sm", children이 falsy면 렌더링 안 함)
- `PageHero` (`components/ui/`): 상단 다크 헤더 배경 래퍼 (`bg-primary px-5 pt-6 pb-5`, className으로 pb 오버라이드)
- `StatsGrid` (`components/ui/`): 통계 그리드 (stats 배열, valueSize, labelSize)
- `SkeletonCard` / `SkeletonBadgeRow` / `SkeletonSectionHeader` (`components/ui/skeleton-patterns.tsx`): 로딩 스켈레톤 조각
- `SurfaceCard` / `surfaceCardVariants` (`components/ui/surface-card.tsx`): 카드 표면 스타일 (`rounded-xl border bg-card`), padding variant(`md`/`compact`/`none`)
- `PolicySectionNav` (`components/ui/policy-section-nav.tsx`): 약관/개인정보처리방침처럼 섹션이 많은 정적 문서용 앵커 칩 내비게이션
- `Switch` (`components/ui/switch.tsx`): 토글 스위치 (`{ checked, onChange, disabled?, "aria-label"? }`, `role="switch"`)
- `PasswordStrength` (`components/features/signup/`): 비밀번호 강도 표시 (회원가입/비밀번호 변경에서 공유)
- `NavLink` (`components/ui/nav-link.tsx`): 내부 페이지 이동용 `next/link` 대체. `<a href>`는 모바일에서 블루투스 마우스 호버 시 하단에 주소가 노출되므로, `role="link"` + `router.push`로 이동 처리 — 내부 네비게이션(카드/리스트 아이템/아이콘 버튼 등)에는 `Link` 대신 반드시 이 컴포넌트 사용. 다운로드용 `<a download>`는 예외. 기본 태그는 `div`(`as="div"`)이며, `<p>` 등 phrasing content 내부의 인라인 텍스트 링크는 `as="span"` 필수 (div는 p의 자식으로 올 수 없어 하이드레이션 에러 발생)
- `PullToRefresh` (`components/layout/`): 당겨서 새로고침

## 훅

- `useSubmit` (`hooks/useSubmit.ts`): 폼 제출 공통 — `isLoading`, `error` 상태 관리, `ApiError` 메시지 자동 노출
- `useScrolled` (`hooks/useScrolled.ts`): `<main>` 엘리먼트의 scrollTop 감지 (임계값 초과 여부 boolean 반환). `window`가 아닌 `<main>` 기준임에 주의

## Git 브랜치 전략

- 브랜치 네이밍: `type/설명` (예: `feat/kakao-alimtalk`, `fix/proxy-auth-bypass`, `chore/design-token`)
  - `type`은 커밋 컨벤션과 동일한 값 사용: `feat`, `fix`, `chore`, `perf`, `refactor`, `docs`, `test`
  - `설명`은 kebab-case, 무엇을 하는 작업인지 짧게
- 커밋 메시지: `type(scope): 설명` (Conventional Commits 스타일)
  - 예: `perf(proxy): public 경로 인증 체크 네트워크 왕복 제거`, `fix(proxy): 미들웨어 matcher에서 .html 정적 파일 인증 우회 처리`
- `main`에서 직접 작업하지 않고, 의미 있는 작업 단위마다 브랜치를 분기한다
