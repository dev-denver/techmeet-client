import Link from "next/link";
import { ChevronRight, Bell, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getProfile } from "@/lib/supabase/queries/profile";
import { getApplications } from "@/lib/supabase/queries/applications";
import { getProjects } from "@/lib/supabase/queries/projects";
import { getNotices } from "@/lib/supabase/queries/notices";
import { formatDate } from "@/lib/utils/format";
import { AVAILABILITY_STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus, ProjectStatus } from "@/types";

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

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="px-4 pt-5 pb-5 bg-gradient-to-br from-zinc-900 to-zinc-700">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base">
                {profile?.name?.[0] ?? "T"}
              </span>
            </div>
            <div>
              <p className="text-white/60 text-xs">안녕하세요 👋</p>
              <h2 className="text-white text-lg font-bold leading-tight mt-0.5">
                {profile ? `${profile.name}님` : "로그인 후 이용해주세요"}
              </h2>
            </div>
          </div>
          {availConfig && (
            <Badge variant="outline" className={`${availConfig.className} shrink-0`}>
              {availConfig.label}
            </Badge>
          )}
        </div>

        {/* 지원 현황 요약 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "전체 지원", value: allApplications.length },
            { label: "검토 중", value: reviewingCount },
            { label: "면접 예정", value: interviewCount },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-white font-bold text-2xl leading-none">{stat.value}</p>
              <p className="text-white/60 text-xs mt-1.5">{stat.label}</p>
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
      <section className="pt-5 pb-6">
        <div className="flex items-center gap-2 px-4 mb-3">
          <Megaphone className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">공지사항</h3>
        </div>
        {notices.length > 0 ? (
          <div className="divide-y divide-border">
            {notices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`}>
                <div className="flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 transition-colors active:bg-zinc-100">
                  <div className="w-4 shrink-0 mt-0.5">
                    {notice.isImportant && <Bell className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-1">
                      {notice.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(notice.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
