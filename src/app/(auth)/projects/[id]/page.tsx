import { notFound } from "next/navigation";
import { MapPin, Clock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/features/projects/ProjectStatusBadge";
import { ApplyButton } from "@/components/features/projects/ApplyButton";
import { ShareButton } from "@/components/features/projects/ShareButton";
import { getProjectById } from "@/lib/supabase/queries/projects";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate, formatDeadlineDays, getDeadlineDays, formatWorkType } from "@/lib/utils/format";
import { ProjectStatus } from "@/types";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [result, supabase] = await Promise.all([
    getProjectById(id),
    createServerClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? null;

  if (!result) notFound();

  const { data: project } = result;
  const isRecruiting = project.status === ProjectStatus.Recruiting;
  const deadlineText = formatDeadlineDays(project.deadline);
  const deadlineDays = getDeadlineDays(project.deadline);
  const isUrgent = isRecruiting && deadlineDays !== null && deadlineDays <= 7;
  const isExpired = deadlineText === "마감";

  return (
    <div>
      {/* 히어로 */}
      <div className="bg-zinc-800 px-5 pt-6 pb-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <ProjectStatusBadge status={project.status} />
          <div className="flex items-center gap-2">
            {isRecruiting && deadlineText && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isUrgent
                    ? "bg-red-500/20 text-red-400"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {deadlineText}
              </span>
            )}
            {currentUserId && (
              <ShareButton
                projectId={project.id}
                userId={currentUserId}
                className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 bg-transparent"
              />
            )}
          </div>
        </div>

        <h1 className="text-white text-xl font-bold leading-snug">{project.title}</h1>
        {project.clientName && (
          <p className="text-zinc-500 text-sm mt-1.5">{project.clientName}</p>
        )}

        {/* 핵심 정보 chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.workType && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-full">
              <Clock className="h-3 w-3" />
              {formatWorkType(project.workType)}
            </span>
          )}
          {project.location && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-full">
              <MapPin className="h-3 w-3" />
              {project.location}
            </span>
          )}
          {project.headcount !== null && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-full">
              <Users className="h-3 w-3" />
              {project.headcount}명 모집
            </span>
          )}
          {(project.duration.startDate || project.duration.endDate) && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3" />
              {formatDate(project.duration.startDate)} ~ {formatDate(project.duration.endDate)}
            </span>
          )}
        </div>
      </div>

      {/* 기술 스택 */}
      {project.techStack.length > 0 && (
        <div className="px-4 py-5 border-b">
          <h2 className="font-semibold mb-3">요구 기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-sm bg-zinc-700 text-zinc-100 px-3 py-1 rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 소개 */}
      {project.description && (
        <div className="px-4 py-5 border-b bg-zinc-50">
          <h2 className="font-semibold mb-3">프로젝트 소개</h2>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      {/* 자격 요건 */}
      {project.requirements && project.requirements.length > 0 && (
        <div className="px-4 py-5 border-b">
          <h2 className="font-semibold mb-3">자격 요건</h2>
          <ul className="space-y-2.5">
            {project.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
                <span className="text-zinc-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 마감일 */}
      {project.deadline && (
        <div className="px-5 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">지원 마감일</p>
              <p className="text-sm font-semibold text-foreground">{formatDate(project.deadline)}</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isExpired
                  ? "bg-muted text-muted-foreground"
                  : isUrgent
                  ? "bg-status-danger/10 text-status-danger"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {deadlineText}
            </span>
          </div>
        </div>
      )}

      {/* CTA 높이만큼 하단 여백 확보 */}
      <div className="h-20" />

      {/* CTA - BottomNav 바로 위에 고정 */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-30 bg-background border-t border-border px-4 py-3">
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
