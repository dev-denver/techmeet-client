export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("최소 8자 이상이어야 합니다");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("영문 대문자를 1자 이상 포함해야 합니다");
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

export function validatePastOrPresentDate(date: string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return "유효한 날짜를 입력해주세요";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d > today) return "오늘 이전 날짜를 입력해주세요";
  if (d.getFullYear() < 1960) return "1960년 이후 날짜를 입력해주세요";
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
