"use client";

import type { FreelancerProfile } from "@/types";
import { AvailabilityStatus } from "@/types";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { CardWrap, FieldRow, SectionHeader } from "./tabs/TabShared";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatExperience } from "@/lib/utils/format";

interface BasicInfoTabProps {
  profile: FreelancerProfile;
  availStatus: AvailabilityStatus;
  availFromDate: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onStatusChange: (status: AvailabilityStatus, date?: string | null) => void;
  onSave: () => void;
}

/** 내 정보 > 기본정보 탭 (읽기 전용 뷰 + 투입 가능 상태 토글/저장) */
export function BasicInfoTab({ profile, availStatus, availFromDate, isDirty, isSaving, onStatusChange, onSave }: BasicInfoTabProps) {
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
          aria-busy={isSaving || undefined}
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
