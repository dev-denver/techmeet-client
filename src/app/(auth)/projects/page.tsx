import { getProjects } from "@/lib/supabase/queries/projects";
import { getProfile } from "@/lib/supabase/queries/profile";
import { getMySkills } from "@/lib/utils/skills";
import { ProjectListClient } from "@/components/features/projects/ProjectListClient";

export default async function ProjectsPage() {
  const [{ data: projects, total }, profileResult] = await Promise.all([
    getProjects({ status: "all", pageSize: 10 }),
    getProfile(),
  ]);

  const mySkills = profileResult?.data ? getMySkills(profileResult.data) : [];

  return <ProjectListClient initialProjects={projects} initialTotal={total} mySkills={mySkills} />;
}
