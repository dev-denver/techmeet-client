import Link from "next/link";
import { ChevronRight, Bell, Megaphone, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatsGrid } from "@/components/ui/stats-grid";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { RecentProjectsSection } from "@/components/features/projects/RecentProjectsSection";
import { getProfile } from "@/lib/supabase/queries/profile";
import { getApplications } from "@/lib/supabase/queries/applications";
import { getProjects } from "@/lib/supabase/queries/projects";
import { getNotices } from "@/lib/supabase/queries/notices";
import { formatDate, formatShortDate } from "@/lib/utils/format";
import { getMySkills } from "@/lib/utils/skills";
import { AVAILABILITY_STATUS_CONFIG } from "@/lib/constants";
import { ApplicationStatus, AvailabilityStatus, ProjectStatus } from "@/types";

export default async function HomePage() {
  // allSettled 사용: 개별 섹션 오류가 전체 페이지를 중단시키지 않도록
  const [profileResult, applicationsResult, projectsResult, noticesResult] = await Promise.allSettled([
    getProfile(),
    getApplications(),
    getProjects({ status: ProjectStatus.Recruiting }),
    getNotices(),
  ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value?.data : null;
  const allApplications = applicationsResult.status === "fulfilled" ? applicationsResult.value.data : [];
  const recentApplications = allApplications.slice(0, 3);
  const recentProjects = projectsResult.status === "fulfilled" ? projectsResult.value.data.slice(0, 3) : [];
  const notices = noticesResult.status === "fulfilled" ? noticesResult.value.data : [];

  const availConfig = profile?.availabilityStatus
    ? AVAILABILITY_STATUS_CONFIG[profile.availabilityStatus]
    : null;
  const mySkills = profile ? getMySkills(profile) : [];

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
      <section className="px-5 pt-6 pb-5 bg-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/50 text-xs font-medium tracking-wide">안녕하세요</p>
            <h2 className="text-primary-foreground text-lg font-bold leading-tight mt-0.5">
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
          <div className="mt-3 flex items-center gap-1.5 text-primary-foreground/60 text-xs">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span>투입 가능 예정일: <span className="text-primary-foreground font-medium">{formatShortDate(profile.availableFromDate)}</span></span>
          </div>
        )}

        {/* 지원 현황 요약 */}
        <StatsGrid
          className="mt-5"
          labelSize="10px"
          stats={[
            { label: "전체", value: allApplications.length },
            { label: "검토 중", value: reviewingCount },
            { label: "면접", value: interviewCount },
            { label: "합격", value: acceptedCount },
          ]}
        />
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
          <div className="mx-4 rounded-xl bg-muted/50 border border-dashed border-border px-4 py-5 text-center">
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

      {/* 최근 본 프로젝트 (localStorage 기반, 항목 없으면 미표시) */}
      <RecentProjectsSection />

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
              <ProjectCard key={project.id} project={project} mySkills={mySkills} />
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-xl bg-muted/50 border border-dashed border-border px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">현재 모집 중인 프로젝트가 없습니다.</p>
          </div>
        )}
      </section>

      {/* 공지사항 */}
      {notices.length > 0 && (
        <section className="pt-4 pb-6 px-4">
          <div className="rounded-xl border border-border bg-muted/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5" />
                공지사항
              </span>
              <Link
                href="/notices"
                className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground transition-colors"
              >
                더보기
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {notices.slice(0, 2).map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors active:bg-muted">
                    {notice.isImportant && <Bell className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <p className="flex-1 text-xs text-foreground leading-snug line-clamp-1">
                      {notice.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
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
