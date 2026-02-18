import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import {
  mockProfile,
  mockApplications,
  mockProjects,
  mockNotices,
} from "@/lib/utils/mockData";
import { formatDate } from "@/lib/utils/format";
import { AVAILABILITY_STATUS_CONFIG } from "@/lib/constants";

export default function HomePage() {
  const profile = mockProfile;
  const recentApplications = mockApplications.slice(0, 3);
  const recentProjects = mockProjects
    .filter((p) => p.status === "recruiting")
    .slice(0, 3);
  const availConfig = AVAILABILITY_STATUS_CONFIG[profile.availabilityStatus];

  return (
    <div className="space-y-6 p-4">
      {/* 인사 배너 */}
      <section className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-muted-foreground">안녕하세요 👋</p>
          <h2 className="text-xl font-bold mt-0.5">{profile.name}님</h2>
        </div>
        <Badge variant="outline" className={availConfig.className}>
          {availConfig.label}
        </Badge>
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
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 공지사항 */}
      <section className="space-y-3 pb-4">
        <h3 className="font-semibold">공지사항</h3>
        <div className="space-y-2">
          {mockNotices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
          ))}
        </div>
      </section>
    </div>
  );
}
