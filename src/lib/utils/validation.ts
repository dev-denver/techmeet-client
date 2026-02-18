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

export function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 99;
}
