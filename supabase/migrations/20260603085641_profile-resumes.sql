-- ------------------------------------------------------------
-- profile_resumes (이력서 파일)
-- ------------------------------------------------------------
create table if not exists public.profile_resumes (
  id          uuid        default gen_random_uuid() primary key,
  profile_id  uuid        not null references public.profiles(id) on delete cascade,
  file_name   text        not null,
  file_path   text        not null,
  file_size   bigint      not null,
  mime_type   text        not null,
  created_at  timestamptz not null default now()
);

alter table public.profile_resumes enable row level security;

create policy "본인 이력서 조회" on public.profile_resumes
  for select using (profile_id = auth.uid());

create policy "본인 이력서 추가" on public.profile_resumes
  for insert with check (profile_id = auth.uid());

create policy "본인 이력서 삭제" on public.profile_resumes
  for delete using (profile_id = auth.uid());

create index if not exists idx_profile_resumes_profile_id on public.profile_resumes(profile_id);

-- ------------------------------------------------------------
-- Storage: resumes 버킷
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('resumes', 'resumes', false)
  on conflict do nothing;

create policy "본인 이력서 업로드" on storage.objects
  for insert with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "본인 이력서 다운로드" on storage.objects
  for select using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "본인 이력서 삭제" on storage.objects
  for delete using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
