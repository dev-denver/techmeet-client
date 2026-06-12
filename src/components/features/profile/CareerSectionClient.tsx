"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CareerTimelineDot } from "@/components/features/profile/CareerTimelineDot";
import { CareerForm, EMPTY_FORM, careerToForm } from "./CareerForm";
import type { CareerFormState, CareerFieldErrors } from "./CareerForm";
import { useToast } from "@/components/ui/toast";
import { useSubmit } from "@/hooks/useSubmit";
import { profileApi } from "@/lib/api/profile";
import { formatMonthYear } from "@/lib/utils/format";
import type { Career, AddCareerRequest } from "@/types";

interface CareerSectionClientProps {
  careers: Career[];
}

// 아이콘 액션 버튼 공통 클래스 (터치 타깃 확보 + 포커스 링)
const ICON_BUTTON_CLASS =
  "flex h-8 w-8 -my-1.5 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CareerSectionClient({ careers }: CareerSectionClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState<CareerFormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<CareerFieldErrors>({});
  const { isLoading: isSubmitting, error: serverError, setError: setServerError, submit } = useSubmit();

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

    await submit(
      () => (editingId ? profileApi.updateCareer(editingId, payload) : profileApi.addCareer(payload)),
      {
        onSuccess: () => {
          showToast("저장되었습니다");
          closeForm();
          router.refresh();
        },
      }
    );
  }

  // 1차 클릭: 확인 모드 진입(check/x 노출) → 2차 클릭: 실제 삭제 (의도된 인라인 2단계 확인 패턴)
  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }

    setIsDeleting(true);
    try {
      await profileApi.deleteCareer(id);
      setDeletingId(null);
      showToast("삭제되었습니다");
      router.refresh();
    } catch {
      showToast("삭제에 실패했습니다. 다시 시도해주세요", "error");
    } finally {
      setIsDeleting(false);
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
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1.5 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            className={`${ICON_BUTTON_CLASS} text-muted-foreground hover:text-foreground hover:bg-muted`}
                            aria-label="경력 수정"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {isThisDeleting ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(career.id)}
                                disabled={isDeleting}
                                className={`${ICON_BUTTON_CLASS} text-destructive hover:text-destructive/80 hover:bg-destructive/10`}
                                aria-label="삭제 확인"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className={`${ICON_BUTTON_CLASS} text-muted-foreground hover:text-foreground hover:bg-muted`}
                                aria-label="삭제 취소"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(career.id)}
                              className={`${ICON_BUTTON_CLASS} text-muted-foreground hover:text-destructive hover:bg-destructive/10`}
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
                  <p className="text-xs text-muted-foreground leading-relaxed">{career.description}</p>
                  {career.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {career.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium"
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
