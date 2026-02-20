"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormError("");
    setEditingId(null);
    setIsAdding(true);
  }

  function openEdit(career: Career) {
    setForm(careerToForm(career));
    setFormError("");
    setIsAdding(false);
    setEditingId(career.id);
  }

  function closeForm() {
    setIsAdding(false);
    setEditingId(null);
    setFormError("");
  }

  function updateForm(field: keyof CareerFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm(): string {
    if (!form.company.trim()) return "회사명을 입력해주세요";
    if (!form.role.trim()) return "직무/역할을 입력해주세요";
    if (!form.startDate) return "시작일을 입력해주세요";
    if (!form.isCurrent && !form.endDate) return "종료일을 입력하거나 현재 재직 중을 선택해주세요";
    if (!form.description.trim()) return "업무 설명을 입력해주세요";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

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
    setFormError("");
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
        setFormError(data.error ?? "저장에 실패했습니다");
        return;
      }

      closeForm();
      router.refresh();
    } catch {
      setFormError("네트워크 오류가 발생했습니다");
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
    <div className="p-4 border-b space-y-4">
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

      {/* 경력 목록 */}
      {careers.length > 0 && (
        <div className="space-y-4">
          {careers.map((career, idx) => {
            const isThisEditing = editingId === career.id;
            const isThisDeleting = deletingId === career.id;

            if (isThisEditing) {
              return (
                <CareerForm
                  key={career.id}
                  form={form}
                  error={formError}
                  isSubmitting={isSubmitting}
                  isEdit
                  onUpdate={updateForm}
                  onSubmit={handleSubmit}
                  onCancel={closeForm}
                />
              );
            }

            return (
              <div key={career.id} className="relative flex gap-4">
                {/* 타임라인 선 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                      career.isCurrent ? "bg-primary" : "bg-zinc-300"
                    }`}
                  />
                  {idx < careers.length - 1 && (
                    <div className="w-0.5 flex-1 bg-zinc-200 mt-1" />
                  )}
                </div>

                {/* 내용 */}
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
                  <div className="flex flex-wrap gap-1.5">
                    {career.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 경력 없을 때 */}
      {careers.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">등록된 경력이 없습니다.</p>
      )}

      {/* 추가 폼 */}
      {isAdding && (
        <CareerForm
          form={form}
          error={formError}
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
  error: string;
  isSubmitting: boolean;
  isEdit: boolean;
  onUpdate: (field: keyof CareerFormState, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function CareerForm({
  form,
  error,
  isSubmitting,
  isEdit,
  onUpdate,
  onSubmit,
  onCancel,
}: CareerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-zinc-50 rounded-xl p-4">
      <p className="text-sm font-semibold">{isEdit ? "경력 수정" : "경력 추가"}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">회사명 *</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => onUpdate("company", e.target.value)}
            placeholder="테크밋"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">직무/역할 *</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => onUpdate("role", e.target.value)}
            placeholder="프론트엔드 개발자"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">시작일 *</label>
          <input
            type="month"
            value={form.startDate ? form.startDate.slice(0, 7) : ""}
            onChange={(e) => onUpdate("startDate", `${e.target.value}-01`)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">종료일</label>
          <input
            type="month"
            value={form.endDate ? form.endDate.slice(0, 7) : ""}
            disabled={form.isCurrent}
            onChange={(e) => onUpdate("endDate", `${e.target.value}-01`)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isCurrent}
          onChange={(e) => onUpdate("isCurrent", e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">현재 재직 중</span>
      </label>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">업무 설명 *</label>
        <textarea
          value={form.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="담당한 업무와 성과를 간략히 적어주세요"
          rows={3}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">기술 스택 (쉼표로 구분)</label>
        <input
          type="text"
          value={form.techStackInput}
          onChange={(e) => onUpdate("techStackInput", e.target.value)}
          placeholder="React, TypeScript, Node.js"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "저장 중..." : isEdit ? "수정 완료" : "추가"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
