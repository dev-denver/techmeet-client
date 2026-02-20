import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getApplications } from "@/lib/supabase/queries/applications";

export default async function ApplicationsPage() {
  const { data: applications, total } = await getApplications();

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">총 {total}건 지원</p>
      {applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">
            아직 지원한 프로젝트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
