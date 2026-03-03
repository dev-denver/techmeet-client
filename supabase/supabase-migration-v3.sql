-- ============================================================
-- techmeet DB 마이그레이션 v3
-- admin + client 공용 스키마 (신규 Supabase 프로젝트 기준)
-- Supabase Dashboard > SQL Editor에서 실행
--
-- v2 → v3 주요 변경사항:
--   1. profiles.id = auth.users.id 구조로 변경
--      (기존 auth_user_id 컬럼 제거 — client 코드가 id만 사용)
--   2. RLS 정책 추가 (anon key + JWT 조합으로 동작하는 client 앱 지원)
--   3. updated_at 자동 갱신 트리거 추가
--   4. check constraint 보완 (availability_status, project_type, work_type)
--   5. notices — is_published + 스케줄 시간 기반 RLS 정책
--   6. 성능 인덱스 보완 (kakao_id, referrer_id, notices.is_published)
-- ============================================================


-- ============================================================
-- 0. 유틸리티: updated_at 자동 갱신 트리거 함수
-- ============================================================
create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 1. profiles (프리랜서 프로필)
-- ============================================================
-- 설계 원칙:
--   profiles.id = auth.users.id (auth FK를 PK로 직접 사용)
--   client 회원가입 시 id: data.user.id 로 upsert하므로 gen_random_uuid() 불필요
--   admin_users 테이블은 별도 PK + auth_user_id FK 구조를 유지

