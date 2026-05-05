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
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 px-4 pt-5 pb-6">
        <p className="text-white/60 text-sm mb-1">총 지원 건수</p>
        <p className="text-white font-bold leading-none">
          <span className="text-3xl">{total}</span>
          <span className="text-lg font-medium text-white/60 ml-1">건</span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "검토 중", value: reviewingCount },
            { label: "면접 예정", value: interviewCount },
            { label: "합격", value: acceptedCount },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-white font-bold text-2xl leading-none">{stat.value}</p>
              <p className="text-white/60 text-xs mt-1.5">{stat.label}</p>
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
