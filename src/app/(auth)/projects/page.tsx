import { getProjects } from "@/lib/supabase/queries/projects";
import { ProjectListClient } from "@/components/features/projects/ProjectListClient";

export default async function ProjectsPage() {
  const { data: projects, total } = await getProjects({ status: "all" });

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">총 {total}개 프로젝트</p>
      <ProjectListClient projects={projects} />
    </div>
  );
}
