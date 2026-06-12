"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { ErrorMessage } from "@/components/ui/error-message";
import { cn } from "@/lib/utils/cn";
import { LIMITS } from "@/lib/constants/limits";
import type { Career } from "@/types";

export interface CareerFormState {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  techStackInput: string;
}

export interface CareerFieldErrors {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export const EMPTY_FORM: CareerFormState = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  techStackInput: "",
};

export function careerToForm(career: Career): CareerFormState {
  return {
    company: career.company,
    role: career.role,
    startDate: career.startDate,
    endDate: career.endDate ?? "",
    isCurrent: career.isCurrent,
    description: career.description,
    techStackInput: career.techStack.join(", "),
  };
}

interface CareerFormProps {
  form: CareerFormState;
  fieldErrors: CareerFieldErrors;
  serverError: string;
  isSubmitting: boolean;
  isEdit: boolean;
  onUpdate: (field: keyof CareerFormState, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/** 경력 추가/수정 인라인 폼 (CareerSectionClient에서 사용) */
export function CareerForm({
  form,
  fieldErrors,
  serverError,
  isSubmitting,
  isEdit,
  onUpdate,
  onSubmit,
  onCancel,
}: CareerFormProps) {
  const inputClass = (error?: string) =>
    cn(
      "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      error ? "border-destructive/50" : "border-input"
    );

  return (
    <form onSubmit={onSubmit} className="space-y-3.5 bg-muted/50 rounded-xl p-4">
      <p className="text-sm font-semibold">{isEdit ? "경력 수정" : "경력 추가"}</p>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="회사명" required error={fieldErrors.company}>
          <input
            type="text"
            value={form.company}
            onChange={(e) => onUpdate("company", e.target.value)}
            placeholder="테크밋"
            maxLength={LIMITS.COMPANY_MAX}
            className={inputClass(fieldErrors.company)}
          />
        </FormField>
        <FormField label="직무/역할" required error={fieldErrors.role}>
          <input
            type="text"
            value={form.role}
            onChange={(e) => onUpdate("role", e.target.value)}
            placeholder="프론트엔드 개발자"
            maxLength={LIMITS.ROLE_MAX}
            className={inputClass(fieldErrors.role)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="시작일" required error={fieldErrors.startDate}>
          <MonthYearPicker
            value={form.startDate ? form.startDate.slice(0, 7) : ""}
            onChange={(v) => onUpdate("startDate", v ? `${v}-01` : "")}
            error={!!fieldErrors.startDate}
          />
        </FormField>
        <FormField label="종료일" error={fieldErrors.endDate}>
          <MonthYearPicker
            value={form.endDate ? form.endDate.slice(0, 7) : ""}
            onChange={(v) => onUpdate("endDate", v ? `${v}-01` : "")}
            disabled={form.isCurrent}
            error={!!fieldErrors.endDate}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isCurrent}
          onChange={(e) => onUpdate("isCurrent", e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-foreground">현재 재직 중</span>
      </label>

      <FormField
        label="업무 설명"
        required
        error={fieldErrors.description}
        hint={`${form.description.length}/${LIMITS.DESCRIPTION_MAX}`}
      >
        <Textarea
          value={form.description}
          onChange={(e) => onUpdate("description", e.target.value.slice(0, LIMITS.DESCRIPTION_MAX))}
          placeholder="담당한 업무와 성과를 간략히 적어주세요"
          rows={3}
          maxLength={LIMITS.DESCRIPTION_MAX}
          className={fieldErrors.description ? "border-destructive/50" : ""}
        />
      </FormField>

      <FormField label="기술 스택" optional hint="쉼표(,)로 구분하여 입력">
        <Input
          type="text"
          value={form.techStackInput}
          onChange={(e) => onUpdate("techStackInput", e.target.value)}
          placeholder="React, TypeScript, Node.js"
        />
      </FormField>

      <ErrorMessage>{serverError}</ErrorMessage>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting} aria-busy={isSubmitting || undefined} className="flex-1">
          {isSubmitting ? "저장 중..." : isEdit ? "수정 완료" : "추가"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
      </div>
    </form>
  );
}
