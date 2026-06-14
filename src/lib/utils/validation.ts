export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("최소 8자 이상이어야 합니다");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("영문 소문자를 1자 이상 포함해야 합니다");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("숫자를 1자 이상 포함해야 합니다");
  }
  if (!/[!@#$%^&*()_+\-=]/.test(password)) {
    errors.push("특수문자(!@#$%^&*()_+-=)를 1자 이상 포함해야 합니다");
  }

  return { valid: errors.length === 0, errors };
}

export function validatePhone(phone: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export function validateBusinessNumber(value: string): boolean {
  return /^\d{3}-\d{2}-\d{5}$/.test(value);
}

export function formatBusinessNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
}

export function validateBirthDate(birthDate: string): boolean {
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function validateBirthDateWithMessage(birthDate: string): string | null {
  if (!birthDate) return null;
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return "유효한 날짜를 입력해주세요";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date >= today) return "생년월일은 오늘 이전이어야 합니다";
  if (date.getFullYear() < 1900) return "1900년 이후 날짜를 입력해주세요";
  return null;
}

export function validateFutureDate(date: string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return "유효한 날짜를 입력해주세요";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return "오늘 이후 날짜를 선택해주세요";
  return null;
}

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 문자열 길이 상한 검증 (클라이언트·서버 공용).
 * 초과 시 한국어 에러 메시지, 통과 시 null을 반환한다.
 */
export function validateLength(value: string, max: number, label: string): string | null {
  if (value.length > max) return `${label}은(는) ${max}자 이하로 입력해주세요`;
  return null;
}

/**
 * 문자열 배열(기술스택·언어·도구 등) 검증: 배열 여부, 항목 수 상한, 항목당 길이 상한.
 * 통과 시 null을 반환한다.
 */
export function validateStringArray(
  arr: unknown,
  { itemMax, countMax, label }: { itemMax: number; countMax: number; label: string }
): string | null {
  if (!Array.isArray(arr)) return `${label} 형식이 올바르지 않습니다`;
  if (arr.length > countMax) return `${label}은(는) 최대 ${countMax}개까지 등록할 수 있습니다`;
  for (const item of arr) {
    if (typeof item !== "string" || !item.trim()) return `${label} 형식이 올바르지 않습니다`;
    if (item.length > itemMax) return `${label} 항목은 ${itemMax}자 이하로 입력해주세요`;
  }
  return null;
}

export function validatePastOrCurrentMonth(monthYear: string): string | null {
  if (!monthYear) return null;
  const [y, m] = monthYear.split("-").map(Number);
  if (!y || !m) return "유효한 년월을 입력해주세요";
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (y > currentYear || (y === currentYear && m > currentMonth)) {
    return "미래 날짜는 선택할 수 없습니다";
  }
  return null;
}
