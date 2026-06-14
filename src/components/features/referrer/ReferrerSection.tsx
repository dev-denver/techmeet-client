"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { ReferrerSearchModal } from "./ReferrerSearchModal";
import { profileApi } from "@/lib/api/profile";
import { useSubmit } from "@/hooks/useSubmit";
import { useToast } from "@/components/ui/toast";
import type { ReferrerSearchResult } from "@/types/api";

interface Props {
  currentReferrerName?: string;
}

export function ReferrerSection({ currentReferrerName }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, error, submit } = useSubmit();

  async function handleSelect(referrer: ReferrerSearchResult) {
    setShowModal(false);
    await submit(() => profileApi.setReferrer({ referrerId: referrer.id }), {
      onSuccess: () => {
        showToast("추천인이 등록되었습니다");
        router.refresh();
      },
    });
  }

  if (currentReferrerName) {
    return (
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm text-muted-foreground">추천인</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currentReferrerName}</span>
          <span className="flex items-center gap-1 text-xs text-status-success bg-status-success/10 px-2 py-0.5 rounded-full">
            <UserCheck className="h-3 w-3" />
            등록 완료
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">추천인</span>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-70 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "처리 중..." : "추천인 등록"}
          </button>
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>

      {showModal && (
        <ReferrerSearchModal
          onSelect={(referrer) => void handleSelect(referrer)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
