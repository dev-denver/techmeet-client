"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";

interface AvatarUploadProps {
  initialAvatarUrl?: string;
  name: string;
}

export function AvatarUpload({ initialAvatarUrl, name }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name.split("").slice(0, 2).join("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as { data?: { avatarUrl: string }; error?: string };

      if (!res.ok) {
        setError(json.error ?? "업로드에 실패했습니다");
        return;
      }

      if (json.data?.avatarUrl) {
        setAvatarUrl(json.data.avatarUrl);
      }
    } catch {
      setError("업로드 중 오류가 발생했습니다");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
        aria-label="프로필 사진 변경"
      >
        <Avatar className="h-16 w-16">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="text-lg font-semibold bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity",
            isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isUploading ? (
            <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </button>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
