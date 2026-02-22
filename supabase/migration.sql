-- ============================================================
-- techmeet 통합 마이그레이션 (admin + client 공유 Supabase)
-- Supabase Dashboard > SQL Editor에서 실행
-- 신규 빈 프로젝트에 한 번 실행하면 모든 테이블이 생성됩니다
-- ============================================================


-- ============================================================
-- 1. profiles (프리랜서 프로필)
--    id = auth.users.id 동일 UUID 사용
--    → client/admin 모두 profiles.id로 조회
-- ============================================================
create table if not exists public.profiles (
  id                               uuid primary key references auth.users on delete cascade,
  name                             text not null default '',
  email                            text not null default '',
  phone                            text,
  headline                         text not null default '',
  bio                              text not null default '',
  tech_stack                       text[] not null default array[]::text[],
  experience_years                 integer not null default 0,
  availability_status              text not null default 'available'
    check (availability_status in ('available', 'partial', 'unavailable')),
  avatar_url                       text,
  kakao_id                         text unique,
  notification_new_project         boolean not null default true,
  notification_application_update  boolean not null default true,
  notification_marketing           boolean not null default false,
  account_status                   text not null default 'active'
    check (account_status in ('active', 'withdrawn')),
  withdrawn_at                     timestamptz,
  referrer_id                      uuid references public.profiles(id) on delete set null,
  created_at                       timestamptz not null default now(),
  updated_at                       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 프리랜서: 본인 프로필만 읽기/수정
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);


-- ============================================================
-- 2. 신규 Auth 가입 시 자동 profile 생성 트리거
--    없으면 signUp 후 profiles.update()가 0건 히트 → 500 에러
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- 3. careers (경력사항)
-- ============================================================
create table if not exists public.careers (
  id           uuid default gen_random_uuid() primary key,
  profile_id   uuid references public.profiles(id) on delete cascade not null,
  company      text not null,
  role         text not null,
  start_date   date not null,
  end_date     date,
  is_current   boolean not null default false,
  description  text not null default '',
  tech_stack   text[] not null default array[]::text[],
  created_at   timestamptz not null default now()
);

alter table public.careers enable row level security;

create policy "careers_select_own" on public.careers
  for select using (auth.uid() = profile_id);

create policy "careers_insert_own" on public.careers
  for insert with check (auth.uid() = profile_id);

create policy "careers_update_own" on public.careers
  for update using (auth.uid() = profile_id);

create policy "careers_delete_own" on public.careers
  for delete using (auth.uid() = profile_id);


