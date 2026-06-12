"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Education, Certification } from "@/types";
import { formatMonthYear } from "@/lib/utils/format";
import { validatePastOrCurrentMonth } from "@/lib/utils/validation";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { useToast } from "@/components/ui/toast";
import { useSubmit } from "@/hooks/useSubmit";
import { profileApi } from "@/lib/api/profile";
import {
  CardWrap, SectionHeader, EditDeleteActions, DashedAddButton,
  BottomSheetForm, FormInput, FormSelect, validateDateRange,
} from "./TabShared";

// ── Education ─────────────────────────────────────────────────

function EducationForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Education }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, error, setError, submit } = useSubmit();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startDate = (fd.get("startDate") as string) || null;
    const endDate = (fd.get("endDate") as string) || null;

    const rangeErr = startDate && endDate ? validateDateRange(startDate, endDate) : null;
    if (rangeErr) { setError(rangeErr); return; }

    const payload = {
      schoolName: fd.get("schoolName") as string,
      degree: (fd.get("degree") as string) || null,
      major: (fd.get("major") as string) || null,
      startDate,
      endDate,
      isGraduated: fd.get("isGraduated") === "true",
    };
    await submit(
      () => (initial ? profileApi.updateEducation(initial.id, payload) : profileApi.addEducation(payload)),
      {
        onSuccess: () => {
          showToast("저장되었습니다");
          router.refresh();
          onClose();
        },
      }
    );
  }

  return (
    <BottomSheetForm
      title={initial ? "학력 수정" : "학력 추가"}
      open={open} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} error={error}
    >
      <FormInput label="학교명" name="schoolName" defaultValue={initial?.schoolName ?? ""} required maxLength={100} placeholder="ex. 한국대학교" />
      <div className="grid grid-cols-2 gap-3">
        <FormSelect label="학위" name="degree" defaultValue={initial?.degree ?? ""}>
          <option value="">선택</option>
          <option value="고졸">고졸</option>
          <option value="전문학사">전문학사</option>
          <option value="학사">학사</option>
          <option value="석사">석사</option>
          <option value="박사">박사</option>
        </FormSelect>
        <FormInput label="전공" name="major" defaultValue={initial?.major ?? ""} maxLength={100} placeholder="ex. 컴퓨터공학" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">입학년월</label>
          <MonthYearPicker name="startDate" defaultValue={initial?.startDate?.slice(0, 7) ?? ""} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">졸업년월</label>
          <MonthYearPicker name="endDate" defaultValue={initial?.endDate?.slice(0, 7) ?? ""} />
        </div>
      </div>
      <FormSelect label="졸업 여부" name="isGraduated" defaultValue={String(initial?.isGraduated ?? true)}>
        <option value="true">졸업</option>
        <option value="false">재학중 / 중퇴</option>
      </FormSelect>
    </BottomSheetForm>
  );
}

function EducationCard({ edu, onEdit }: { edu: Education; onEdit: (e: Education) => void }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, submit } = useSubmit();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    await submit(() => profileApi.deleteEducation(edu.id), {
      onSuccess: () => {
        showToast("삭제되었습니다");
        setConfirmOpen(false);
        router.refresh();
      },
    });
  }

  const startLabel = edu.startDate ? formatMonthYear(edu.startDate.slice(0, 7)) : null;
  const endLabel = edu.endDate ? formatMonthYear(edu.endDate.slice(0, 7)) : null;
  const period = [startLabel, endLabel].filter(Boolean).join(" ~ ");
  const status = edu.isGraduated ? "졸업" : "재학중 / 중퇴";

  return (
    <CardWrap>
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{edu.schoolName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {[edu.major, edu.degree, status].filter(Boolean).join(" · ")}
          </p>
          {period && <p className="text-xs text-muted-foreground mt-1.5">{period}</p>}
        </div>
        <EditDeleteActions onEdit={() => onEdit(edu)} onDelete={() => setConfirmOpen(true)} />
      </div>
      <ConfirmSheet
        open={confirmOpen}
        title="학력을 삭제할까요?"
        description={`${edu.schoolName} 항목이 삭제되며 되돌릴 수 없습니다.`}
        isLoading={isLoading}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </CardWrap>
  );
}

// ── Certification ─────────────────────────────────────────────

function CertForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, error, setError, submit } = useSubmit();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const acquiredDate = (fd.get("acquiredDate") as string) || null;

    if (acquiredDate) {
      const err = validatePastOrCurrentMonth(acquiredDate);
      if (err) { setError(err); return; }
    }

    await submit(
      () => profileApi.addCertification({ name: fd.get("name") as string, acquiredDate }),
      {
        onSuccess: () => {
          showToast("저장되었습니다");
          router.refresh();
          onClose();
        },
      }
    );
  }

  return (
    <BottomSheetForm title="자격증 추가" open={open} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} error={error}>
      <FormInput label="자격증명" name="name" required maxLength={100} placeholder="ex. 정보처리기사" />
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">취득년월</label>
        <MonthYearPicker name="acquiredDate" />
      </div>
    </BottomSheetForm>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, submit } = useSubmit();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    await submit(() => profileApi.deleteCertification(cert.id), {
      onSuccess: () => {
        showToast("삭제되었습니다");
        setConfirmOpen(false);
        router.refresh();
      },
    });
  }

  return (
    <CardWrap>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-1 mb-2">
          <p className="text-xs font-semibold text-foreground leading-snug">{cert.name}</p>
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label={`${cert.name} 삭제`}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0 -mt-1.5 -mr-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ×
          </button>
        </div>
        {cert.acquiredDate && (
          <p className="text-xs text-muted-foreground">
            취득 {formatMonthYear(cert.acquiredDate.slice(0, 7))}
          </p>
        )}
      </div>
      <ConfirmSheet
        open={confirmOpen}
        title="자격증을 삭제할까요?"
        description={`${cert.name} 항목이 삭제되며 되돌릴 수 없습니다.`}
        isLoading={isLoading}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </CardWrap>
  );
}

// ── Main Tab ──────────────────────────────────────────────────

export function EducationTab({ educations, certifications }: { educations: Education[]; certifications: Certification[] }) {
  const [eduForm, setEduForm] = useState<{ open: boolean; initial?: Education }>({ open: false });
  const [certOpen, setCertOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="학력" onAdd={() => setEduForm({ open: true })} />
        <div className="space-y-2.5">
          {educations.map((edu) => (
            <EducationCard key={edu.id} edu={edu} onEdit={(e) => setEduForm({ open: true, initial: e })} />
          ))}
          <DashedAddButton label="학력 추가" onClick={() => setEduForm({ open: true })} />
        </div>
      </div>

      <div>
        <SectionHeader title="자격증" onAdd={() => setCertOpen(true)} />
        <div className="grid grid-cols-2 gap-2.5">
          {certifications.map((cert) => <CertCard key={cert.id} cert={cert} />)}
          <div className="col-span-2">
            <DashedAddButton label="자격증 추가" onClick={() => setCertOpen(true)} />
          </div>
        </div>
      </div>

      <EducationForm open={eduForm.open} initial={eduForm.initial} onClose={() => setEduForm({ open: false })} />
      <CertForm open={certOpen} onClose={() => setCertOpen(false)} />
    </div>
  );
}
