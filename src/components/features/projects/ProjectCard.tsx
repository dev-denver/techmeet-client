import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        {/* 상단: 상태 + 마감 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <ProjectStatusBadge status={project.status} />
          {project.status === ProjectStatus.Recruiting && (
            <span
              className={`text-xs font-medium ${isUrgent ? "text-red-500" : "text-muted-foreground"}`}
            >
              {deadlineText}
            </span>
          )}
        </div>

        <div className="px-4 pb-4 space-y-2.5">
          {/* 제목 */}
          <h3 className="font-semibold leading-snug line-clamp-2">
            {project.title}
          </h3>

          {/* 클라이언트 */}
          {project.clientName && (
            <p className="text-xs text-muted-foreground">{project.clientName}</p>
          )}

          {/* 기술 스택 */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 4 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{project.techStack.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          {(project.location || project.workType || project.headcount !== null) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
              {project.workType && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatWorkType(project.workType)}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </span>
              )}
              {project.headcount !== null && (
                <span className="flex items-center gap-1">
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
