import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { StatsGrid } from "@/components/ui/stats-grid";
import { getApplications } from "@/lib/supabase/queries/applications";
import { ApplicationStatus } from "@/types";

export default async function ApplicationsPage() {
  const { data: applications, total } = await getApplications().catch(() => ({ data: [], total: 0 }));

  const reviewingCount = applications.filter(
    (a) => a.status === ApplicationStatus.Pending || a.status === ApplicationStatus.Reviewing
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === ApplicationStatus.Interview
  ).length;
  const acceptedCount = applications.filter(
    (a) => a.status === ApplicationStatus.Accepted
  ).length;

  return (
    <div>
      {/* 히어로 */}
      <PageHero>
        <div className="flex items-baseline gap-2">
          <p className="text-primary-foreground/50 text-xs font-medium tracking-wide">총 지원 건수</p>
        </div>
        <p className="text-primary-foreground font-bold leading-none mt-0.5">
          <span className="text-3xl tabular-nums">{total}</span>
          <span className="text-base font-medium text-primary-foreground/50 ml-1">건</span>
        </p>

        <StatsGrid
          className="mt-5"
          valueSize="2xl"
          stats={[
            { label: "검토 중", value: reviewingCount },
            { label: "면접 예정", value: interviewCount },
            { label: "합격", value: acceptedCount },
          ]}
        />
      </PageHero>

      {/* 카드 리스트 */}
      <div className="p-4 space-y-3">
        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="아직 지원한 프로젝트가 없습니다"
            description="관심 있는 프로젝트에 지원해보세요"
            action={
              <Link
                href="/projects"
                className="text-xs text-primary font-medium hover:underline underline-offset-2"
              >
                프로젝트 보러가기 →
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
