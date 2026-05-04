import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { EmptyState } from "@/components/ui/empty-state";
import { getApplications } from "@/lib/supabase/queries/applications";

export default async function ApplicationsPage() {
  const { data: applications, total } = await getApplications();

  return (
    <div className="p-4 space-y-4">
      {total > 0 && (
        <p className="text-xs text-muted-foreground">총 {total}건 지원</p>
      )}
      {applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="아직 지원한 프로젝트가 없습니다"
          description="관심 있는 프로젝트에 지원해보세요"
          action={
            <Link
              href="/projects"
              className="mt-1 text-xs text-primary hover:underline underline-offset-2"
            >
              프로젝트 보러가기 →
            </Link>
          }
        />
      )}
    </div>
  );
}
