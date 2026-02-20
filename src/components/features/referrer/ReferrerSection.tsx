"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { ReferrerSearchModal } from "./ReferrerSearchModal";
import type { ReferrerSearchResult } from "@/types/api";

interface Props {
  currentReferrerName?: string;
}

export function ReferrerSection({ currentReferrerName }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSelect(referrer: ReferrerSearchResult) {
    setShowModal(false);
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile/referrer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerId: referrer.id }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "추천인 등록 중 오류가 발생했습니다");
        return;
      }
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  if (currentReferrerName) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-muted-foreground">추천인</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currentReferrerName}</span>
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <UserCheck className="h-3 w-3" />
            등록 완료
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1 py-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">추천인</span>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="text-sm font-medium text-zinc-900 underline underline-offset-2 hover:opacity-70 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "처리 중..." : "추천인 등록"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {showModal && (
        <ReferrerSearchModal
          onSelect={(referrer) => void handleSelect(referrer)}
          onClose={() => setShowModal(false)}
          hasBottomNav
        />
      )}
    </>
  );
}
