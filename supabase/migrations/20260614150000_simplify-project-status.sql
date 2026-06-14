-- ------------------------------------------------------------
-- projects: 프로젝트 상태를 모집중/완료(+취소) 2단계로 단순화
-- 기존 in_progress 데이터는 completed로 이행
-- ------------------------------------------------------------
update public.projects
set status = 'completed'
where status = 'in_progress';

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (status in ('recruiting', 'completed', 'cancelled'));