-- ============================================================
-- 4. projects (프로젝트)
--    status: recruiting → 클라이언트에 노출
-- ============================================================
create table if not exists public.projects (
  id                   uuid default gen_random_uuid() primary key,
  title                text not null,
  description          text not null default '',
  client_name          text not null default '',
  project_type         text not null default 'other'
    check (project_type in ('web', 'mobile', 'backend', 'fullstack', 'data', 'design', 'other')),
  work_type            text not null default 'remote'
    check (work_type in ('remote', 'onsite', 'hybrid')),
  status               text not null default 'recruiting'
    check (status in ('recruiting', 'in_progress', 'completed', 'cancelled')),
  tech_stack           text[] not null default array[]::text[],
  budget_min           numeric not null default 0,
  budget_max           numeric not null default 0,
  budget_currency      text not null default 'KRW',
  duration_start_date  date,
  duration_end_date    date,
  deadline             date,
  headcount            integer not null default 1,
  location             text,
  requirements         text[] not null default array[]::text[],
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.projects enable row level security;

-- 프리랜서: recruiting 상태 프로젝트만 조회 가능
create policy "projects_select_recruiting" on public.projects
  for select using (status = 'recruiting');


-- ============================================================
-- 5. applications (지원서)
-- ============================================================
create table if not exists public.applications (
  id             uuid default gen_random_uuid() primary key,
  project_id     uuid references public.projects(id) on delete cascade not null,
  freelancer_id  uuid references public.profiles(id) on delete cascade not null,
  status         text not null default 'pending'
    check (status in ('pending', 'reviewing', 'interview', 'accepted', 'rejected', 'withdrawn')),
  cover_letter   text,
  expected_rate  numeric,
  applied_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

alter table public.applications enable row level security;

create policy "applications_select_own" on public.applications
  for select using (auth.uid() = freelancer_id);

create policy "applications_insert_own" on public.applications
  for insert with check (auth.uid() = freelancer_id);

create policy "applications_update_own" on public.applications
  for update using (auth.uid() = freelancer_id);


-- ============================================================
-- 6. notices (공지사항)
--    is_published: admin이 공개 설정, is_important: 상단 고정
-- ============================================================
create table if not exists public.notices (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  content       text not null default '',
  is_published  boolean not null default false,
  is_important  boolean not null default false,
  notice_type   text not null default 'immediate'
    check (notice_type in ('immediate', 'scheduled')),
  start_at      timestamptz,
  end_at        timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.notices enable row level security;

-- 프리랜서: 공개된 공지만 조회 가능
create policy "notices_select_published" on public.notices
  for select using (is_published = true);


-- ============================================================
-- 7. admin_users (관리자 계정)
--    admin 앱 전용, service_role로만 접근
-- ============================================================
create table if not exists public.admin_users (
  id           uuid default gen_random_uuid() primary key,
  auth_user_id uuid references auth.users on delete cascade not null unique,
  name         text not null,
  email        text not null unique,
  role         text not null default 'admin'
    check (role in ('superadmin', 'admin')),
  created_at   timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- 관리자 본인만 자신 조회 (서버는 service_role 사용)
create policy "admin_users_select_own" on public.admin_users
  for select using (auth.uid() = auth_user_id);


-- ============================================================
-- 8. alimtalk_logs (알림톡 발송 이력)
--    service_role 전용 (RLS 정책 없음 = 일반 유저 접근 불가)
-- ============================================================
create table if not exists public.alimtalk_logs (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references public.profiles(id) on delete set null,
  template_code  text not null,
  template_name  text not null,
  service_type   text not null check (service_type in ('project', 'notice', 'individual')),
  message_id     text,
  send_type      text not null default 'immediate'
    check (send_type in ('immediate', 'scheduled')),
  scheduled_at   timestamptz,
  is_success     boolean,
  sent_at        timestamptz,
  error_message  text,
  created_at     timestamptz not null default now()
);

alter table public.alimtalk_logs enable row level security;


-- ============================================================
-- 9. teams / profile_teams (팀 관리)
--    service_role 전용
-- ============================================================
create table if not exists public.teams (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.profile_teams (
  id         uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  team_id    uuid references public.teams(id) on delete cascade not null,
  role       text not null default 'member' check (role in ('leader', 'member')),
  joined_at  timestamptz not null default now(),
  unique (profile_id, team_id)
);

alter table public.teams enable row level security;
alter table public.profile_teams enable row level security;


-- ============================================================
-- 10. admin_audit_logs (관리자 감사 로그)
--     service_role 전용
-- ============================================================
create table if not exists public.admin_audit_logs (
  id           uuid default gen_random_uuid() primary key,
  admin_id     uuid references public.admin_users(id) on delete set null,
  admin_name   text not null,
  action       text not null,
  resource     text not null,
  resource_id  text,
  details      jsonb,
  created_at   timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

create index if not exists idx_audit_logs_created_at on public.admin_audit_logs(created_at desc);
create index if not exists idx_audit_logs_admin_id   on public.admin_audit_logs(admin_id);
create index if not exists idx_audit_logs_resource   on public.admin_audit_logs(resource);


-- ============================================================
-- 마스터 관리자 계정 등록
-- ※ 사전 준비: Supabase Dashboard > Authentication > Users 에서
--   관리자 이메일/비밀번호로 Auth 계정을 먼저 생성하고
--   해당 유저의 UUID를 아래에 입력 후 주석 해제하여 실행
-- ============================================================
-- insert into public.admin_users (auth_user_id, name, email, role)
-- values (
--   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
--   '마스터 관리자',
--   'admin@techmeet.com',
--   'superadmin'
-- ) on conflict (auth_user_id) do nothing;
