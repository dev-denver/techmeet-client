"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="h-7 w-7 text-red-400" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-zinc-800">페이지를 불러오지 못했습니다</p>
        <p className="text-sm text-zinc-500">잠시 후 다시 시도해주세요</p>
      </div>
      <Button variant="outline" onClick={reset} className="mt-2">
        다시 시도
      </Button>
    </div>
  );
}
