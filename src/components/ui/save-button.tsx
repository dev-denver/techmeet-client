"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  label?: string;
  loadingLabel?: string;
  successLabel?: string;
}

export function SaveButton({
  isLoading,
  isSuccess,
  label = "저장",
  loadingLabel = "저장 중...",
  successLabel = "저장되었습니다",
  disabled,
  className,
  children,
  type = "submit",
  ...props
}: SaveButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? isLoading ?? isSuccess}
      className={cn(
        "w-full rounded-xl py-3.5 text-base font-semibold transition-all flex items-center justify-center gap-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSuccess
          ? "bg-status-success text-white cursor-default"
          : "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {isSuccess ? (
        <>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {successLabel}
        </>
      ) : isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          {loadingLabel}
        </>
      ) : (
        children ?? label
      )}
    </button>
  );
}
