import type { FreelancerProfile } from "@/types";

export type ProfileTabKey = "basic" | "education" | "career" | "skill" | "resume";

export interface CompletionItem {
  key: string;
  label: string;
  weight: number;
  done: boolean;
  tab: ProfileTabKey;
}

export interface ProfileCompletion {
  percent: number;
  items: CompletionItem[];
  /** 미완료 항목, 가중치 높은 순 정렬 */
  missing: CompletionItem[];
}

/**
 * 프로필 완성도를 가중치 기반으로 계산한다 (순수 파생 계산, DB 변경 없음).
 * 어떤 항목이 비어 있는지 함께 반환해 "다음 추천 입력" CTA에 활용한다.
 */
export function getProfileCompletion(profile: FreelancerProfile): ProfileCompletion {
  const items: CompletionItem[] = [
    { key: "birthDate", label: "생년월일", weight: 1, tab: "basic", done: !!profile.birthDate },
    { key: "gender", label: "성별", weight: 1, tab: "basic", done: !!profile.gender },
    { key: "phone", label: "연락처", weight: 1, tab: "basic", done: !!profile.phone },
    { key: "address", label: "주소", weight: 1, tab: "basic", done: !!profile.address },
    {
      key: "experience",
      label: "경력 연차",
      weight: 1,
      tab: "basic",
      done: profile.experienceYears !== null || profile.experienceMonths > 0,
    },
    {
      key: "availability",
      label: "투입 가능 상태",
      weight: 1,
      tab: "basic",
      done: profile.availabilityStatus !== null,
    },
    { key: "education", label: "학력", weight: 1, tab: "education", done: profile.educations.length > 0 },
    { key: "certification", label: "자격증", weight: 0.5, tab: "education", done: profile.certifications.length > 0 },
    { key: "career", label: "경력사항", weight: 2, tab: "career", done: profile.careers.length > 0 },
    { key: "skill", label: "스킬 인벤토리", weight: 2, tab: "skill", done: profile.skillInventories.length > 0 },
    { key: "resume", label: "이력서", weight: 1.5, tab: "resume", done: profile.resumes.length > 0 },
  ];

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const doneWeight = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  const percent = totalWeight === 0 ? 100 : Math.round((doneWeight / totalWeight) * 100);
  const missing = items.filter((i) => !i.done).sort((a, b) => b.weight - a.weight);

  return { percent, items, missing };
}
