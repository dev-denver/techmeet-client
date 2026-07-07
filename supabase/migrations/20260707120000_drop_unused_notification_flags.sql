-- profiles.notification_new_project / notification_application_update / notification_marketing 미사용 컬럼 제거
-- 알림 설정 기능은 privacy_consent / sms_consent 컬럼만 사용 (src/app/api/settings/notifications/route.ts)

alter table public.profiles
  drop column if exists notification_new_project,
  drop column if exists notification_application_update,
  drop column if exists notification_marketing;
