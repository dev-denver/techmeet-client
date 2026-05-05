"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CareerTimelineDot } from "@/components/features/profile/CareerTimelineDot";
import { cn } from "@/lib/utils/cn";
import { formatMonthYear } from "@/lib/utils/format";
import type { Career, AddCareerRequest } from "@/types";

interface CareerSectionClientProps {
  careers: Career[];
}

interface CareerFormState {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  techStackInput: string;
}

interface CareerFieldErrors {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

const EMPTY_FORM: CareerFormState = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  techStackInput: "",
};

function careerToForm(career: Career): CareerFormState {
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

export function CareerSectionClient({ careers }: CareerSectionClientProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<CareerFormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<CareerFieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAdd() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setServerError("");
    setEditingId(null);
    setIsAdding(true);
  }

  function openEdit(career: Career) {
    setForm(careerToForm(career));
    setFieldErrors({});
    setServerError("");
    setIsAdding(false);
    setEditingId(career.id);
  }

  function closeForm() {
    setIsAdding(false);
    setEditingId(null);
    setFieldErrors({});
    setServerError("");
  }

  function updateForm(field: keyof CareerFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const errors: CareerFieldErrors = {};
    if (!form.company.trim()) errors.company = "회사명을 입력해주세요";
    if (!form.role.trim()) errors.role = "직무/역할을 입력해주세요";
    if (!form.startDate) errors.startDate = "시작일을 입력해주세요";
    if (!form.isCurrent && !form.endDate) {
      errors.endDate = "종료일을 입력하거나 현재 재직 중을 선택해주세요";
    }
    if (form.startDate && form.endDate && !form.isCurrent && form.startDate > form.endDate) {
      errors.endDate = "종료일은 시작일 이후여야 합니다";
    }
    if (!form.description.trim()) errors.description = "업무 설명을 입력해주세요";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const techStack = form.techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: AddCareerRequest = {
      company: form.company.trim(),
      role: form.role.trim(),
      startDate: form.startDate,
      endDate: form.isCurrent ? undefined : form.endDate || undefined,
      isCurrent: form.isCurrent,
      description: form.description.trim(),
      techStack,
    };

    setIsSubmitting(true);
    setServerError("");
    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/profile/careers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/profile/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setServerError(data.error ?? "저장에 실패했습니다");
        return;
      }

      closeForm();
      router.refresh();
    } catch {
      setServerError("네트워크 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/profile/careers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingId(null);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const showForm = isAdding || editingId !== null;

  return (
    <div className="px-4 py-5 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">경력</h3>
        {!showForm && (
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            추가
          </button>
        )}
      </div>

      {careers.length > 0 && (
        <div className="space-y-4">
          {careers.map((career, idx) => {
            if (editingId === career.id) {
              return (
                <CareerForm
                  key={career.id}
                  form={form}
                  fieldErrors={fieldErrors}
                  serverError={serverError}
                  isSubmitting={isSubmitting}
                  isEdit
                  onUpdate={updateForm}
                  onSubmit={handleSubmit}
                  onCancel={closeForm}
                />
              );
            }

            const isThisDeleting = deletingId === career.id;

            return (
              <div key={career.id} className="relative flex gap-4">
                <CareerTimelineDot
                  isCurrent={career.isCurrent}
                  isLast={idx === careers.length - 1}
                />
                <div className="flex-1 pb-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{career.role}</p>
                      <p className="text-sm text-muted-foreground">{career.company}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {career.isCurrent && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          현재
                        </Badge>
                      )}
                      {!showForm && (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(career)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="경력 수정"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {isThisDeleting ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(career.id)}
                                disabled={isSubmitting}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                aria-label="삭제 확인"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="삭제 취소"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(career.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="경력 삭제"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMonthYear(career.startDate)} ~{" "}
                    {career.isCurrent
                      ? "현재"
                      : career.endDate
                      ? formatMonthYear(career.endDate)
                      : ""}
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed">{career.description}</p>
                  {career.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {career.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-zinc-700 text-zinc-100 px-2 py-0.5 rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {careers.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">등록된 경력이 없습니다.</p>
      )}

      {isAdding && (
        <CareerForm
          form={form}
          fieldErrors={fieldErrors}
          serverError={serverError}
          isSubmitting={isSubmitting}
          isEdit={false}
          onUpdate={updateForm}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
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

function CareerForm({
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
      "w-full rounded-lg border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      error ? "border-red-300" : "border-zinc-200"
    );

  return (
    <form onSubmit={onSubmit} className="space-y-3.5 bg-zinc-50 rounded-xl p-4">
      <p className="text-sm font-semibold">{isEdit ? "경력 수정" : "경력 추가"}</p>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="회사명" required error={fieldErrors.company}>
          <input
            type="text"
            value={form.company}
            onChange={(e) => onUpdate("company", e.target.value)}
            placeholder="테크밋"
            className={inputClass(fieldErrors.company)}
          />
        </FormField>
        <FormField label="직무/역할" required error={fieldErrors.role}>
          <input
            type="text"
            value={form.role}
            onChange={(e) => onUpdate("role", e.target.value)}
            placeholder="프론트엔드 개발자"
            className={inputClass(fieldErrors.role)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="시작일" required error={fieldErrors.startDate}>
          <input
            type="month"
            value={form.startDate ? form.startDate.slice(0, 7) : ""}
            onChange={(e) => onUpdate("startDate", `${e.target.value}-01`)}
            className={inputClass(fieldErrors.startDate)}
          />
        </FormField>
        <FormField label="종료일" error={fieldErrors.endDate}>
          <input
            type="month"
            value={form.endDate ? form.endDate.slice(0, 7) : ""}
            disabled={form.isCurrent}
            onChange={(e) => onUpdate("endDate", `${e.target.value}-01`)}
            className={cn(inputClass(fieldErrors.endDate), form.isCurrent && "opacity-40")}
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
        <span className="text-sm text-zinc-700">현재 재직 중</span>
      </label>

      <FormField label="업무 설명" required error={fieldErrors.description}>
        <Textarea
          value={form.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="담당한 업무와 성과를 간략히 적어주세요"
          rows={3}
          className={fieldErrors.description ? "border-red-300" : ""}
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

      {serverError && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "저장 중..." : isEdit ? "수정 완료" : "추가"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
      </div>
    </form>
  );
}
