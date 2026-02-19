"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleWithdraw() {
    if (!confirmed) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/withdraw", { method: "POST" });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "탈퇴 처리 중 오류가 발생했습니다.");
        return;
      }
      router.replace("/login");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 경고 아이콘 */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-center">회원 탈퇴</h2>
      </div>

      {/* 안내 내용 */}
      <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-zinc-800">탈퇴 전 꼭 확인해주세요</p>
        <ul className="text-sm text-zinc-600 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5 shrink-0">•</span>
            <span>탈퇴 후 로그인이 불가합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5 shrink-0">•</span>
            <span>진행 중인 프로젝트 지원 내역이 모두 취소됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5 shrink-0">•</span>
            <span>개인정보는 탈퇴 후 30일간 보관 후 파기됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5 shrink-0">•</span>
            <span>재가입을 원할 경우 담당 매니저에게 문의해주세요.</span>
          </li>
        </ul>
      </div>

      {/* 동의 체크박스 */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-zinc-900"
        />
        <span className="text-sm text-zinc-700">
          위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleWithdraw}
          disabled={!confirmed || isLoading}
          className="w-full rounded-xl bg-red-500 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40"
        >
          {isLoading ? "처리 중..." : "회원 탈퇴"}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full rounded-xl border border-zinc-200 py-3.5 text-[15px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          취소
        </button>
      </div>
    </div>
  );
}
