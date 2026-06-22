drop index if exists idx_profiles_referrer_id;
alter table public.profiles drop column if exists referrer_id;
alter table public.profiles add column referrer_note text;
