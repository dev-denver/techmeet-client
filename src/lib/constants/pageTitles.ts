/**
 * (auth) 그룹 라우트별 타이틀 — TopBar 헤더(h1)와 각 page.tsx의 metadata.title이
 * 동일한 값을 참조하도록 단일 소스로 관리한다.
 */
export const PAGE_TITLES: Record<string, string> = {
  "/": "홈",
  "/projects": "프로젝트",
  "/projects/applications": "내 신청 내역",
  "/profile": "내 정보",
  "/settings": "설정",
  "/settings/profile": "내 정보 수정",
  "/settings/password": "비밀번호 변경",
  "/settings/withdraw": "회원 탈퇴",
  "/notifications": "알림 내역",
  "/notices": "공지사항",
} as const;

export const PROJECT_DETAIL_TITLE = "프로젝트 상세";
export const NOTICE_DETAIL_TITLE = "공지사항 상세";
