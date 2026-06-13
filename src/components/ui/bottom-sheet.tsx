"use client";

import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  hasBottomNav?: boolean;
  /** 고정 헤더 영역 (스크롤되지 않음). 지정 시 기본 드래그 핸들 대신 표시 */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, hasBottomNav = false, header, footer, children }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 bg-black/50 z-[60] flex items-end justify-center animate-in fade-in duration-200",
        hasBottomNav ? "bottom-16" : "bottom-0"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full max-w-[600px] rounded-t-2xl bg-card flex flex-col overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300",
          hasBottomNav ? "max-h-[calc(85vh-4rem)]" : "max-h-[85vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {header ? (
          <div className="shrink-0">{header}</div>
        ) : (
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted" />
          </div>
        )}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
