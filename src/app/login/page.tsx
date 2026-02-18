"use client";

import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { publicEnv } from "@/lib/config/env";

const KAKAO_ERROR_MESSAGES: Record<string, string> = {
  email_required: "이메일 제공에 동의해주셔야 로그인이 가능합니다",
  kakao_api_error: "카카오 로그인 처리 중 오류가 발생했습니다",
  missing_code: "잘못된 접근입니다",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const kakaoError = searchParams.get("error");
  const kakaoErrorMessage = kakaoError ? (KAKAO_ERROR_MESSAGES[kakaoError] ?? "로그인 중 오류가 발생했습니다") : null;

  function handleKakaoLogin() {
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${publicEnv.kakaoRestApiKey}` +
      `&redirect_uri=${encodeURIComponent(publicEnv.kakaoRedirectUri)}` +
      `&response_type=code`;
    window.location.href = kakaoAuthUrl;
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "로그인 중 오류가 발생했습니다");
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col items-center justify-between px-8 py-16">
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
          {/* 로고 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">테크밋</h1>
              <p className="text-sm text-muted-foreground mt-1">프리랜서 전용</p>
            </div>
          </div>

          {/* 설명 */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-zinc-800">
              프리랜서 개발자를 위한
              <br />
              전용 프로젝트 플랫폼
            </p>
            <p className="text-sm text-muted-foreground">
              테크밋 소속 프리랜서 회원만 이용 가능합니다.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* 카카오 에러 메시지 */}
            {kakaoErrorMessage && (
              <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg px-4 py-3">
                {kakaoErrorMessage}
              </p>
            )}

            {/* 카카오 로그인 버튼 */}
            <button
              className="flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-[15px] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90 active:opacity-80"
              style={{ backgroundColor: "#FEE500" }}
              onClick={handleKakaoLogin}
            >
              <MessageSquare className="h-5 w-5" />
              카카오 로그인
            </button>

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-xs text-zinc-400">또는 이메일로 로그인</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* 이메일 로그인 폼 */}
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="이메일"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="비밀번호"
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

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-zinc-900 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>
        </div>

        {/* 이용약관 */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          로그인 시{" "}
          <button className="underline underline-offset-2">이용약관</button>
          {" "}및{" "}
          <button className="underline underline-offset-2">개인정보 처리방침</button>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
