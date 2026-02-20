"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
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
      if (res.ok) {
        router.refresh();
      }
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

  if (compact) {
    return (
      <Link href={`/projects/${application.projectId}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer min-w-[200px] max-w-[220px]">
          <CardContent className="space-y-2">
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {application.projectTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(application.appliedAt)} 지원
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  const canCancel = application.status === "pending";

  return (
    <div className="relative">
      <Link href={`/projects/${application.projectId}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
                {application.projectTitle}
              </h3>
              <Badge variant="outline" className={`${config.className} shrink-0`}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {application.coverLetter}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>희망 단가: {application.expectedRate.toLocaleString()}만원/월</span>
              <span>{formatDate(application.appliedAt)} 지원</span>
            </div>

            {canCancel && (
              <div
                className="flex items-center gap-2 pt-1"
                onClick={(e) => e.preventDefault()}
              >
                {confirmCancel ? (
                  <>
                    <span className="text-xs text-red-500 flex-1">지원을 취소할까요?</span>
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
                      className="h-7 text-xs px-3"
                      onClick={handleCancelAbort}
                    >
                      돌아가기
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-3 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={handleCancel}
                  >
                    지원 취소
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
