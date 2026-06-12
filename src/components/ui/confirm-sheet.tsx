"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  description?: string;
  /** 확인 버튼 레이블 (기본: "삭제") */
  confirmLabel?: string;
  /** true면 확인 버튼이 destructive 스타일 (기본: true) */
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 되돌릴 수 없는 작업(삭제 등) 전 확인용 바텀시트.
 * window.confirm() 대신 사용한다 — 모바일 앱형 UX 일관성 유지 목적.
 */
export function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel = "삭제",
  destructive = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={isLoading ? () => {} : onClose} hasBottomNav>
      <div className="px-5 pt-2 pb-6">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            size="lg"
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading || undefined}
          >
            {isLoading ? "처리 중..." : confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
