-- ------------------------------------------------------------
-- applications: cover_letter 컬럼을 note(참고사항)로 명칭 변경
-- ------------------------------------------------------------
alter table public.applications rename column cover_letter to note;
