"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword, validatePhone, validateBirthDate, formatPhone } from "@/lib/utils/validation";

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

  useEffect(() => {
    if (!email || !kakaoId) {
      router.replace("/login");
    }
  }, [email, kakaoId, router]);

  const [formName, setFormName] = useState(name);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!email || !kakaoId) {
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
      {/* 이메일 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">이메일</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-400">카카오 계정 이메일로 고정됩니다</p>
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

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "가입 중..." : "회원가입 완료"}
      </button>
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
            <p className="text-sm text-muted-foreground mt-1">
              카카오 계정으로 가입하고 있습니다
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-zinc-400">로딩 중...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
