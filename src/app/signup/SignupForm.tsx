"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword, validatePhone, validateBirthDateWithMessage, validateEmail, formatPhone } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import { PolicyModal } from "@/components/features/signup/PolicyModal";
import { PasswordStrength } from "@/components/features/signup/PasswordStrength";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { DateSelectPicker } from "@/components/ui/date-select-picker";
import { cn } from "@/lib/utils/cn";
import { encryptPassword } from "@/lib/crypto/client";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

interface SignupFormProps {
  email: string;
  kakaoId: string;
  name: string;
  birthDate: string;
  phone: string;
}

export function SignupForm({ email: initialEmail, kakaoId, name, birthDate: initialBirthDate, phone: initialPhone }: SignupFormProps) {
  const router = useRouter();

  const [emailLocal, setEmailLocal] = useState(() => initialEmail.split("@")[0] ?? "");
  const [emailDomain, setEmailDomain] = useState(() => initialEmail.split("@")[1] ?? "");
  const [emailEditable, setEmailEditable] = useState(false);
  const [formName, setFormName] = useState(name);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthDate, setBirthDate] = useState(
    initialBirthDate && validateBirthDateWithMessage(initialBirthDate) === null ? initialBirthDate : ""
  );
  const [phone, setPhone] = useState(() => {
    const formatted = initialPhone ? formatPhone(initialPhone) : "";
    return validatePhone(formatted) ? formatted : "";
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);
  const [referrerNote, setReferrerNote] = useState("");
  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | null>(null);

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validatePasswordConfirm(pw: string, confirm: string): string {
    if (!confirm) return "";
    return pw !== confirm ? "비밀번호가 일치하지 않습니다" : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    let valid = true;

    const email = `${emailLocal}@${emailDomain}`;
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!formName.trim()) {
      setNameError("이름을 입력해주세요");
      valid = false;
    } else {
      setNameError("");
    }

    const { valid: pwValid, errors: pwErrors } = validatePassword(password);
    if (!pwValid) {
      setPasswordError(pwErrors[0]);
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다");
      valid = false;
    } else {
      setPasswordConfirmError("");
    }

    if (!birthDate) {
      setBirthDateError("생년월일을 입력해주세요");
      valid = false;
    } else {
      const bdErr = validateBirthDateWithMessage(birthDate);
      if (bdErr) { setBirthDateError(bdErr); valid = false; }
      else setBirthDateError("");
    }

    if (!validatePhone(phone)) {
      setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!agreeAge) {
      setServerError("만 14세 이상만 가입할 수 있습니다.");
      return;
    }
    if (!agreeTerms) {
      setServerError("이용약관에 동의해주세요.");
      return;
    }
    if (!agreePrivacy) {
      setServerError("개인정보 처리방침에 동의해주세요.");
      return;
    }

    if (!valid) return;

    setIsLoading(true);
    try {
      const { publicKey } = await authApi.getPublicKey();
      const encryptedPassword = await encryptPassword(password, publicKey);

      await authApi.signup({
        encryptedPassword,
        email,
        name: formName,
        birth_date: birthDate,
        phone,
        kakaoId,
        agree_sms: agreeSms,
        referrer_note: referrerNote.trim() || null,
      });

      router.replace("/");
    } catch (err) {
      console.error("[회원가입] 클라이언트 오류:", err);
      setServerError(
        err instanceof ApiError ? err.message : "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 이메일 */}
      <FormField
        label="이메일"
        required
        error={emailError}
        hint={emailEditable ? undefined : "카카오 계정 이메일이 자동 입력되었습니다"}
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={emailLocal}
            disabled={!emailEditable}
            onChange={(e) => {
              setEmailLocal(e.target.value);
              if (emailError) setEmailError("");
            }}
            maxLength={LIMITS.EMAIL_MAX}
            className={cn("flex-1 min-w-0", emailError ? "border-destructive/50" : "")}
          />
          <span className="shrink-0 text-muted-foreground">@</span>
          <Input
            type="text"
            value={emailDomain}
            disabled={!emailEditable}
            onChange={(e) => {
              setEmailDomain(e.target.value);
              if (emailError) setEmailError("");
            }}
            maxLength={LIMITS.EMAIL_MAX}
            className={cn("flex-1 min-w-0", emailError ? "border-destructive/50" : "")}
          />
          {!emailEditable && (
            <button
              type="button"
              onClick={() => setEmailEditable(true)}
              className="shrink-0 h-11 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              수정
            </button>
          )}
        </div>
      </FormField>

      {/* 이름 */}
      <FormField label="이름" required error={nameError}>
        <Input
          type="text"
          value={formName}
          onChange={(e) => {
            setFormName(e.target.value);
            if (nameError) setNameError(e.target.value.trim() ? "" : "이름을 입력해주세요");
          }}
          className={nameError ? "border-destructive/50" : ""}
        />
      </FormField>

      {/* 비밀번호 */}
      <FormField label="비밀번호" required error={passwordError}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) {
                const { valid, errors } = validatePassword(e.target.value);
                setPasswordError(valid ? "" : errors[0]);
              }
              if (passwordConfirmError && passwordConfirm) {
                setPasswordConfirmError(
                  e.target.value !== passwordConfirm ? "비밀번호가 일치하지 않습니다" : ""
                );
              }
            }}
            placeholder="영문 소문자·숫자·특수문자 포함 8자 이상"
            className={cn("pr-10", passwordError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </FormField>

      {/* 비밀번호 확인 */}
      <FormField label="비밀번호 확인" required error={passwordConfirmError}>
        <div className="relative">
          <Input
            type={showPasswordConfirm ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              setPasswordConfirmError(validatePasswordConfirm(password, e.target.value));
            }}
            placeholder="비밀번호를 다시 입력해주세요"
            className={cn("pr-10", passwordConfirmError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      {/* 생년월일 */}
      <FormField label="생년월일" required error={birthDateError}>
        <DateSelectPicker
          value={birthDate}
          onChange={(v) => { setBirthDate(v); if (birthDateError) setBirthDateError(""); }}
          maxDate={new Date().toISOString().split("T")[0]}
          error={!!birthDateError}
        />
      </FormField>

      {/* 휴대폰 번호 */}
      <FormField label="휴대폰 번호" required error={phoneError}>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(formatPhone(e.target.value));
            if (phoneError) setPhoneError("");
          }}
          placeholder="010-0000-0000"
          maxLength={13}
          className={phoneError ? "border-destructive/50" : ""}
        />
      </FormField>

      {/* 추천인 */}
      <FormField label="추천인" optional hint={`${referrerNote.length}/${LIMITS.REFERRER_NOTE_MAX}`}>
        <Input
          type="text"
          value={referrerNote}
          onChange={(e) => setReferrerNote(e.target.value.slice(0, LIMITS.REFERRER_NOTE_MAX))}
          maxLength={LIMITS.REFERRER_NOTE_MAX}
        />
      </FormField>

      {/* 약관 동의 */}
      <div className="space-y-3 pt-1">
        <p className="text-sm font-medium text-foreground">약관 동의</p>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-lg">
          <input
            type="checkbox"
            checked={agreeAge && agreeTerms && agreePrivacy && agreeSms}
            onChange={(e) => {
              setAgreeAge(e.target.checked);
              setAgreeTerms(e.target.checked);
              setAgreePrivacy(e.target.checked);
              setAgreeSms(e.target.checked);
            }}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-sm font-semibold text-foreground">전체 동의</span>
        </label>

        <div className="space-y-2.5 pl-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeAge}
              onChange={(e) => setAgreeAge(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">
              <span className="text-destructive mr-0.5">[필수]</span>만 14세 이상입니다
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">
              <span className="text-destructive mr-0.5">[필수]</span>
              <button
                type="button"
                onClick={() => setPolicyModal("terms")}
                className="underline underline-offset-2 hover:text-foreground"
              >
                이용약관
              </button>
              에 동의합니다
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">
              <span className="text-destructive mr-0.5">[필수]</span>
              <button
                type="button"
                onClick={() => setPolicyModal("privacy")}
                className="underline underline-offset-2 hover:text-foreground"
              >
                개인정보 처리방침
              </button>
              에 동의합니다
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeSms}
              onChange={(e) => setAgreeSms(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">
              <span className="text-muted-foreground mr-0.5">[선택]</span>SMS 수신에 동의합니다
            </span>
          </label>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3 text-center">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "처리 중..." : "회원가입 완료"}
      </button>

      <PolicyModal type={policyModal} onClose={() => setPolicyModal(null)} />
    </form>
  );
}
