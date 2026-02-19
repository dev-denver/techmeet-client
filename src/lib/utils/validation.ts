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
