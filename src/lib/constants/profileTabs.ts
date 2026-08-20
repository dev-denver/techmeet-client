export type ProfileTab = "basic" | "education" | "career" | "skill" | "resume";

export const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "education", label: "학력/자격증" },
  { key: "career", label: "경력사항" },
  { key: "skill", label: "프로젝트" },
  { key: "resume", label: "이력서" },
];
