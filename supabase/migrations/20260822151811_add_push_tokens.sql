-- Capacitor 네이티브 앱의 푸시 알림 디바이스 토큰 저장.
-- 발송 트리거/비즈니스 로직은 이 마이그레이션 범위 밖 — 토큰 저장까지만 담당한다.

create table if not exists public.push_tokens (
  id          uuid        default gen_random_uuid() primary key,
  profile_id  uuid        references public.profiles(id) on delete cascade not null,
  platform    text        not null,
  token       text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (profile_id, token)
);

alter table public.push_tokens enable row level security;

create policy "push_tokens_select_own" on public.push_tokens
  for select using (auth.uid() = profile_id);

create policy "push_tokens_insert_own" on public.push_tokens
  for insert with check (auth.uid() = profile_id);

create policy "push_tokens_delete_own" on public.push_tokens
  for delete using (auth.uid() = profile_id);

create trigger push_tokens_updated_at
  before update on public.push_tokens
  for each row execute function public.set_updated_at();
