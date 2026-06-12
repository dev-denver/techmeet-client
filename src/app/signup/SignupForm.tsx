"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { validatePassword, validatePhone, validateBirthDateWithMessage, formatPhone } from "@/lib/utils/validation";
import { ReferrerSearchModal } from "@/components/features/referrer/ReferrerSearchModal";
import { PolicyModal } from "@/components/features/signup/PolicyModal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { DateSelectPicker } from "@/components/ui/date-select-picker";
import { cn } from "@/lib/utils/cn";
import type { ReferrerSearchResult } from "@/types/api";
import { encryptPassword } from "@/lib/crypto/client";

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "8자 이상", ok: password.length >= 8 },
    { label: "소문자", ok: /[a-z]/.test(password) },
    { label: "숫자", ok: /[0-9]/.test(password) },
    { label: "특수문자", ok: /[!@#$%^&*()_+\-=]/.test(password) },
  ];

  const passCount = checks.filter((c) => c.ok).length;
  const strengthLabel = passCount <= 1 ? "약함" : passCount <= 3 ? "보통" : "강함";
  const strengthColor =
    passCount <= 1 ? "bg-red-500" : passCount <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-2 pt-0.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${strengthColor}`}
            style={{ width: `${(passCount / checks.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 w-6 text-right">{strengthLabel}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs px-1.5 py-0.5 rounded ${c.ok ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"
              }`}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface SignupFormProps {
  maskedEmail: string;
  kakaoId: string;
  name: string;
  refParam: string;
}

export function SignupForm({ maskedEmail, kakaoId, name, refParam }: SignupFormProps) {
  const router = useRouter();

  const [formName, setFormName] = useState(name);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [referrer, setReferrer] = useState<ReferrerSearchResult | null>(null);
  const [showReferrerModal, setShowReferrerModal] = useState(false);
  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | null>(null);

  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!refParam || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(refParam)) return;
    void (async () => {
      try {
        const res = await fetch(`/api/profile/referrer/lookup?id=${encodeURIComponent(refParam)}`);
        if (!res.ok) return;
        const { data } = (await res.json()) as { data?: ReferrerSearchResult };
        if (data) setReferrer(data);
      } catch {
        /* fallback to manual input */
      }
    })();
  }, [refParam]);

  function validatePasswordConfirm(pw: string, confirm: string): string {
    if (!confirm) return "";
    return pw !== confirm ? "비밀번호가 일치하지 않습니다" : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    let valid = true;

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
      const pkRes = await fetch("/api/auth/public-key");
      if (!pkRes.ok) {
        const pkData = await pkRes.json().catch(() => ({})) as { error?: string };
        setServerError(pkData.error ?? "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      const pkData = (await pkRes.json()) as { publicKey: string };
      if (!pkData.publicKey) {
        setServerError("서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.");
        return;
      }
      const encryptedPassword = await encryptPassword(password, pkData.publicKey);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encryptedPassword,
          name: formName,
          birth_date: birthDate,
          phone,
          kakaoId,
          agree_marketing: agreeMarketing,
          referrer_id: referrer?.id ?? null,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setServerError(data.error ?? "회원가입 중 오류가 발생했습니다");
        return;
      }

      router.replace("/");
    } catch (err) {
      console.error("[회원가입] 클라이언트 오류:", err);
      setServerError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 이메일 (마스킹 표시) */}
      <FormField label="이메일" hint="카카오 계정 이메일로 고정됩니다">
        <Input type="text" value={maskedEmail} disabled />
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
          className={nameError ? "border-red-300" : ""}
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
            className={cn("pr-10", passwordError ? "border-red-300" : "")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
            className={cn("pr-10", passwordConfirmError ? "border-red-300" : "")}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
          className={phoneError ? "border-red-300" : ""}
        />
      </FormField>

      {/* 추천인 */}
      <FormField label="추천인" optional>
        {referrer ? (
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 h-11">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">{referrer.name}</p>
              <p className="text-xs text-zinc-400 shrink-0">{referrer.maskedPhone}</p>
            </div>
            <button
              type="button"
              onClick={() => setReferrer(null)}
              className="p-1 rounded-full hover:bg-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              aria-label="추천인 제거"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowReferrerModal(true)}
            className="w-full h-11 rounded-lg border border-dashed border-zinc-300 bg-white px-3 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors text-left"
          >
            + 추천인 추가
          </button>
        )}
      </FormField>

      {/* 약관 동의 */}
      <div className="space-y-3 pt-1">
        <p className="text-sm font-medium text-zinc-700">약관 동의</p>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-zinc-50 rounded-lg">
          <input
            type="checkbox"
            checked={agreeAge && agreeTerms && agreePrivacy && agreeMarketing}
            onChange={(e) => {
              setAgreeAge(e.target.checked);
              setAgreeTerms(e.target.checked);
              setAgreePrivacy(e.target.checked);
              setAgreeMarketing(e.target.checked);
            }}
            className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
          />
          <span className="text-sm font-semibold text-zinc-800">전체 동의</span>
        </label>

        <div className="space-y-2.5 pl-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeAge}
              onChange={(e) => setAgreeAge(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-red-500 mr-0.5">[필수]</span>만 14세 이상입니다
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-red-500 mr-0.5">[필수]</span>
              <button
                type="button"
                onClick={() => setPolicyModal("terms")}
                className="underline underline-offset-2 hover:text-zinc-900"
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
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-red-500 mr-0.5">[필수]</span>
              <button
                type="button"
                onClick={() => setPolicyModal("privacy")}
                className="underline underline-offset-2 hover:text-zinc-900"
              >
                개인정보 처리방침
              </button>
              에 동의합니다
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={(e) => setAgreeMarketing(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-zinc-400 mr-0.5">[선택]</span>마케팅 정보 수신에 동의합니다
            </span>
          </label>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3 text-center">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 w-full rounded-xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "처리 중..." : "회원가입 완료"}
      </button>

      {showReferrerModal && (
        <ReferrerSearchModal
          onSelect={(selected) => {
            setReferrer(selected);
            setShowReferrerModal(false);
          }}
          onClose={() => setShowReferrerModal(false)}
          maxWidth="lg"
        />
      )}

      <PolicyModal type={policyModal} onClose={() => setPolicyModal(null)} />
    </form>
  );
}
