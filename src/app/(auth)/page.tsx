import Link from "next/link";
import { ChevronRight, Bell, Megaphone, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getProfile } from "@/lib/supabase/queries/profile";
import { getApplications } from "@/lib/supabase/queries/applications";
import { getProjects } from "@/lib/supabase/queries/projects";
import { getNotices } from "@/lib/supabase/queries/notices";
import { formatDate, formatShortDate } from "@/lib/utils/format";
import { AVAILABILITY_STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus, AvailabilityStatus, ProjectStatus } from "@/types";

export default async function HomePage() {
  const [profileResult, applicationsResult, projectsResult, noticesResult] = await Promise.all([
    getProfile(),
    getApplications(),
    getProjects({ status: ProjectStatus.Recruiting }),
    getNotices(),
  ]);

  const profile = profileResult?.data;
  const allApplications = applicationsResult.data;
  const recentApplications = allApplications.slice(0, 3);
  const recentProjects = projectsResult.data.slice(0, 3);
  const notices = noticesResult.data;

  const availConfig = profile?.availabilityStatus
    ? AVAILABILITY_STATUS_CONFIG[profile.availabilityStatus]
    : null;

  const reviewingCount = allApplications.filter(
    (a) => a.status === ApplicationStatus.Pending || a.status === ApplicationStatus.Reviewing
  ).length;
  const interviewCount = allApplications.filter(
    (a) => a.status === ApplicationStatus.Interview
  ).length;
  const acceptedCount = allApplications.filter(
    (a) => a.status === ApplicationStatus.Accepted
  ).length;

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="px-5 pt-6 pb-5 bg-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-medium tracking-wide">안녕하세요</p>
            <h2 className="text-white text-[17px] font-bold leading-tight mt-0.5">
              {profile ? `${profile.name}님` : "로그인 후 이용해주세요"}
            </h2>
          </div>
          {availConfig && (
            <Badge variant="outline" className={`${availConfig.className} shrink-0`}>
              {availConfig.label}
            </Badge>
          )}
        </div>

        {/* 투입 가능 예정일 (partial 상태일 때만) */}
        {profile?.availabilityStatus === AvailabilityStatus.Partial && profile.availableFromDate && (
          <div className="mt-3 flex items-center gap-1.5 text-zinc-400 text-xs">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span>투입 가능 예정일: <span className="text-zinc-200 font-medium">{formatShortDate(profile.availableFromDate)}</span></span>
          </div>
        )}

        {/* 지원 현황 요약 */}
        <div className="mt-5 grid grid-cols-4 divide-x divide-zinc-700 bg-zinc-700/40 border border-zinc-600/50 rounded-2xl overflow-hidden">
          {[
            { label: "전체", value: allApplications.length },
            { label: "검토 중", value: reviewingCount },
            { label: "면접", value: interviewCount },
            { label: "합격", value: acceptedCount },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4">
              <p className="text-white font-bold text-xl leading-none tabular-nums">{stat.value}</p>
              <p className="text-zinc-500 text-[10px] mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 내 신청 현황 */}
      <section className="pt-5 pb-4 border-b">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="font-semibold">내 신청 현황</h3>
          <Link
            href="/projects/applications"
            className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            전체보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-4">
            {recentApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} compact />
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">아직 지원한 프로젝트가 없습니다.</p>
            <Link
              href="/projects"
              className="text-xs text-primary mt-1.5 inline-block hover:underline underline-offset-2 font-medium"
            >
              프로젝트 보러가기 →
            </Link>
          </div>
        )}
      </section>

      {/* 모집 중인 프로젝트 */}
      <section className="pt-5 pb-4 border-b">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="font-semibold">모집 중인 프로젝트</h3>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            전체보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className="space-y-3 px-4">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">현재 모집 중인 프로젝트가 없습니다.</p>
          </div>
        )}
      </section>

      {/* 공지사항 */}
      {notices.length > 0 && (
        <section className="pt-4 pb-6 px-4">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5" />
                공지사항
              </span>
            </div>
            <div className="divide-y divide-zinc-100">
              {notices.slice(0, 2).map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100/60 transition-colors active:bg-zinc-100">
                    {notice.isImportant && <Bell className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                    <p className="flex-1 text-xs text-zinc-600 leading-snug line-clamp-1">
                      {notice.title}
                    </p>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
