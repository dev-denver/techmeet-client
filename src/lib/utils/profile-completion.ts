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

/** 탭 5개를 동일 가중치(20%)로 두고, 탭 내부 항목은 탭 가중치를 균등 분배한다. */
const TAB_WEIGHT = 100 / 5;

/**
 * 프로필 완성도를 탭 단위 동일 가중치로 계산한다 (순수 파생 계산, DB 변경 없음).
 * 어떤 항목이 비어 있는지 함께 반환해 "다음 추천 입력" CTA에 활용한다.
 */
export function getProfileCompletion(profile: FreelancerProfile): ProfileCompletion {
  const itemsByTab: Omit<CompletionItem, "weight">[][] = [
    [
      { key: "birthDate", label: "생년월일", tab: "basic", done: !!profile.birthDate },
      { key: "gender", label: "성별", tab: "basic", done: !!profile.gender },
      { key: "phone", label: "연락처", tab: "basic", done: !!profile.phone },
      { key: "address", label: "주소", tab: "basic", done: !!profile.address },
      { key: "availability", label: "투입 가능 상태", tab: "basic", done: profile.availabilityStatus !== null },
    ],
    [
      { key: "education", label: "학력", tab: "education", done: profile.educations.length > 0 },
      { key: "certification", label: "자격증", tab: "education", done: profile.certifications.length > 0 },
    ],
    [{ key: "career", label: "경력사항", tab: "career", done: profile.careers.length > 0 }],
    [{ key: "skill", label: "프로젝트", tab: "skill", done: profile.skillInventories.length > 0 }],
    [{ key: "resume", label: "이력서", tab: "resume", done: profile.resumes.length > 0 }],
  ];

  const items: CompletionItem[] = itemsByTab.flatMap((tabItems) =>
    tabItems.map((item) => ({ ...item, weight: TAB_WEIGHT / tabItems.length }))
  );

  const percent = Math.round(items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0));
  const missing = items.filter((i) => !i.done).sort((a, b) => b.weight - a.weight);

  return { percent, items, missing };
}
