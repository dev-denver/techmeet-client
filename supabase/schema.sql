-- ================================================================
-- techmeet-client Supabase 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ================================================================

-- ── 테이블 생성 ──────────────────────────────────────────────

-- 프리랜서 프로필
create table if not exists public.profiles (
  id              uuid        references auth.users on delete cascade primary key,
  name            text        not null default '',
  email           text        not null default '',
  phone           text,
  avatar_url      text,
  headline        text        not null default '',
  bio             text        not null default '',
  tech_stack      text[]      not null default '{}',
  availability_status text    not null default 'available'
    check (availability_status in ('available', 'partial', 'unavailable')),
  experience_years int        not null default 0,
  kakao_id        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 경력
create table if not exists public.careers (
  id          uuid        default gen_random_uuid() primary key,
  profile_id  uuid        references public.profiles on delete cascade not null,
  company     text        not null,
  role        text        not null,
  start_date  date        not null,
  end_date    date,
  is_current  boolean     not null default false,
  description text        not null default '',
  tech_stack  text[]      not null default '{}',
  created_at  timestamptz not null default now()
);

-- 프로젝트
create table if not exists public.projects (
  id                  uuid        default gen_random_uuid() primary key,
  title               text        not null,
  description         text        not null default '',
  client_name         text        not null default '',
  project_type        text        not null
    check (project_type in ('web', 'mobile', 'backend', 'fullstack', 'data', 'design', 'other')),
  work_type           text        not null
    check (work_type in ('remote', 'onsite', 'hybrid')),
  status              text        not null default 'recruiting'
    check (status in ('recruiting', 'in_progress', 'completed', 'cancelled')),
  tech_stack          text[]      not null default '{}',
  budget_min          int         not null default 0,
  budget_max          int         not null default 0,
  budget_currency     text        not null default 'KRW',
  duration_start_date date        not null,
  duration_end_date   date        not null,
  deadline            date        not null,
  headcount           int         not null default 1,
  location            text,
  requirements        text[]      not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 지원서
create table if not exists public.applications (
  id            uuid        default gen_random_uuid() primary key,
  project_id    uuid        references public.projects on delete cascade not null,
  freelancer_id uuid        references public.profiles on delete cascade not null,
  status        text        not null default 'pending'
    check (status in ('pending', 'reviewing', 'interview', 'accepted', 'rejected', 'withdrawn')),
  cover_letter  text        not null default '',
  expected_rate int         not null default 0,
  applied_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

-- 공지사항
create table if not exists public.notices (
  id           uuid        default gen_random_uuid() primary key,
  title        text        not null,
  content      text        not null default '',
  is_important boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- ── RLS 활성화 ───────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.careers      enable row level security;
alter table public.projects     enable row level security;
alter table public.applications enable row level security;
alter table public.notices      enable row level security;

-- ── RLS 정책 ─────────────────────────────────────────────────

-- profiles: 자신의 프로필만 조회/수정
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- careers: 자신의 경력만 관리
create policy "careers_all_own" on public.careers
  for all using (profile_id = auth.uid());

-- projects: 인증된 사용자 전체 조회 가능
create policy "projects_select_authenticated" on public.projects
  for select using (auth.role() = 'authenticated');

-- applications: 자신의 지원서만 관리
create policy "applications_all_own" on public.applications
  for all using (freelancer_id = auth.uid());

-- notices: 인증된 사용자 전체 조회 가능
create policy "notices_select_authenticated" on public.notices
  for select using (auth.role() = 'authenticated');

-- ── 신규 유저 프로필 자동 생성 트리거 ────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
