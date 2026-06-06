import Link from "next/link";
import { MapPin, Clock, Users, CalendarRange, Layers, Sparkles } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { formatDeadlineDays, getDeadlineDays, formatWorkType, formatProjectType, formatProjectPeriod } from "@/lib/utils/format";
import { countSkillMatches } from "@/lib/utils/skills";
import { ProjectStatus } from "@/types";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  /** 현재 사용자의 기술 목록(소문자 정규화). 전달 시 매칭 배지 표시 */
  mySkills?: string[];
}

export function ProjectCard({ project, mySkills }: ProjectCardProps) {
  const deadlineText = formatDeadlineDays(project.deadline);
  const deadlineDays = getDeadlineDays(project.deadline);
  const isUrgent =
    project.status === ProjectStatus.Recruiting &&
    deadlineDays !== null &&
    deadlineDays <= 7;
  const period = formatProjectPeriod(project.duration.startDate, project.duration.endDate);
  const matchCount = mySkills ? countSkillMatches(project.techStack, mySkills) : 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="rounded-xl border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden">
        <div className="px-4 pt-4 pb-4 space-y-3">
          {/* 상태 + 마감 */}
          <div className="flex items-center justify-between gap-2">
            <ProjectStatusBadge status={project.status} />
            {project.status === ProjectStatus.Recruiting && deadlineText && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isUrgent
                    ? "bg-status-danger/10 text-status-danger"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {deadlineText}
              </span>
            )}
          </div>

          {/* 제목 + 클라이언트 */}
          <div>
            <h3 className="font-bold text-base leading-snug line-clamp-2">
              {project.title}
            </h3>
            {project.clientName && (
              <p className="text-xs text-muted-foreground mt-1">{project.clientName}</p>
            )}
          </div>

          {/* 내 기술 매칭 */}
          {matchCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-status-success">
              <Sparkles className="h-3.5 w-3.5" />
              내 기술 {matchCount}개 일치
            </div>
          )}

          {/* 기술 스택 */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* 기간 + 유형 */}
          {(period || project.projectType) && (
            <div className="flex items-center gap-2 flex-wrap">
              {period && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                  <CalendarRange className="h-3 w-3" />
                  {period}
                </span>
              )}
              {project.projectType && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                  <Layers className="h-3 w-3" />
                  {formatProjectType(project.projectType)}
                </span>
              )}
            </div>
          )}

          {/* 근무 형태 + 위치 + 인원 */}
          {(project.location || project.workType || project.headcount !== null) && (
            <div className="flex items-center gap-2 flex-wrap">
              {project.workType && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                  <Clock className="h-3 w-3" />
                  {formatWorkType(project.workType)}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </span>
              )}
              {project.headcount !== null && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                  <Users className="h-3 w-3" />
                  {project.headcount}명
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