create table if not exists public.profiles (
  id                               uuid        references auth.users(id) on delete cascade primary key,
  name                             text        not null,
  email                            text        not null,
  phone                            text,
  bio                              text,
  headline                         text,
  tech_stack                       text[]      not null default array[]::text[],
  experience_years                 integer,
  portfolio_url                    text,
  avatar_url                       text,
  kakao_id                         text,
  availability_status              text
    check (availability_status in ('available', 'partial', 'unavailable')),
  notification_new_project         boolean     not null default true,
  notification_application_update  boolean     not null default true,
  notification_marketing           boolean     not null default false,
  account_status                   text        not null default 'active'
    check (account_status in ('active', 'withdrawn')),
  withdrawn_at                     timestamptz,
  referrer_id                      uuid        references public.profiles(id) on delete set null,
  created_at                       timestamptz not null default now(),
  updated_at                       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 본인 프로필만 조회/수정 가능
-- ※ 회원가입/재가입/추천인 검색 등 admin 작업은 모두 service_role로 수행 (RLS 우회)
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- updated_at 자동 갱신
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ============================================================
-- 2. projects (프로젝트)
-- ============================================================
create table if not exists public.projects (
  id                  uuid        default gen_random_uuid() primary key,
  title               text        not null,
  description         text        not null default '',
  status              text        not null default 'recruiting'
    check (status in ('recruiting', 'in_progress', 'completed', 'cancelled')),
  budget_min          numeric,
  budget_max          numeric,
  budget_currency     text        not null default 'KRW',
  duration_start_date date,
  duration_end_date   date,
  deadline            date,
  tech_stack          text[]      not null default array[]::text[],
  requirements        text[],
  category            text,
  client_name         text,
  project_type        text
    check (project_type in ('web', 'mobile', 'backend', 'fullstack', 'data', 'design', 'other')),
  work_type           text
    check (work_type in ('remote', 'onsite', 'hybrid')),
  location            text,
  headcount           integer,
  created_by          uuid        references public.profiles(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.projects enable row level security;

-- 인증된 사용자는 전체 프로젝트 조회 가능 (상태 필터는 client 앱 레이어에서 처리)
create policy "projects_select_authenticated" on public.projects
  for select using (auth.role() = 'authenticated');

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ============================================================
-- 3. notices (공지사항)
-- ============================================================
create table if not exists public.notices (
  id           uuid        default gen_random_uuid() primary key,
  title        text        not null,
  content      text        not null default '',
  is_published boolean     not null default false,
  is_important boolean     not null default false,
  notice_type  text        not null default 'immediate'
    check (notice_type in ('immediate', 'scheduled')),
  start_at     timestamptz,
  end_at       timestamptz,
  created_by   uuid        references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.notices enable row level security;

-- 게시된 공지사항만 노출:
--   is_published = true (관리자가 공개 처리)
--   + immediate: 시간 제한 없음
--   + scheduled: start_at ~ end_at 범위 내
-- ※ client 코드에 is_published 필터 없으므로 RLS에서 강제 적용
create policy "notices_select_published" on public.notices
  for select using (
    auth.role() = 'authenticated'
    and is_published = true
    and (
      notice_type = 'immediate'
      or (
        (start_at is null or start_at <= now())
        and (end_at   is null or end_at   >= now())
      )
    )
  );

create trigger notices_updated_at
  before update on public.notices
  for each row execute function public.set_updated_at();


-- ============================================================
-- 4. applications (지원)
-- ============================================================
create table if not exists public.applications (
  id                   uuid        default gen_random_uuid() primary key,
  project_id           uuid        references public.projects(id) on delete cascade not null,
  freelancer_id        uuid        references public.profiles(id) on delete cascade not null,
  status               text        not null default 'pending'
    check (status in ('pending', 'reviewing', 'interview', 'accepted', 'rejected', 'withdrawn')),
  cover_letter         text,
  expected_rate        numeric,
  available_start_date date,              -- admin 전용 (client에서는 미사용)
  admin_memo           text,              -- admin 전용
  applied_at           timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

alter table public.applications enable row level security;

-- 본인 지원 내역만 CRUD
-- ※ 관리자 상태 변경(reviewing/interview/accepted/rejected)은 service_role로 수행
create policy "applications_select_own" on public.applications
  for select using (auth.uid() = freelancer_id);

create policy "applications_insert_own" on public.applications
  for insert with check (auth.uid() = freelancer_id);

-- pending → withdrawn 취소 (client에서 status만 수정)
create policy "applications_update_own" on public.applications
  for update using (auth.uid() = freelancer_id);

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();


-- ============================================================
-- 5. careers (경력)
-- ============================================================
create table if not exists public.careers (
  id          uuid        default gen_random_uuid() primary key,
  profile_id  uuid        references public.profiles(id) on delete cascade not null,
  company     text        not null,
  role        text        not null,
  start_date  date        not null,
  end_date    date,
  is_current  boolean     not null default false,
  description text,
  tech_stack  text[]      not null default array[]::text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((is_current = false) or (is_current = true and end_date is null))
);

alter table public.careers enable row level security;

-- 본인 경력만 CRUD
create policy "careers_select_own" on public.careers
  for select using (auth.uid() = profile_id);

create policy "careers_insert_own" on public.careers
  for insert with check (auth.uid() = profile_id);

create policy "careers_update_own" on public.careers
  for update using (auth.uid() = profile_id);

create policy "careers_delete_own" on public.careers
  for delete using (auth.uid() = profile_id);

create trigger careers_updated_at
  before update on public.careers
  for each row execute function public.set_updated_at();


-- ============================================================
-- 6. admin_users (관리자 계정)
-- ============================================================
-- admin_users는 profiles와 달리 별도 UUID PK + auth_user_id FK 구조 유지
-- (관리자 계정은 프리랜서 profiles와 별개)
create table if not exists public.admin_users (
  id           uuid        default gen_random_uuid() primary key,
  auth_user_id uuid        references auth.users on delete cascade not null unique,
  name         text        not null,
  email        text        not null unique,
  role         text        not null default 'admin'
    check (role in ('superadmin', 'admin')),
  created_at   timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- 관리자 본인 조회만 허용 (서버는 service_role 사용)
create policy "admin_users_select_own" on public.admin_users
  for select using (auth.uid() = auth_user_id);


-- ============================================================
-- 7. alimtalk_logs (카카오 알림톡 발송 이력)
-- ============================================================
create table if not exists public.alimtalk_logs (
  id            uuid        default gen_random_uuid() primary key,
  user_id       uuid        references public.profiles(id) on delete set null,
  template_code text        not null,
  template_name text        not null,
  service_type  text        not null check (service_type in ('project', 'notice', 'individual')),
  message_id    text,
  send_type     text        not null default 'immediate'
    check (send_type in ('immediate', 'scheduled')),
  scheduled_at  timestamptz,
  is_success    boolean,
  sent_at       timestamptz,
  error_message text,
  created_at    timestamptz not null default now()
);

alter table public.alimtalk_logs enable row level security;
-- service_role 전용 (RLS 정책 없음 = 일반 유저 접근 불가)


-- ============================================================
-- 8. teams / profile_teams (팀 관리, admin 전용)
-- ============================================================
create table if not exists public.teams (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null,
  description text        not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.profile_teams (
  id         uuid        default gen_random_uuid() primary key,
  profile_id uuid        references public.profiles(id) on delete cascade not null,
  team_id    uuid        references public.teams(id) on delete cascade not null,
  role       text        not null default 'member' check (role in ('leader', 'member')),
  joined_at  timestamptz not null default now(),
  unique (profile_id, team_id)
);

alter table public.teams         enable row level security;
alter table public.profile_teams enable row level security;
-- service_role 전용 (관리자 API Route에서 service_role 클라이언트 사용)


-- ============================================================
-- 9. admin_audit_logs (관리자 감사 로그)
-- ============================================================
create table if not exists public.admin_audit_logs (
  id          uuid        default gen_random_uuid() primary key,
  admin_id    uuid        references public.admin_users(id) on delete set null,
  admin_name  text        not null,
  action      text        not null,
  resource    text        not null,
  resource_id text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;
-- service_role 전용


-- ============================================================
-- 10. 성능 인덱스
-- ============================================================

-- profiles
create index if not exists idx_profiles_created_at          on public.profiles(created_at desc);
create index if not exists idx_profiles_account_status      on public.profiles(account_status);
create index if not exists idx_profiles_availability_status on public.profiles(availability_status);
create index if not exists idx_profiles_kakao_id            on public.profiles(kakao_id);         -- 카카오 콜백 조회
create index if not exists idx_profiles_referrer_id         on public.profiles(referrer_id);      -- 추천인 조회

-- projects
create index if not exists idx_projects_created_at          on public.projects(created_at desc);
create index if not exists idx_projects_status              on public.projects(status);

-- applications
create index if not exists idx_applications_status          on public.applications(status);
create index if not exists idx_applications_freelancer_id   on public.applications(freelancer_id);
create index if not exists idx_applications_project_id      on public.applications(project_id);
create index if not exists idx_applications_applied_at      on public.applications(applied_at desc);

-- notices
create index if not exists idx_notices_created_at           on public.notices(created_at desc);
create index if not exists idx_notices_is_published         on public.notices(is_published);      -- RLS 필터 최적화

-- teams
create index if not exists idx_teams_created_at             on public.teams(created_at desc);

-- alimtalk_logs
create index if not exists idx_alimtalk_created_at          on public.alimtalk_logs(created_at desc);
create index if not exists idx_alimtalk_user_id             on public.alimtalk_logs(user_id);
create index if not exists idx_alimtalk_service_type        on public.alimtalk_logs(service_type);
create index if not exists idx_alimtalk_is_success          on public.alimtalk_logs(is_success);

-- admin_audit_logs
create index if not exists idx_audit_logs_created_at        on public.admin_audit_logs(created_at desc);
create index if not exists idx_audit_logs_admin_id          on public.admin_audit_logs(admin_id);
create index if not exists idx_audit_logs_resource          on public.admin_audit_logs(resource);

-- careers
create index if not exists idx_careers_profile_id           on public.careers(profile_id);


-- ============================================================
-- 11. 마스터 관리자 계정 등록
-- ============================================================
-- ※ 사전 준비:
--   1. Supabase Dashboard > Authentication > Users 에서
--      관리자 이메일/비밀번호로 Auth 계정을 먼저 생성
--   2. 생성된 유저의 UUID를 아래 auth_user_id에 입력 후 실행
-- ============================================================
-- insert into public.admin_users (auth_user_id, name, email, role)
-- values (
--   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  -- Auth 유저 UUID 입력
--   '마스터 관리자',
--   'admin@techmeet.com',
--   'superadmin'
-- ) on conflict (auth_user_id) do nothing;
