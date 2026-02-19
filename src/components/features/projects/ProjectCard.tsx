import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { formatBudget, formatDeadlineDays, getDeadlineDays, formatWorkType } from "@/lib/utils/format";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const deadlineText = formatDeadlineDays(project.deadline);
  const deadlineDays = getDeadlineDays(project.deadline);
  const isUrgent =
    project.status === "recruiting" &&
    deadlineDays !== null &&
    deadlineDays <= 7;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="space-y-3">
          {/* 헤더: 상태 + 마감 */}
          <div className="flex items-center justify-between">
            <ProjectStatusBadge status={project.status} />
            {project.status === "recruiting" && (
              <span
                className={`text-xs ${isUrgent ? "text-red-500 font-semibold" : "text-muted-foreground"}`}
              >
                {deadlineText}
              </span>
            )}
          </div>

          {/* 제목 */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {project.title}
          </h3>

          {/* 클라이언트 */}
          <p className="text-xs text-muted-foreground">{project.clientName}</p>

          {/* 기술 스택 */}
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

          {/* 메타 정보 */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatBudget(project.budget.min, project.budget.max)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatWorkType(project.workType)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {project.headcount}명
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
