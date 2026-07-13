"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FreelancerProfile } from "@/types";
import { AvailabilityStatus } from "@/types";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { BasicInfoTab } from "./BasicInfoTab";
import { EducationTab } from "./tabs/EducationTab";
import { SkillTab } from "./tabs/SkillTab";
import { ResumeTab } from "./tabs/ResumeTab";
import { CareerSectionClient } from "./CareerSectionClient";
import { ProfileBasicForm } from "./ProfileBasicForm";
import { ProfileCompletionBar } from "./ProfileCompletionBar";
import { PageHero } from "@/components/ui/page-hero";
import { useToast } from "@/components/ui/toast";
import { profileApi } from "@/lib/api/profile";
import { Pencil } from "lucide-react";
import { getProfileCompletion } from "@/lib/utils/profile-completion";

type Tab = "basic" | "education" | "career" | "skill" | "resume";

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "education", label: "학력/자격증" },
  { key: "career", label: "경력사항" },
  { key: "skill", label: "스킬 인벤토리" },
  { key: "resume", label: "이력서" },
];

function CareerTab({ profile }: { profile: FreelancerProfile }) {
  return <CareerSectionClient careers={profile.careers} />;
}

interface ProfileTabsClientProps {
  profile: FreelancerProfile;
}

export function ProfileTabsClient({ profile }: ProfileTabsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("basic");
  const [editingBasic, setEditingBasic] = useState(false);
  const [availStatus, setAvailStatus] = useState<AvailabilityStatus>(
    profile.availabilityStatus ?? AvailabilityStatus.Unavailable
  );
  const [availFromDate, setAvailFromDate] = useState<string | null>(profile.availableFromDate);

  // 투입 상태 저장 (시트에서 변경 즉시 호출, 페이지 이동 없음)
  async function handleSaveAvailability(status: AvailabilityStatus, availableFromDate: string | null): Promise<boolean> {
    try {
      await profileApi.updateAvailability({ status, availableFromDate });
      setAvailStatus(status);
      setAvailFromDate(availableFromDate);
      showToast("투입 상태가 저장되었습니다");
      router.refresh();
      return true;
    } catch {
      showToast("저장에 실패했습니다. 다시 시도해주세요", "error");
      return false;
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
            </div>
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
              aria-current={tab === key ? "true" : undefined}
              className={`flex-1 min-w-fit py-3 px-3 text-xs whitespace-nowrap transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                tab === key
                  ? "text-foreground font-semibold border-foreground"
                  : "text-muted-foreground font-normal border-transparent hover:text-foreground/70"
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
              onSaveAvailability={handleSaveAvailability}
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
