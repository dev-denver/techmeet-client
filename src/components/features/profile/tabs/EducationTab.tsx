"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Education, Certification } from "@/types";
import { formatMonthYear } from "@/lib/utils/format";
import { validatePastOrCurrentMonth } from "@/lib/utils/validation";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import {
  CardWrap, SectionHeader, EditDeleteActions, DashedAddButton,
  BottomSheetForm, FormInput, FormSelect, validateDateRange,
} from "./TabShared";

// ── Education ─────────────────────────────────────────────────

function EducationForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Education }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startDate = (fd.get("startDate") as string) || null;
    const endDate = (fd.get("endDate") as string) || null;

    const rangeErr = startDate && endDate ? validateDateRange(startDate, endDate) : null;
    if (rangeErr) { setFormError(rangeErr); return; }
    setFormError("");

    const payload = {
      schoolName: fd.get("schoolName") as string,
      degree: (fd.get("degree") as string) || null,
      major: (fd.get("major") as string) || null,
      startDate,
      endDate,
      isGraduated: fd.get("isGraduated") === "true",
    };
    setIsLoading(true);
    try {
      const url = initial ? `/api/profile/education/${initial.id}` : "/api/profile/education";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { router.refresh(); onClose(); }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BottomSheetForm
      title={initial ? "학력 수정" : "학력 추가"}
      open={open} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} error={formError}
    >
      <FormInput label="학교명" name="schoolName" defaultValue={initial?.schoolName ?? ""} required placeholder="ex. 한국대학교" />
      <div className="grid grid-cols-2 gap-3">
        <FormSelect label="학위" name="degree" defaultValue={initial?.degree ?? ""}>
          <option value="">선택</option>
          <option value="고졸">고졸</option>
          <option value="전문학사">전문학사</option>
          <option value="학사">학사</option>
          <option value="석사">석사</option>
          <option value="박사">박사</option>
        </FormSelect>
        <FormInput label="전공" name="major" defaultValue={initial?.major ?? ""} placeholder="ex. 컴퓨터공학" />
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
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("삭제할까요?")) return;
    setDeleting(true);
    await fetch(`/api/profile/education/${edu.id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
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
        <EditDeleteActions onEdit={() => onEdit(edu)} onDelete={handleDelete} />
      </div>
      {deleting && <div className="px-4 py-1 text-xs text-muted-foreground">삭제 중...</div>}
    </CardWrap>
  );
}

// ── Certification ─────────────────────────────────────────────

function CertForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const acquiredDate = (fd.get("acquiredDate") as string) || null;

    if (acquiredDate) {
      const err = validatePastOrCurrentMonth(acquiredDate);
      if (err) { setFormError(err); return; }
    }
    setFormError("");

    setIsLoading(true);
    try {
      const res = await fetch("/api/profile/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), acquiredDate }),
      });
      if (res.ok) { router.refresh(); onClose(); }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BottomSheetForm title="자격증 추가" open={open} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} error={formError}>
      <FormInput label="자격증명" name="name" required placeholder="ex. 정보처리기사" />
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">취득년월</label>
        <MonthYearPicker name="acquiredDate" />
      </div>
    </BottomSheetForm>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("삭제할까요?")) return;
    setDeleting(true);
    await fetch(`/api/profile/certifications/${cert.id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  return (
    <CardWrap>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-1 mb-2">
          <p className="text-xs font-semibold text-foreground leading-snug">{cert.name}</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0 -mt-0.5 -mr-0.5"
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
