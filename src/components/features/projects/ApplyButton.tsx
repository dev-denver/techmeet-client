"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmit } from "@/hooks/useSubmit";
import { applicationsApi } from "@/lib/api/applications";
import { LIMITS } from "@/lib/constants/limits";
import { cn } from "@/lib/utils/cn";

const MAX_NOTE = LIMITS.NOTE_MAX;
// BottomSheet footer에 제출 버튼을 두고, form은 sheet body 안에 있어 별도 id로 연결
const FORM_ID = "apply-form";

interface ApplyButtonProps {
  projectId: string;
}

function validateNote(value: string): string {
  if (!value.trim()) return "참고사항을 입력해주세요";
  return "";
}

function validateRate(value: string): string {
  const rate = Number(value);
  if (!value) return "희망 단가를 입력해주세요";
  if (isNaN(rate) || rate < LIMITS.RATE_MIN) return "올바른 금액을 입력해주세요";
  if (rate > LIMITS.RATE_MAX) return `희망 단가는 ${LIMITS.RATE_MAX.toLocaleString()}만원 이하로 입력해주세요`;
  return "";
}

export function ApplyButton({ projectId }: ApplyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [noteError, setNoteError] = useState("");
  const [rateError, setRateError] = useState("");
  const { isLoading: isSubmitting, error: serverError, setError: setServerError, submit } = useSubmit();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const noteErr = validateNote(note);
    const rErr = validateRate(expectedRate);
    setNoteError(noteErr);
    setRateError(rErr);
    if (noteErr || rErr) return;

    await submit(
      () =>
        applicationsApi.create({
          projectId,
          note: note.trim(),
          expectedRate: Number(expectedRate),
        }),
      {
        onSuccess: () => {
          setOpen(false);
          router.push("/projects/applications");
        },
      }
    );
  }

  function handleOpen() {
    setNote("");
    setExpectedRate("");
    setNoteError("");
    setRateError("");
    setServerError("");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setNoteError("");
    setRateError("");
    setServerError("");
  }

  const charCount = note.length;

  return (
    <>
      <Button className="w-full h-12 text-base font-semibold" onClick={handleOpen}>
        지원하기
      </Button>

      <BottomSheet
        open={open}
        onClose={handleClose}
        footer={
          <div className="px-5 pt-3 pb-6 space-y-2.5">
            <ErrorMessage size="sm">{serverError}</ErrorMessage>
            <Button
              type="submit"
              form={FORM_ID}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              className="w-full h-12 text-base font-semibold"
            >
              {isSubmitting ? "제출 중..." : "지원 신청"}
            </Button>
          </div>
        }
      >
        <div className="px-5 pt-2 pb-4 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">지원하기</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              닫기
            </button>
          </div>

          <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
            <FormField label="참고사항" required error={noteError}>
              <div className="relative">
                <Textarea
                  value={note}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, MAX_NOTE);
                    setNote(value);
                    if (noteError) setNoteError(validateNote(value));
                  }}
                  placeholder="프로젝트 지원과 관련해 전달하고 싶은 내용이나 참고사항을 자유롭게 적어주세요"
                  rows={5}
                  maxLength={MAX_NOTE}
                  className={cn("pb-7", noteError ? "border-destructive/50" : "")}
                />
                <span className="absolute bottom-2.5 right-3 text-xs tabular-nums text-muted-foreground pointer-events-none">
                  {charCount}/{MAX_NOTE}자
                </span>
              </div>
            </FormField>

            <FormField label="희망 단가" required error={rateError}>
              <div className="relative">
                <Input
                  type="number"
                  value={expectedRate}
                  onChange={(e) => {
                    setExpectedRate(e.target.value);
                    if (rateError) setRateError(validateRate(e.target.value));
                  }}
                  placeholder="예: 600"
                  min={LIMITS.RATE_MIN}
                  max={LIMITS.RATE_MAX}
                  className={cn("pr-16", rateError ? "border-destructive/50" : "")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  만원/월
                </span>
              </div>
            </FormField>
          </form>
        </div>
      </BottomSheet>
    </>
  );
}
