import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { formatDeadlineDays, getDeadlineDays, formatWorkType } from "@/lib/utils/format";
import { ProjectStatus } from "@/types";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const deadlineText = formatDeadlineDays(project.deadline);
  const deadlineDays = getDeadlineDays(project.deadline);
  const isUrgent =
    project.status === ProjectStatus.Recruiting &&
    deadlineDays !== null &&
    deadlineDays <= 7;

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
                    ? "bg-red-50 text-red-500"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {deadlineText}
              </span>
            )}
          </div>

          {/* 제목 + 클라이언트 */}
          <div>
            <h3 className="font-bold text-[15px] leading-snug line-clamp-2">
              {project.title}
            </h3>
            {project.clientName && (
              <p className="text-xs text-muted-foreground mt-1">{project.clientName}</p>
            )}
          </div>

          {/* 기술 스택 */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          {(project.location || project.workType || project.headcount !== null) && (
            <div className="flex items-center gap-2 flex-wrap">
              {project.workType && (
                <span className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
                  <Clock className="h-3 w-3" />
                  {formatWorkType(project.workType)}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </span>
              )}
              {project.headcount !== null && (
                <span className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
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
