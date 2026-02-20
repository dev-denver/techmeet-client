"use client";

import { useState } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectCard } from "./ProjectCard";
import type { Project, ProjectFilterValue } from "@/types";
import type { GetProjectsResponse } from "@/types/api";

const PAGE_SIZE = 10;

interface ProjectListClientProps {
  initialProjects: Project[];
  initialTotal: number;
}

export function ProjectListClient({ initialProjects, initialTotal }: ProjectListClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<ProjectFilterValue>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = projects.length < total;

  async function fetchProjects(status: ProjectFilterValue, nextPage: number, append: boolean) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status,
        page: String(nextPage),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/projects?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const result: GetProjectsResponse = await res.json();
      setTotal(result.total);
      setProjects(append ? (prev) => [...prev, ...result.data] : result.data);
      setPage(nextPage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(newFilter: ProjectFilterValue) {
    setFilter(newFilter);
    fetchProjects(newFilter, 1, false);
  }

  function handleLoadMore() {
    fetchProjects(filter, page + 1, true);
  }

  return (
    <div className="space-y-4">
      <ProjectFilters onFilterChange={handleFilterChange} />
      <div className="space-y-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          !isLoading && (
            <p className="text-center text-sm text-muted-foreground py-12">
              해당하는 프로젝트가 없습니다.
            </p>
          )
        )}
      </div>
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-3 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              불러오는 중...
            </>
          ) : (
            "더보기"
          )}
        </button>
      )}
    </div>
  );
}
