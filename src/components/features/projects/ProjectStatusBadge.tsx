import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { ProjectStatus } from "@/types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  // DB에 마이그레이션 이전 값(예: in_progress)이 남아있는 경우를 대비한 안전장치
  const config = PROJECT_STATUS_CONFIG[status] ?? PROJECT_STATUS_CONFIG[ProjectStatus.Completed];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
