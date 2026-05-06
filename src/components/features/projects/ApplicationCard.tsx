"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus } from "@/types";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
  compact?: boolean;
}


export function ApplicationCard({
  application,
  compact = false,
}: ApplicationCardProps) {
  const config = APPLICATION_STATUS_CONFIG[application.status];
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setIsCancelling(false);
      setConfirmCancel(false);
    }
  }

  function handleCancelAbort(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmCancel(false);
  }

  /* ─── compact (홈 가로 스크롤) ─── */
  if (compact) {
    return (
      <Link href={`/projects/${application.projectId}`}>
        <div className="rounded-xl bg-card border border-border hover:border-muted-foreground/40 hover:shadow-sm transition-all cursor-pointer min-w-[180px] max-w-[200px] p-3.5 space-y-2.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit inline-block ${config.className}`}>
            {config.label}
          </span>
          <p className="text-sm font-semibold leading-snug line-clamp-2">
            {application.projectTitle}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(application.appliedAt)} 지원
          </p>
        </div>
      </Link>
    );
  }

  /* ─── full ─── */
  const canCancel = application.status === ApplicationStatus.Pending;
  const accent = config.borderLeft ?? "border-l-border";

  return (
    <div className="relative">
      <Link href={`/projects/${application.projectId}`}>
        <div
          className={`rounded-xl border-l-4 border border-l-0 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden ${accent}`}
        >
          <div className="px-4 pt-4 pb-3.5 space-y-2.5">
            {/* 상태 + 날짜 */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.className}`}>
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(application.appliedAt)} 지원
              </span>
            </div>

            {/* 프로젝트 제목 */}
            <h3 className="font-bold text-base leading-snug line-clamp-2">
              {application.projectTitle}
            </h3>

            {/* 지원 동기 */}
            {application.coverLetter && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/40 rounded-lg px-3 py-2">
                {application.coverLetter}
              </p>
            )}

            {/* 희망 단가 */}
            {application.expectedRate !== null && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-xs text-muted-foreground">희망 단가</span>
                <span className="text-sm font-semibold">
                  {application.expectedRate.toLocaleString()}만원/월
                </span>
              </div>
            )}
          </div>

          {/* 지원 취소 영역 */}
          {canCancel && (
            <div
              className="border-t border-border px-4 py-2.5 flex items-center gap-2 bg-muted/30"
              onClick={(e) => e.preventDefault()}
            >
              {confirmCancel ? (
                <>
                  <span className="text-xs text-destructive flex-1">지원을 취소할까요?</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs px-3"
                    disabled={isCancelling}
                    onClick={handleCancel}
                  >
                    {isCancelling ? "취소 중..." : "확인"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-3 bg-background"
                    onClick={handleCancelAbort}
                  >
                    돌아가기
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-3 text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto"
                  onClick={handleCancel}
                >
                  지원 취소
                </Button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
