import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
  compact?: boolean;
}

export function ApplicationCard({
  application,
  compact = false,
}: ApplicationCardProps) {
  const config = APPLICATION_STATUS_CONFIG[application.status];

  if (compact) {
    return (
      <Link href={`/projects/${application.projectId}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer min-w-[200px] max-w-[220px]">
          <CardContent className="space-y-2">
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
        <CardContent className="space-y-3">
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
