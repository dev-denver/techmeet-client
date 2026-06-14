/**
 * 입력 길이·범위 제한 상수 (클라이언트·서버 공용).
 *
 * 클라이언트의 maxLength 속성과 서버 API 검증이 반드시 같은 값을 쓰도록
 * 여기서만 관리한다. 새 입력 필드를 추가할 때는 여기에 상수를 먼저 정의할 것.
 */
export const LIMITS = {
  /** 이름 */
  NAME_MAX: 50,
  /** 회사명·근무회사 */
  COMPANY_MAX: 100,
  /** 직무·역할 */
  ROLE_MAX: 100,
  /** 학교명 */
  SCHOOL_MAX: 100,
  /** 프로젝트명 */
  PROJECT_NAME_MAX: 100,
  /** 자격증명 */
  CERT_NAME_MAX: 100,
  /** 주소 */
  ADDRESS_MAX: 200,
  /** 자기소개 */
  BIO_MAX: 500,
  /** 경력 설명 */
  DESCRIPTION_MAX: 1000,
  /** 지원동기 */
  COVER_LETTER_MAX: 1000,
  /** 기술스택 항목 1개당 글자 수 */
  TECH_ITEM_MAX: 50,
  /** 기술스택 최대 항목 수 */
  TECH_COUNT_MAX: 50,
  /** 희망 단가(만원) 하한 */
  RATE_MIN: 1,
  /** 희망 단가(만원) 상한 */
  RATE_MAX: 9999,
  /** 검색어 */
  SEARCH_MAX: 100,
  /** 이메일 */
  EMAIL_MAX: 255,
  /** 사업자명 */
  BUSINESS_NAME_MAX: 100,
  /** 사업장 주소 */
  BUSINESS_ADDRESS_MAX: 200,
  /** 은행명 */
  BANK_NAME_MAX: 50,
  /** 계좌번호 */
  BANK_ACCOUNT_MAX: 30,
} as const;
