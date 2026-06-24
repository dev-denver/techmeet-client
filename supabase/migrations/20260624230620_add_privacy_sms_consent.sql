-- ============================================================
-- profiles: 개인정보 수집 이용 동의 / SMS 수신 동의 컬럼 추가
-- 신규 프로젝트 알림(notification_new_project), 지원 상태 변경 알림
-- (notification_application_update)은 설정 화면 노출만 제거하며
-- DB 컬럼은 admin 연동을 위해 유지
-- ============================================================

alter table public.profiles
  add column if not exists privacy_consent boolean not null default false, -- 개인정보 수집 이용 동의 여부
  add column if not exists sms_consent     boolean not null default false; -- SMS 수신 동의 여부 (privacy_consent 선행 필요)
