"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SkillInventory } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { DateSelectPicker } from "@/components/ui/date-select-picker";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { useToast } from "@/components/ui/toast";
import { useSubmit } from "@/hooks/useSubmit";
import { profileApi } from "@/lib/api/profile";
import {
  CardWrap, SectionHeader, EditDeleteActions, DashedAddButton,
  BottomSheetForm, FormInput, TagInput, Tag, ChevronDown, ChevronUp,
  validateDateRange,
} from "./TabShared";

function SkillForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: SkillInventory }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, error, setError, submit } = useSubmit();
  const [languages, setLanguages] = useState<string[]>(initial?.languages ?? []);
  const [tools, setTools] = useState<string[]>(initial?.tools ?? []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) as string) || null;

    const startDate = g("startDate");
    const endDate = g("endDate");
    const rangeErr = startDate && endDate ? validateDateRange(startDate, endDate) : null;
    if (rangeErr) { setError(rangeErr); return; }

    const payload = {
      projectName: fd.get("projectName") as string,
      startDate: g("startDate"),
      endDate: g("endDate"),
      client: g("client"),
      company: g("company"),
      industry: g("industry"),
      application: g("application"),
      role: g("role"),
      hardwareType: g("hardwareType"),
      os: g("os"),
      languages,
      dbms: g("dbms"),
      tools,
      others: g("others"),
    };

    await submit(
      () => (initial ? profileApi.updateSkillInventory(initial.id, payload) : profileApi.addSkillInventory(payload)),
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
    <BottomSheetForm title={initial ? "프로젝트 수정" : "프로젝트 추가"} open={open} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} error={error}>
      <FormInput label="프로젝트명" name="projectName" required maxLength={100} defaultValue={initial?.projectName ?? ""} placeholder="ex. 공공기관 민원 통합 시스템 구축" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">참여 시작</label>
          <DateSelectPicker name="startDate" defaultValue={initial?.startDate?.slice(0, 10) ?? ""} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">참여 종료</label>
          <DateSelectPicker name="endDate" defaultValue={initial?.endDate?.slice(0, 10) ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput label="고객사" name="client" defaultValue={initial?.client ?? ""} placeholder="ex. 행정안전부" />
        <FormInput label="근무회사" name="company" defaultValue={initial?.company ?? ""} placeholder="ex. (주)테크밋" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput label="산업 분야" name="industry" defaultValue={initial?.industry ?? ""} placeholder="ex. 공공행정" />
        <FormInput label="응용 분야" name="application" defaultValue={initial?.application ?? ""} placeholder="ex. 민원처리시스템" />
      </div>
      <FormInput label="역할" name="role" defaultValue={initial?.role ?? ""} placeholder="ex. 백엔드 개발 리드" />

      <div className="pt-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">개발환경</p>
        <div className="space-y-3">
          <FormInput label="기종" name="hardwareType" defaultValue={initial?.hardwareType ?? ""} placeholder="ex. Dell PowerEdge R740" />
          <FormInput label="OS" name="os" defaultValue={initial?.os ?? ""} placeholder="ex. Linux (CentOS 7)" />
          <TagInput label="개발언어" tags={languages} onChange={setLanguages} placeholder="언어 입력 후 Enter" />
          <FormInput label="DBMS" name="dbms" defaultValue={initial?.dbms ?? ""} placeholder="ex. Oracle 19c" />
          <TagInput label="TOOL" tags={tools} onChange={setTools} placeholder="도구 입력 후 Enter" />
          <FormInput label="기타" name="others" defaultValue={initial?.others ?? ""} placeholder="ex. Kafka, Redis" />
        </div>
      </div>
    </BottomSheetForm>
  );
}

function SkillCard({ skill, onEdit }: { skill: SkillInventory; onEdit: () => void }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading: deleting, submit } = useSubmit();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    await submit(() => profileApi.deleteSkillInventory(skill.id), {
      onSuccess: () => {
        showToast("삭제되었습니다");
        setConfirmOpen(false);
        router.refresh();
      },
    });
  }

  const startLabel = skill.startDate ? formatDate(skill.startDate) : null;
  const endLabel = skill.endDate ? formatDate(skill.endDate) : null;
  const period = [startLabel, endLabel].filter(Boolean).join(" ~ ");

  return (
    <CardWrap>
      <div className="flex items-center justify-between px-4 py-3.5">
        <button
          type="button"
          className="flex-1 min-w-0 mr-3 text-left"
          onClick={() => setOpen(!open)}
        >
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{skill.projectName}</p>
          {period && <p className="text-xs text-muted-foreground mt-0.5">{period}</p>}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <EditDeleteActions onEdit={onEdit} onDelete={() => setConfirmOpen(true)} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={open ? "접기" : "펼치기"}
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border">
          {/* 기본 메타 */}
          <div className="grid grid-cols-2 border-b border-border">
            {[
              { label: "고객사", value: skill.client },
              { label: "근무회사", value: skill.company },
              { label: "산업 분야", value: skill.industry },
              { label: "응용 분야", value: skill.application },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className={`px-4 py-2.5 ${i % 2 === 0 ? "border-r border-border" : ""} ${i >= 2 ? "border-t border-border" : ""}`}
              >
                <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                <p className="text-xs font-medium text-foreground">{value || "-"}</p>
              </div>
            ))}
          </div>
          {skill.role && (
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-[10px] text-muted-foreground mb-0.5">역할</p>
              <p className="text-xs font-medium text-foreground">{skill.role}</p>
            </div>
          )}

          {/* 개발환경 */}
          <div className="px-4 pt-3.5 pb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">개발환경</p>
            <div className="space-y-2.5">
              {[
                { label: "기종", value: skill.hardwareType },
                { label: "OS", value: skill.os },
                { label: "DBMS", value: skill.dbms },
                { label: "기타", value: skill.others },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-10 shrink-0 pt-0.5 font-medium">{label}</span>
                  <p className="text-xs text-foreground">{value}</p>
                </div>
              ))}
              {skill.languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-10 shrink-0 pt-0.5 font-medium">언어</span>
                  <div className="flex flex-wrap gap-1">{skill.languages.map((l) => <Tag key={l}>{l}</Tag>)}</div>
                </div>
              )}
              {skill.tools.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-10 shrink-0 pt-0.5 font-medium">TOOL</span>
                  <div className="flex flex-wrap gap-1">{skill.tools.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {deleting && <div className="px-4 py-1 text-xs text-muted-foreground border-t border-border">삭제 중...</div>}
      <ConfirmSheet
        open={confirmOpen}
        title="프로젝트를 삭제할까요?"
        description={`${skill.projectName} 항목이 삭제되며 되돌릴 수 없습니다.`}
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </CardWrap>
  );
}

export function SkillTab({ skills }: { skills: SkillInventory[] }) {
  const [form, setForm] = useState<{ open: boolean; initial?: SkillInventory }>({ open: false });

  return (
    <div>
      <SectionHeader title="스킬 인벤토리" onAdd={() => setForm({ open: true })} />
      <div className="space-y-2.5">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onEdit={() => setForm({ open: true, initial: skill })}
          />
        ))}
        <DashedAddButton label="프로젝트 추가" onClick={() => setForm({ open: true })} />
      </div>
      <SkillForm open={form.open} initial={form.initial} onClose={() => setForm({ open: false })} />
    </div>
  );
}
