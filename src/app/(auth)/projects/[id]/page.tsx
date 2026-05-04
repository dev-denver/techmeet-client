import { notFound } from "next/navigation";

function ProjectDeadlineCard({ deadline }: { deadline: string }) {
  const deadlineText = formatDeadlineDays(deadline);
  const isExpired = deadlineText === "마감";
  return (
    <div className="p-4 border-b">
      <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">지원 마감일</p>
          <p className="font-semibold text-sm mt-0.5">{formatDate(deadline)}</p>
        </div>
        <span className={`text-sm font-semibold ${isExpired ? "text-muted-foreground" : "text-orange-600"}`}>
          {deadlineText}
        </span>
      </div>
    </div>
  );
}

import { MapPin, Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/features/projects/ProjectStatusBadge";
import { ApplyButton } from "@/components/features/projects/ApplyButton";
import { ShareButton } from "@/components/features/projects/ShareButton";
import { getProjectById } from "@/lib/supabase/queries/projects";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate, formatDeadlineDays, formatWorkType } from "@/lib/utils/format";
import { ProjectStatus } from "@/types";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const [result, supabase] = await Promise.all([
    getProjectById(id),
    createServerClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? null;

  if (!result) {
    notFound();
  }

  const { data: project } = result;
  const isRecruiting = project.status === ProjectStatus.Recruiting;

  return (
    <div className="pb-6">
      {/* 헤더 */}
      <div className="p-4 space-y-2.5 border-b">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            {isRecruiting && (
              <span className="text-xs text-muted-foreground">
                {formatDeadlineDays(project.deadline)}
              </span>
            )}
          </div>
          {currentUserId && (
            <ShareButton projectId={project.id} userId={currentUserId} />
          )}
        </div>
        <h1 className="text-lg font-bold leading-snug">{project.title}</h1>
        {project.clientName && (
          <p className="text-sm text-muted-foreground">{project.clientName}</p>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-3">프로젝트 정보</h2>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          {project.workType && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">근무 형태</p>
                <p className="text-sm font-medium mt-0.5">{formatWorkType(project.workType)}</p>
              </div>
            </div>
          )}
          {project.headcount !== null && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">모집 인원</p>
                <p className="text-sm font-medium mt-0.5">{project.headcount}명</p>
              </div>
            </div>
          )}
          {(project.duration.startDate || project.duration.endDate) && (
            <div className="flex items-start gap-2 col-span-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">프로젝트 기간</p>
                <p className="text-sm font-medium mt-0.5">
                  {formatDate(project.duration.startDate)} ~ {formatDate(project.duration.endDate)}
                </p>
              </div>
            </div>
          )}
          {project.location && (
            <div className="flex items-start gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">근무 위치</p>
                <p className="text-sm font-medium mt-0.5">{project.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 기술 스택 */}
      {project.techStack.length > 0 && (
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">요구 기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 설명 */}
      {project.description && (
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">프로젝트 소개</h2>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      {/* 자격 요건 */}
      {project.requirements && project.requirements.length > 0 && (
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">자격 요건</h2>
          <ul className="space-y-2">
            {project.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                <span className="text-zinc-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 지원 마감 */}
      {project.deadline && <ProjectDeadlineCard deadline={project.deadline} />}

      {/* 지원하기 CTA */}
      <div className="p-4">
        {isRecruiting ? (
          <ApplyButton projectId={project.id} />
        ) : (
          <Button className="w-full h-12 text-base font-semibold" disabled>
            {project.status === ProjectStatus.InProgress ? "진행 중인 프로젝트" : "모집 종료"}
          </Button>
        )}
      </div>
    </div>
  );
}
