"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type ToastType = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다");
  return ctx;
}

const TOAST_DURATION_MS = 2000;

/**
 * 의존성 없는 경량 토스트. 저장/삭제 성공 피드백 용도.
 * BottomNavigation(h-16) 위(bottom-20), BottomSheet(z-[60])보다 위(z-[70])에 표시된다.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ id: Date.now(), message, type });
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex justify-center px-4">
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200",
              toast.type === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-foreground text-background"
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
