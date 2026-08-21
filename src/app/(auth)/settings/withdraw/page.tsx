import type { Metadata } from "next";
import { WithdrawForm } from "@/components/features/settings/WithdrawForm";
import { getApplications } from "@/lib/supabase/queries/applications";
import { PAGE_TITLES } from "@/lib/constants";
import { ApplicationStatus } from "@/types";

export const metadata: Metadata = { title: PAGE_TITLES["/settings/withdraw"] };

const ACTIVE_STATUSES: Set<ApplicationStatus> = new Set([
  ApplicationStatus.Pending,
  ApplicationStatus.Reviewing,
  ApplicationStatus.Interview,
  ApplicationStatus.Accepted,
]);

export default async function WithdrawPage() {
  // 탈퇴 경고 문구에 쓰일 부가 정보 — 조회 실패해도 탈퇴 자체는 막지 않도록 개수만 0으로 대체
  let activeApplicationCount = 0;
  try {
    const { data } = await getApplications();
    activeApplicationCount = data.filter((a) => ACTIVE_STATUSES.has(a.status)).length;
  } catch {
    activeApplicationCount = 0;
  }

  return <WithdrawForm activeApplicationCount={activeApplicationCount} />;
}
