"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center h-14 px-4 gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-md hover:bg-accent active:bg-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {label && <h1 className="text-base font-semibold">{label}</h1>}
      </div>
    </header>
  );
}
