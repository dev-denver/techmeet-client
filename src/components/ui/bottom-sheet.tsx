"use client";

import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  hasBottomNav?: boolean;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, hasBottomNav = false, children }: BottomSheetProps) {
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
          "w-full max-w-[430px] rounded-t-2xl bg-white flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300",
          hasBottomNav && "mb-16"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-200" />
        </div>
        <div className="overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
