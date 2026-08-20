/** 이력서 업로드 허용 MIME 타입 — 클라이언트 사전 검증과 서버 API 검증이 공유한다 */
export const RESUME_ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/x-hwp",
  "application/haansofthwp",
]);
