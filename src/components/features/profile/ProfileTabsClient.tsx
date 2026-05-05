"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FreelancerProfile } from "@/types";
import { AvailabilityStatus } from "@/types";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { EducationTab } from "./tabs/EducationTab";
import { SkillTab } from "./tabs/SkillTab";
import { CareerSectionClient } from "./CareerSectionClient";
import { CardWrap, FieldRow, SectionHeader } from "./tabs/TabShared";
import { Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatExperience } from "@/lib/utils/format";

type Tab = "basic" | "education" | "career" | "skill";

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "education", label: "학력/자격증" },
  { key: "career", label: "경력사항" },
  { key: "skill", label: "스킬 인벤토리" },
];

interface BasicInfoTabProps {
  profile: FreelancerProfile;
  availStatus: AvailabilityStatus;
  availFromDate: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onStatusChange: (status: AvailabilityStatus, date?: string | null) => void;
  onSaveAndEdit: () => void;
}

function BasicInfoTab({ profile, availStatus, availFromDate, isDirty, isSaving, onStatusChange, onSaveAndEdit }: BasicInfoTabProps) {
  const genderLabel = profile.gender === "male" ? "남" : profile.gender === "female" ? "여" : null;

  return (
    <div className="space-y-5">
      <div>
        <SectionHeader title="기본 정보" />
        <CardWrap>
          <div className="grid grid-cols-2">
            <div className="px-4 py-3 border-b border-r border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">이름</p>
              <p className="text-sm text-zinc-800 font-medium">{profile.name}</p>
            </div>
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">성별</p>
              <p className="text-sm text-zinc-800 font-medium">{genderLabel || "-"}</p>
            </div>
            <div className="px-4 py-3 border-b border-r border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">생년월일</p>
              <p className="text-sm text-zinc-800 font-medium">
                {profile.birthDate ? profile.birthDate.slice(0, 10).replace(/-/g, ". ") : "-"}
              </p>
            </div>
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">경력</p>
              <p className="text-sm text-zinc-800 font-medium">
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
            <div className="px-4 py-3 border-b border-r border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">소속</p>
              <p className="text-sm text-zinc-800 font-medium">{profile.affiliation || "-"}</p>
            </div>
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">입사일</p>
              <p className="text-sm text-zinc-800 font-medium">
                {profile.joiningDate ? profile.joiningDate.slice(0, 10).replace(/-/g, ". ") : "-"}
              </p>
            </div>
            <div className="px-4 py-3 border-r border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">부서</p>
              <p className="text-sm text-zinc-800 font-medium">{profile.department || "-"}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-zinc-400 font-medium mb-0.5">직위</p>
              <p className="text-sm text-zinc-800 font-medium">{profile.positionTitle || "-"}</p>
            </div>
          </div>
        </CardWrap>
      </div>

      <div>
        <SectionHeader title="연락처 및 주소" />
        <CardWrap>
          <div className="divide-y divide-zinc-100">
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

      {/* 기본정보 수정 버튼 */}
      <button
        type="button"
        onClick={onSaveAndEdit}
        disabled={isSaving}
        className={cn(
          "w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-[15px] font-semibold transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50",
          isDirty
            ? "bg-status-info text-white hover:opacity-90 active:opacity-80"
            : "bg-zinc-900 text-white hover:bg-zinc-700 active:bg-zinc-800"
        )}
      >
        {isSaving ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            저장 중...
          </>
        ) : isDirty ? (
          <>
            <Save className="h-4 w-4 shrink-0" />
            변경사항 저장 후 수정
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4 shrink-0" />
            기본정보 수정
          </>
        )}
      </button>
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
  const [availStatus, setAvailStatus] = useState<AvailabilityStatus>(
    profile.availabilityStatus ?? AvailabilityStatus.Unavailable
  );
  const [availFromDate, setAvailFromDate] = useState<string | null>(profile.availableFromDate);
  const [isSaving, setIsSaving] = useState(false);

  // 서버에서 받은 초기값과 현재 로컬 상태를 비교해 미저장 변경이 있는지 감지.
  // 투입 가능 상태는 별도 저장 버튼을 통해 명시적으로 저장하는 방식이라 isDirty 관리가 필요하다.
  const isDirty =
    availStatus !== (profile.availabilityStatus ?? AvailabilityStatus.Unavailable) ||
    availFromDate !== profile.availableFromDate;

  function handleStatusChange(status: AvailabilityStatus, date?: string | null) {
    setAvailStatus(status);
    setAvailFromDate(date ?? null);
  }

  // 투입 상태 변경이 있으면 먼저 저장한 뒤 기본정보 수정 페이지로 이동.
  // 저장 실패해도 페이지 이동은 진행 (에러 표시 없이 최선 노력).
  async function handleSaveAndEdit() {
    if (isDirty) {
      setIsSaving(true);
      try {
        await fetch("/api/profile/availability", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: availStatus, availableFromDate: availFromDate }),
        });
      } finally {
        setIsSaving(false);
      }
    }
    router.push("/settings/profile");
  }

  const availConfig = AVAILABILITY_TOGGLE_CONFIG[availStatus];

  const fromDateLabel = (() => {
    if (availStatus !== AvailabilityStatus.Partial || !availFromDate) return null;
    const d = new Date(availFromDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}~`;
  })();

  return (
    <div>
      {/* 다크 헤더 */}
      <div className="bg-zinc-800 px-5 pt-6 pb-6">
        <p className="text-zinc-400 text-xs font-medium tracking-wide">내 정보</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-white font-bold text-[17px] leading-tight">{profile.name}님</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${availConfig?.className ?? ""}`}>
            {availConfig?.label}
            {fromDateLabel && ` · ${fromDateLabel}`}
          </span>
          {isDirty && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              미저장
            </span>
          )}
        </div>
        {profile.positionTitle && (
          <p className="text-zinc-500 text-sm mt-1">
            {profile.positionTitle}{profile.affiliation ? ` · ${profile.affiliation}` : ""}
          </p>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-100">
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 min-w-fit py-3 px-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                tab === key
                  ? "text-zinc-900 border-zinc-900"
                  : "text-zinc-400 border-transparent hover:text-zinc-600"
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
          <BasicInfoTab
            profile={profile}
            availStatus={availStatus}
            availFromDate={availFromDate}
            isDirty={isDirty}
            isSaving={isSaving}
            onStatusChange={handleStatusChange}
            onSaveAndEdit={handleSaveAndEdit}
          />
        )}
        {tab === "education" && (
          <EducationTab educations={profile.educations} certifications={profile.certifications} />
        )}
        {tab === "career" && <CareerTab profile={profile} />}
        {tab === "skill" && <SkillTab skills={profile.skillInventories} />}
      </div>
    </div>
  );
}
