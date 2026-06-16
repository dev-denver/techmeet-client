-- projects 테이블에 SM/SI 구분 컬럼 추가
alter table public.projects
  add column if not exists business_type text
    check (business_type in ('sm', 'si'));
