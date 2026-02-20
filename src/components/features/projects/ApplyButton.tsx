"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ApplyButtonProps {
  projectId: string;
}

export function ApplyButton({ projectId }: ApplyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const rate = Number(expectedRate);
    if (!coverLetter.trim()) {
      setError("지원 동기를 입력해주세요");
      return;
    }
    if (!expectedRate || isNaN(rate) || rate <= 0) {
      setError("희망 단가를 올바르게 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          coverLetter: coverLetter.trim(),
          expectedRate: rate,
        }),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "지원 신청에 실패했습니다");
        return;
      }

      setOpen(false);
      router.push("/projects/applications");
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={() => setOpen(true)}
      >
        지원하기
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div
        className="w-full max-w-[430px] rounded-t-2xl bg-white p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">지원하기</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            닫기
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              지원 동기 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="해당 프로젝트에 지원하는 이유와 관련 경험을 간략히 적어주세요"
              rows={5}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              희망 단가 (만원/월) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={expectedRate}
                onChange={(e) => setExpectedRate(e.target.value)}
                placeholder="예: 600"
                min={1}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                만원/월
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold"
          >
            {isSubmitting ? "제출 중..." : "지원 신청"}
          </Button>
        </form>
      </div>
    </div>
  );
}
