"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { validatePassword, validatePhone, validateBirthDate, formatPhone } from "@/lib/utils/validation";
import { ReferrerSearchModal } from "@/components/features/referrer/ReferrerSearchModal";
import type { ReferrerSearchResult } from "@/types/api";

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "8자 이상", ok: password.length >= 8 },
    { label: "대문자", ok: /[A-Z]/.test(password) },
    { label: "소문자", ok: /[a-z]/.test(password) },
    { label: "숫자", ok: /[0-9]/.test(password) },
    { label: "특수문자", ok: /[!@#$%^&*()_+\-=]/.test(password) },
  ];

  const passCount = checks.filter((c) => c.ok).length;
  const strengthLabel =
    passCount <= 2 ? "약함" : passCount <= 4 ? "보통" : "강함";
  const strengthColor =
    passCount <= 2
      ? "bg-red-500"
      : passCount <= 4
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${strengthColor}`}
            style={{ width: `${(passCount / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500">{strengthLabel}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs px-1.5 py-0.5 rounded ${c.ok ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"}`}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";
  const name = searchParams.get("name") ?? "";
  const kakaoId = searchParams.get("kakao_id") ?? "";
  const reactivate = searchParams.get("reactivate") === "true";

  useEffect(() => {
    if (!email || (!kakaoId && !reactivate)) {
      router.replace("/login");
    }
  }, [email, kakaoId, reactivate, router]);

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!email || (!kakaoId && !reactivate)) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { valid, errors } = validatePassword(password);
    if (!valid) {
      setError(errors[0]);
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!birthDate || !validateBirthDate(birthDate)) {
      setError("올바른 생년월일을 입력해주세요");
      return;
    }

    if (!validatePhone(phone)) {
      setError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)");
      return;
    }

    if (!agreeAge) {
      setError("만 14세 이상만 가입할 수 있습니다.");
      return;
    }

    if (!agreeTerms) {
      setError("이용약관에 동의해주세요.");
      return;
    }

    if (!agreePrivacy) {
      setError("개인정보 처리방침에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: formName,
          birth_date: birthDate,
          phone,
          kakaoId,
          agree_marketing: agreeMarketing,
          reactivate,
          referrer_id: referrer?.id ?? null,
        }),
      });

      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "회원가입 중 오류가 발생했습니다");
        return;
      }

      router.replace("/");
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 재가입 안내 배너 */}
      {reactivate && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          이전에 탈퇴하신 계정입니다. 아래 정보를 입력하고 재가입을 완료해주세요.
        </div>
      )}

      {/* 이메일 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">이메일</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-400">
          {reactivate ? "이전에 사용하던 이메일로 고정됩니다" : "카카오 계정 이메일로 고정됩니다"}
        </p>
      </div>

      {/* 이름 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">이름</label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">비밀번호</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="영문 대소문자·숫자·특수문자 포함 8자 이상"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">비밀번호 확인</label>
        <div className="relative">
          <input
            type={showPasswordConfirm ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            placeholder="비밀번호를 다시 입력해주세요"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordConfirm && password !== passwordConfirm && (
          <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
        )}
      </div>

      {/* 생년월일 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">생년월일</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          max={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 휴대폰 번호 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">휴대폰 번호</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          required
          placeholder="010-0000-0000"
          maxLength={13}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 추천인 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">
          추천인 <span className="text-zinc-400 font-normal">(선택)</span>
        </label>
        {referrer ? (
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-zinc-800">{referrer.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{referrer.maskedPhone}</p>
            </div>
            <button
              type="button"
              onClick={() => setReferrer(null)}
              className="p-1 rounded-full hover:bg-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="추천인 제거"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowReferrerModal(true)}
            className="w-full rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors text-left"
          >
            + 추천인 추가
          </button>
        )}
      </div>

      {/* 약관 동의 */}
      <div className="space-y-3 pt-1">
        <p className="text-sm font-medium text-zinc-700">약관 동의</p>

        {/* 전체 동의 */}
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

        <div className="space-y-2 pl-1">
          {/* 만 14세 이상 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeAge}
              onChange={(e) => setAgreeAge(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-red-500">[필수]</span> 만 14세 이상입니다
            </span>
          </label>

          {/* 이용약관 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700 flex items-center gap-1">
              <span className="text-red-500">[필수]</span>
              <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-zinc-900">
                이용약관
              </Link>
              에 동의합니다
            </span>
          </label>

          {/* 개인정보 처리방침 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700 flex items-center gap-1">
              <span className="text-red-500">[필수]</span>
              <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-zinc-900">
                개인정보 처리방침
              </Link>
              에 동의합니다
            </span>
          </label>

          {/* 마케팅 수신 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={(e) => setAgreeMarketing(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700">
              <span className="text-zinc-400">[선택]</span> 마케팅 정보 수신에 동의합니다
            </span>
          </label>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "처리 중..." : reactivate ? "재가입 완료" : "회원가입 완료"}
      </button>

      {showReferrerModal && (
        <ReferrerSearchModal
          onSelect={(selected) => { setReferrer(selected); setShowReferrerModal(false); }}
          onClose={() => setShowReferrerModal(false)}
        />
      )}
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col px-8 py-12 overflow-y-auto">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-xl font-bold">T</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">회원가입</h1>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-zinc-400">로딩 중...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
