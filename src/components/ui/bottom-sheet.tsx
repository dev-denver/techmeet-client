"use client";

import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  hasBottomNav?: boolean;
  maxWidth?: "sm" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, hasBottomNav = false, maxWidth = "sm", footer, children }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full rounded-t-2xl bg-card flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300",
          maxWidth === "lg" ? "max-w-[600px]" : "max-w-[430px]",
          hasBottomNav && "mb-16"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>
        <div className="overflow-y-auto overscroll-contain flex-1">
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
