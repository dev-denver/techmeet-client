import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { Application, ApplicationStatus } from "@/types";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "검토 대기",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  reviewing: {
    label: "검토중",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  interview: {
    label: "면접 예정",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  accepted: {
    label: "합격",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "불합격",
    className: "bg-red-100 text-red-600 border-red-200",
  },
  withdrawn: {
    label: "취소",
    className: "bg-zinc-100 text-zinc-500 border-zinc-200",
  },
};

interface ApplicationCardProps {
  application: Application;
  compact?: boolean;
}

export function ApplicationCard({
  application,
  compact = false,
}: ApplicationCardProps) {
  const config = statusConfig[application.status];

  if (compact) {
    return (
      <Link href={`/projects/${application.projectId}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer min-w-[200px] max-w-[220px]">
          <CardContent className="p-4 space-y-2">
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {application.projectTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(application.appliedAt)} 지원
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${application.projectId}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
              {application.projectTitle}
            </h3>
            <Badge variant="outline" className={`${config.className} shrink-0`}>
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {application.coverLetter}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>희망 단가: {application.expectedRate.toLocaleString()}만원/월</span>
            <span>{formatDate(application.appliedAt)} 지원</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
