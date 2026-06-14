-- ------------------------------------------------------------
-- profiles: 사용하지 않는 항목 제거 (경력 연차, 병역사항, 소속정보)
-- ------------------------------------------------------------
alter table public.profiles
  drop column if exists experience_years,
  drop column if exists experience_months,
  drop column if exists military_service,
  drop column if exists joining_date,
  drop column if exists affiliation,
  drop column if exists department,
  drop column if exists position_title;
