import { getProjects } from "@/lib/supabase/queries/projects";
import { ProjectListClient } from "@/components/features/projects/ProjectListClient";

export default async function ProjectsPage() {
  const { data: projects, total } = await getProjects({ status: "all", pageSize: 10 });

  return <ProjectListClient initialProjects={projects} initialTotal={total} />;
}
