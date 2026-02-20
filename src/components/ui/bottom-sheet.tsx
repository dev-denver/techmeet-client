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
      className={cn(
        "fixed inset-0 bg-black/50 z-50 flex items-end justify-center",
        hasBottomNav && "pb-16"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[430px] rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
