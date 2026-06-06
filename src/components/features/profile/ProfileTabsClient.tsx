"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FreelancerProfile } from "@/types";
import { AvailabilityStatus } from "@/types";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { EducationTab } from "./tabs/EducationTab";
import { SkillTab } from "./tabs/SkillTab";
import { ResumeTab } from "./tabs/ResumeTab";
import { CareerSectionClient } from "./CareerSectionClient";
import { ProfileBasicForm } from "./ProfileBasicForm";
import { ProfileCompletionBar } from "./ProfileCompletionBar";
import { CardWrap, FieldRow, SectionHeader } from "./tabs/TabShared";
import { PageHero } from "@/components/ui/page-hero";
import { Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatExperience } from "@/lib/utils/format";
import { getProfileCompletion } from "@/lib/utils/profile-completion";

type Tab = "basic" | "education" | "career" | "skill" | "resume";

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "education", label: "학력/자격증" },
  { key: "career", label: "경력사항" },
  { key: "skill", label: "스킬 인벤토리" },
  { key: "resume", label: "이력서" },
];

interface BasicInfoTabProps {
  profile: FreelancerProfile;
  availStatus: AvailabilityStatus;
  availFromDate: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onStatusChange: (status: AvailabilityStatus, date?: string | null) => void;
  onSave: () => void;
}

function BasicInfoTab({ profile, availStatus, availFromDate, isDirty, isSaving, onStatusChange, onSave }: BasicInfoTabProps) {
  const genderLabel = profile.gender === "male" ? "남" : profile.gender === "female" ? "여" : null;

  return (
    <div className="space-y-5">
      <div>
        <SectionHeader title="기본 정보" />
        <CardWrap>
          <div className="grid grid-cols-2">
            <div className="px-4 py-3 border-b border-r border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">이름</p>
              <p className="text-sm text-foreground font-medium">{profile.name}</p>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">성별</p>
              <p className="text-sm text-foreground font-medium">{genderLabel || "-"}</p>
            </div>
            <div className="px-4 py-3 border-b border-r border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">생년월일</p>
              <p className="text-sm text-foreground font-medium">
                {profile.birthDate ? profile.birthDate.slice(0, 10).replace(/-/g, ". ") : "-"}
              </p>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">경력</p>
              <p className="text-sm text-foreground font-medium">
                {profile.experienceYears !== null || profile.experienceMonths > 0
                  ? formatExperience(profile.experienceYears, profile.experienceMonths)
                  : "-"}
              </p>
            </div>
          </div>
          <FieldRow label="병역 (역종)" value={profile.militaryService} />
        </CardWrap>
      </div>

      <div>
        <SectionHeader title="소속 정보" />
        <CardWrap>
          <div className="grid grid-cols-2">
            <div className="px-4 py-3 border-b border-r border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">소속</p>
              <p className="text-sm text-foreground font-medium">{profile.affiliation || "-"}</p>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">입사일</p>
              <p className="text-sm text-foreground font-medium">
                {profile.joiningDate ? profile.joiningDate.slice(0, 10).replace(/-/g, ". ") : "-"}
              </p>
            </div>
            <div className="px-4 py-3 border-r border-border">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">부서</p>
              <p className="text-sm text-foreground font-medium">{profile.department || "-"}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">직위</p>
              <p className="text-sm text-foreground font-medium">{profile.positionTitle || "-"}</p>
            </div>
          </div>
        </CardWrap>
      </div>

      <div>
        <SectionHeader title="연락처 및 주소" />
        <CardWrap>
          <div className="divide-y divide-border">
            <FieldRow label="휴대폰번호" value={profile.phone} />
            <FieldRow label="이메일" value={profile.email} />
            <FieldRow label="주소" value={profile.address} />
          </div>
        </CardWrap>
      </div>

      {/* 투입 가능 상태 — 수동 저장 방식 */}
      <div>
        <SectionHeader title="투입 가능 상태" />
        <AvailabilityToggle
          status={availStatus}
          availableFromDate={availFromDate}
          isDirty={isDirty}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* 투입 상태 저장 버튼 (변경 있을 때만) */}
      {isDirty && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-base font-semibold transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:opacity-50 bg-status-info text-white hover:opacity-90 active:opacity-80"
          )}
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 shrink-0" />
              투입 상태 저장하기
            </>
          )}
        </button>
      )}

    </div>
  );
}

