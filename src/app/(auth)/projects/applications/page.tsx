import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getApplications } from "@/lib/supabase/queries/applications";
import { ApplicationStatus } from "@/types";

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

  return (
    <div>
      {/* 히어로 */}
      <div className="bg-zinc-800 px-5 pt-6 pb-5">
        <div className="flex items-baseline gap-2">
          <p className="text-zinc-500 text-xs font-medium tracking-wide">총 지원 건수</p>
        </div>
        <p className="text-white font-bold leading-none mt-0.5">
          <span className="text-3xl tabular-nums">{total}</span>
          <span className="text-base font-medium text-zinc-500 ml-1">건</span>
        </p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-zinc-700 bg-zinc-700/40 border border-zinc-600/50 rounded-2xl overflow-hidden">
          {[
            { label: "검토 중", value: reviewingCount },
            { label: "면접 예정", value: interviewCount },
            { label: "합격", value: acceptedCount },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4">
              <p className="text-white font-bold text-2xl leading-none tabular-nums">{stat.value}</p>
              <p className="text-zinc-500 text-[11px] mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="p-4 space-y-3">
        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600">아직 지원한 프로젝트가 없습니다</p>
              <p className="text-xs text-muted-foreground mt-1">관심 있는 프로젝트에 지원해보세요</p>
            </div>
            <Link
              href="/projects"
              className="text-xs text-primary font-medium hover:underline underline-offset-2"
            >
              프로젝트 보러가기 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
