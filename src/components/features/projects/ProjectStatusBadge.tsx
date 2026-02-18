import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types";

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  recruiting: {
    label: "모집중",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  in_progress: {
    label: "진행중",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completed: {
    label: "완료",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  cancelled: {
    label: "취소",
    className: "bg-red-100 text-red-600 border-red-200",
  },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
