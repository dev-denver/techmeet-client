"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  projectId: string;
  userId: string;
}

export function ShareButton({ projectId, userId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/projects/${projectId}?ref=${userId}`;

    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // 사용자 취소 등 → clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요:", url);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => void handleShare()}
      className="gap-1.5 shrink-0"
      aria-label="프로젝트 공유하기"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          복사됨
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          공유
        </>
      )}
    </Button>
  );
}
