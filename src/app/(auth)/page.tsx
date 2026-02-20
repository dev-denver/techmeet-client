import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getProfile } from "@/lib/supabase/queries/profile";
import { getApplications } from "@/lib/supabase/queries/applications";
import { getProjects } from "@/lib/supabase/queries/projects";
import { getNotices } from "@/lib/supabase/queries/notices";
import { formatDate } from "@/lib/utils/format";
import { AVAILABILITY_STATUS_CONFIG } from "@/lib/constants";
import { ProjectStatus } from "@/types";

export default async function HomePage() {
  const [profileResult, applicationsResult, projectsResult, noticesResult] = await Promise.all([
    getProfile(),
    getApplications(),
    getProjects({ status: ProjectStatus.Recruiting }),
    getNotices(),
  ]);

  const profile = profileResult?.data;
  const recentApplications = applicationsResult.data.slice(0, 3);
  const recentProjects = projectsResult.data.slice(0, 3);
  const notices = noticesResult.data;

  const availConfig = profile
    ? AVAILABILITY_STATUS_CONFIG[profile.availabilityStatus]
    : null;

  return (
    <div className="space-y-6 p-4">
      {/* 인사 배너 */}
      <section className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-muted-foreground">안녕하세요 👋</p>
          <h2 className="text-xl font-bold mt-0.5">
            {profile ? `${profile.name}님` : "로그인 후 이용해주세요"}
          </h2>
        </div>
        {availConfig && (
          <Badge variant="outline" className={availConfig.className}>
            {availConfig.label}
          </Badge>
        )}
      </section>

      {/* 내 신청 현황 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">내 신청 현황</h3>
          <Link
            href="/projects/applications"
            className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground"
          >
            전체보기 <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {recentApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} compact />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              아직 지원한 프로젝트가 없습니다.
            </CardContent>
          </Card>
        )}
      </section>

      {/* 최근 프로젝트 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">최근 프로젝트</h3>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground"
          >
            전체보기 <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              등록된 프로젝트가 없습니다.
            </CardContent>
          </Card>
        )}
      </section>

      {/* 공지사항 */}
      <section className="space-y-3 pb-4">
        <h3 className="font-semibold">공지사항</h3>
        {notices.length > 0 ? (
          <div className="space-y-2">
            {notices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent>
                    <div className="flex items-start gap-2">
                      {notice.isImportant && (
                        <Bell className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">
                          {notice.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notice.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notice.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              공지사항이 없습니다.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