function CareerTab({ profile }: { profile: FreelancerProfile }) {
  return <CareerSectionClient careers={profile.careers} />;
}

interface ProfileTabsClientProps {
  profile: FreelancerProfile;
}

export function ProfileTabsClient({ profile }: ProfileTabsClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("basic");
  const [editingBasic, setEditingBasic] = useState(false);
  const [availStatus, setAvailStatus] = useState<AvailabilityStatus>(
    profile.availabilityStatus ?? AvailabilityStatus.Unavailable
  );
  const [availFromDate, setAvailFromDate] = useState<string | null>(profile.availableFromDate);
  const [isSaving, setIsSaving] = useState(false);
  // 마지막으로 서버에 저장된 값 — isDirty 비교의 기준점
  const [savedStatus, setSavedStatus] = useState<AvailabilityStatus>(
    profile.availabilityStatus ?? AvailabilityStatus.Unavailable
  );
  const [savedFromDate, setSavedFromDate] = useState<string | null>(profile.availableFromDate);

  const isDirty = availStatus !== savedStatus || availFromDate !== savedFromDate;

  function handleStatusChange(status: AvailabilityStatus, date?: string | null) {
    setAvailStatus(status);
    setAvailFromDate(date ?? null);
  }

  // 투입 상태만 저장 (페이지 이동 없음)
  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: availStatus, availableFromDate: availFromDate }),
      });
      if (res.ok) {
        setSavedStatus(availStatus);
        setSavedFromDate(availFromDate);
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  }

  // 탭 전환 시 인라인 편집 모드 해제 (편집 중 다른 탭으로 이동하면 편집 취소)
  function selectTab(next: Tab) {
    setTab(next);
    setEditingBasic(false);
  }

  const availConfig = AVAILABILITY_TOGGLE_CONFIG[availStatus];
  const completion = getProfileCompletion(profile);

  const fromDateLabel = (() => {
    if (availStatus !== AvailabilityStatus.Partial || !availFromDate) return null;
    const d = new Date(availFromDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}~`;
  })();

  return (
    <div>
      {/* 다크 헤더 */}
      <PageHero className="pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-primary-foreground/60 text-xs font-medium tracking-wide">내 정보</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-primary-foreground font-bold text-lg leading-tight">{profile.name}님</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${availConfig?.className ?? ""}`}>
                {availConfig?.label}
                {fromDateLabel && ` · ${fromDateLabel}`}
              </span>
              {isDirty && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-status-warning/20 text-status-warning border border-status-warning/30">
                  미저장
                </span>
              )}
            </div>
            {profile.positionTitle && (
              <p className="text-primary-foreground/60 text-sm mt-1">
                {profile.positionTitle}{profile.affiliation ? ` · ${profile.affiliation}` : ""}
              </p>
            )}
          </div>
          {tab === "basic" && !editingBasic && (
            <button
              type="button"
              onClick={() => setEditingBasic(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
              aria-label="기본정보 수정"
            >
              <Pencil className="h-3.5 w-3.5" />
              수정
            </button>
          )}
        </div>
      </PageHero>

      {/* 프로필 완성도 */}
      <div className="px-4 pt-4">
        <ProfileCompletionBar
          percent={completion.percent}
          missing={completion.missing}
          onSelect={selectTab}
        />
      </div>

      {/* 탭 네비게이션 */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => selectTab(key)}
              className={`flex-1 min-w-fit py-3 px-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                tab === key
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-4 pt-5 pb-8">
        {tab === "basic" && (
          editingBasic ? (
            <ProfileBasicForm
              initial={profile}
              onSuccess={() => { setEditingBasic(false); router.refresh(); }}
              onCancel={() => setEditingBasic(false)}
            />
          ) : (
            <BasicInfoTab
              profile={profile}
              availStatus={availStatus}
              availFromDate={availFromDate}
              isDirty={isDirty}
              isSaving={isSaving}
              onStatusChange={handleStatusChange}
              onSave={handleSave}
            />
          )
        )}
        {tab === "education" && (
          <EducationTab educations={profile.educations} certifications={profile.certifications} />
        )}
        {tab === "career" && <CareerTab profile={profile} />}
        {tab === "skill" && <SkillTab skills={profile.skillInventories} />}
        {tab === "resume" && <ResumeTab resumes={profile.resumes} />}
      </div>
    </div>
  );
}
