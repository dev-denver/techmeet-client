import { ApplicationCard } from "@/components/features/projects/ApplicationCard";
import { getApplications } from "@/lib/supabase/queries/applications";

const statusOrder = [
  "interview",
  "reviewing",
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
];

export default async function ApplicationsPage() {
  const { data: applications, total } = await getApplications();

  const sorted = [...applications].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">총 {total}건 지원</p>
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((app) => (
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
