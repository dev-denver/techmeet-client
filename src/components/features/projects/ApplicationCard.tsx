"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/ui/nav-link";
import { surfaceCardVariants } from "@/components/ui/surface-card";
import { cn } from "@/lib/utils/cn";
import { useToast } from "@/components/ui/toast";
import { applicationsApi } from "@/lib/api/applications";
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
  const { showToast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // 1차 클릭: 확인 문구 노출 → 2차 클릭: 실제 취소 (인라인 2단계 확인 패턴)
  async function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();

    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }

    setIsCancelling(true);
    try {
      await applicationsApi.withdraw(application.id);
      showToast("지원이 취소되었습니다");
      router.refresh();
    } catch {
      showToast("지원 취소에 실패했습니다. 다시 시도해주세요", "error");
    } finally {
      setIsCancelling(false);
      setConfirmCancel(false);
    }
  }

  function handleCancelAbort(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmCancel(false);
  }

  /* ─── compact (홈 가로 스크롤) ─── */
  if (compact) {
    const content = (
      <>
        <Badge variant="outline" shape="pill" className={cn("w-fit", config.className)}>
          {config.label}
        </Badge>
        <p className="text-sm font-semibold leading-snug line-clamp-2">
          {application.isProjectDeleted ? "삭제된 프로젝트" : application.projectTitle}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(application.appliedAt)} 지원
        </p>
      </>
    );

    if (application.isProjectDeleted) {
      return (
        <div
          className={cn(
            surfaceCardVariants({ padding: "compact" }),
            "opacity-60 min-w-[180px] max-w-[200px] space-y-2.5"
          )}
        >
          {content}
        </div>
      );
    }

    return (
      <NavLink
        href={`/projects/${application.projectId}`}
        className={cn(
          surfaceCardVariants({ padding: "compact" }),
          "hover:border-muted-foreground/40 transition-colors min-w-[180px] max-w-[200px] space-y-2.5"
        )}
      >
        {content}
      </NavLink>
    );
  }

  /* ─── full ─── */
  const canCancel = application.status === ApplicationStatus.Pending;
  const accent = config.borderLeft ?? "border-l-border";

  const content = (
    <>
      <div className="px-4 pt-4 pb-4 space-y-2.5">
        {/* 상태 + 날짜 */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" shape="pill" className={config.className}>
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(application.appliedAt)} 지원
          </span>
        </div>

        {/* 프로젝트 제목 */}
        <h3 className="font-bold text-base leading-snug line-clamp-2">
          {application.isProjectDeleted ? "삭제된 프로젝트" : application.projectTitle}
        </h3>

        {/* 참고사항 */}
        {application.note && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/40 rounded-lg px-3 py-2">
            {application.note}
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
          onClick={(e) => e.stopPropagation()}
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
    </>
  );

  if (application.isProjectDeleted) {
    return (
      <div className="relative">
        <div
          className={cn(
            surfaceCardVariants({ padding: "none" }),
            "border-l-4 border-l-0 opacity-60",
            accent
          )}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <NavLink
        href={`/projects/${application.projectId}`}
        className={cn(surfaceCardVariants({ padding: "none" }), "block border-l-4 border-l-0", accent)}
      >
        {content}
      </NavLink>
    </div>
  );
}
