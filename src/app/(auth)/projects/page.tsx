import { mockProjects } from "@/lib/utils/mockData";
import { ProjectListClient } from "@/components/features/projects/ProjectListClient";

export default function ProjectsPage() {
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        총 {mockProjects.length}개 프로젝트
      </p>
      <ProjectListClient projects={mockProjects} />
    </div>
  );
}
