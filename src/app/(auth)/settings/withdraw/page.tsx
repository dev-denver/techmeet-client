"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";

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
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-lg font-bold text-center">회원 탈퇴</h2>
      </div>

      {/* 안내 내용 */}
      <div className="bg-muted rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">탈퇴 전 꼭 확인해주세요</p>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>탈퇴 후 로그인이 불가합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>진행 중인 프로젝트 지원 내역이 모두 취소됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>개인정보는 탈퇴 후 30일간 보관 후 파기됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>탈퇴 후에도 신규 회원으로 다시 가입하실 수 있습니다. (기존 정보는 복구되지 않습니다)</span>
          </li>
        </ul>
      </div>

      {/* 동의 체크박스 */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <span className="text-sm text-foreground/80">
          위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
        </span>
      </label>

      <ErrorMessage>{error}</ErrorMessage>

      <div className="space-y-3">
        <button
          onClick={handleWithdraw}
          disabled={!confirmed || isLoading}
          aria-busy={isLoading || undefined}
          className="w-full rounded-xl bg-destructive py-3.5 text-[15px] font-semibold text-destructive-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isLoading ? "처리 중..." : "회원 탈퇴"}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full rounded-xl border border-border py-3.5 text-[15px] font-semibold text-foreground/80 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          취소
        </button>
      </div>
    </div>
  );
}
