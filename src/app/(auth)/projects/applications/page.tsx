import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { EmptyState } from "@/components/ui/empty-state";
import { NavLink } from "@/components/ui/nav-link";
import { getApplications } from "@/lib/supabase/queries/applications";
import { PAGE_TITLES } from "@/lib/constants";
import { ApplicationStatus } from "@/types";
import type { Application } from "@/types";

export const metadata: Metadata = { title: PAGE_TITLES["/projects/applications"] };

const IN_PROGRESS_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.Interview,
  ApplicationStatus.Reviewing,
  ApplicationStatus.Pending,
];
const ENDED_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.Accepted,
  ApplicationStatus.Rejected,
  ApplicationStatus.Withdrawn,
];

function ApplicationGroup({ title, applications }: { title: string; applications: Application[] }) {
  if (applications.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="space-y-3">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}

export default async function ApplicationsPage() {
  const { data: applications, total } = await getApplications();

  const reviewingCount = applications.filter(
    (a) => a.status === ApplicationStatus.Pending || a.status === ApplicationStatus.Reviewing
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === ApplicationStatus.Interview
  ).length;
  const acceptedCount = applications.filter(
    (a) => a.status === ApplicationStatus.Accepted
  ).length;

  const inProgress = applications.filter((a) => IN_PROGRESS_STATUSES.includes(a.status));
  const ended = applications.filter((a) => ENDED_STATUSES.includes(a.status));

  return (
    <div>
      {/* 요약 바 */}
      <p className="px-4 pt-4 pb-2 text-xs text-muted-foreground">
        전체 {total}건 · 검토중 {reviewingCount} · 면접예정 {interviewCount} · 합격 {acceptedCount}
      </p>

      {/* 카드 리스트 */}
      <div className="p-4 pt-2 space-y-4">
        {applications.length > 0 ? (
          <>
            <ApplicationGroup title="진행중" applications={inProgress} />
            <ApplicationGroup title="종료됨" applications={ended} />
          </>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="아직 지원한 프로젝트가 없습니다"
            description="관심 있는 프로젝트에 지원해보세요"
            action={
              <NavLink
                href="/projects"
                className="text-xs text-primary font-medium hover:underline underline-offset-2"
              >
                프로젝트 보러가기 →
              </NavLink>
            }
          />
        )}
      </div>
    </div>
  );
}
