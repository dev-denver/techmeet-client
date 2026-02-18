"use client";

import { useState } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectCard } from "./ProjectCard";
import type { Project, ProjectFilterValue } from "@/types";

interface ProjectListClientProps {
  projects: Project[];
}

export function ProjectListClient({ projects }: ProjectListClientProps) {
  const [filter, setFilter] = useState<ProjectFilterValue>("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="space-y-4">
      <ProjectFilters onFilterChange={setFilter} />
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-12">
            해당하는 프로젝트가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
