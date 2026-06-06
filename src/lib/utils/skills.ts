import type { FreelancerProfile } from "@/types";

type SkillSource = Pick<FreelancerProfile, "techStack" | "skillInventories" | "careers">;

/**
 * 프로필의 여러 출처(상단 기술스택 + 스킬 인벤토리 languages/tools + 경력 techStack)를
 * 모아 소문자 정규화된 고유 기술 목록을 만든다. (서버/클라이언트 prop 전달 위해 string[] 반환)
 */
export function getMySkills(profile: SkillSource): string[] {
  const set = new Set<string>();
  const add = (arr?: string[] | null) =>
    arr?.forEach((s) => {
      const t = s.trim().toLowerCase();
      if (t) set.add(t);
    });

  add(profile.techStack);
  profile.skillInventories?.forEach((si) => {
    add(si.languages);
    add(si.tools);
  });
  profile.careers?.forEach((c) => add(c.techStack));

  return Array.from(set);
}

/** 프로젝트 요구 기술 중 내 기술과 일치하는 개수 */
export function countSkillMatches(techStack: string[], mySkills: string[]): number {
  if (!mySkills.length) return 0;
  const set = new Set(mySkills);
  return techStack.reduce((n, t) => (set.has(t.trim().toLowerCase()) ? n + 1 : n), 0);
}

/** 특정 기술이 내 기술과 일치하는지 */
export function isSkillMatched(tech: string, mySkills: string[]): boolean {
  return mySkills.includes(tech.trim().toLowerCase());
}
