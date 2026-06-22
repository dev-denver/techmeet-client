"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { profileApi } from "@/lib/api/profile";
import { useSubmit } from "@/hooks/useSubmit";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { LIMITS } from "@/lib/constants/limits";

interface Props {
  currentReferrerNote?: string;
}

export function ReferrerSection({ currentReferrerNote }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [note, setNote] = useState("");
  const { isLoading, error, submit } = useSubmit();

  async function handleRegister() {
    const trimmed = note.trim();
    if (!trimmed) return;
    await submit(() => profileApi.setReferrerNote({ referrerNote: trimmed }), {
      onSuccess: () => {
        showToast("추천인이 등록되었습니다");
        router.refresh();
      },
    });
  }

  if (currentReferrerNote) {
    return (
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm text-muted-foreground">추천인</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currentReferrerNote}</span>
          <span className="flex items-center gap-1 text-xs text-status-success bg-status-success/10 px-2 py-0.5 rounded-full">
            <UserCheck className="h-3 w-3" />
            등록 완료
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground shrink-0">추천인</span>
        <div className="flex items-center gap-2 flex-1 max-w-[70%]">
          <Input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, LIMITS.REFERRER_NOTE_MAX))}
            maxLength={LIMITS.REFERRER_NOTE_MAX}
            className="h-9 min-w-0 flex-1 text-sm"
          />
          <button
            type="button"
            onClick={() => void handleRegister()}
            disabled={isLoading || !note.trim()}
            className="shrink-0 text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-70 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "처리 중..." : "등록"}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-1 text-right">{error}</p>}
    </div>
  );
}
