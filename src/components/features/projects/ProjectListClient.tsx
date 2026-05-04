"use client";

import { useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/empty-state";
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

      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="해당하는 프로젝트가 없습니다"
          description="다른 필터를 선택해보세요"
        />
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-3 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
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
