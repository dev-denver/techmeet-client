"use client";

import { useRouter } from "next/navigation";
import { ProfileCompletionBar } from "./ProfileCompletionBar";
import type { CompletionItem, ProfileTabKey } from "@/lib/utils/profile-completion";

interface HomeProfileCompletionPromptProps {
  percent: number;
  missing: CompletionItem[];
}

/** 홈 화면 전용 래퍼 — /profile 밖에서도 완성도 바를 그대로 재사용하되, 탭 선택은 로컬 상태 대신 /profile?tab= 딥링크로 이동시킨다. */
export function HomeProfileCompletionPrompt({ percent, missing }: HomeProfileCompletionPromptProps) {
  const router = useRouter();

  function goToTab(tab: ProfileTabKey) {
    router.push(`/profile?tab=${tab}`);
  }

  return <ProfileCompletionBar percent={percent} missing={missing} onSelect={goToTab} />;
}
