"use client";

import { useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
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
  const [filter, setFilter]     = useState<ProjectFilterValue>("all");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(initialTotal);
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
    void fetchProjects(newFilter, 1, false);
  }

  function handleLoadMore() {
    void fetchProjects(filter, page + 1, true);
  }

  return (
    <div>
      {/* 필터 바 — TopBar 바로 아래 sticky */}
      <div className="sticky top-14 z-40 bg-white border-b px-4 py-3">
        <ProjectFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* 총 개수 */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            총 <span className="font-semibold text-foreground">{total}</span>개 프로젝트
          </p>
        )}

        {/* 로딩 (필터 변경 시 전체 로딩) */}
        {isLoading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : projects.length === 0 ? (
          /* 빈 상태 */
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600">해당하는 프로젝트가 없습니다</p>
              <p className="text-xs text-muted-foreground mt-1">다른 필터를 선택해보세요</p>
            </div>
          </div>
        ) : (
          /* 카드 리스트 */
          <>
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* 더보기 */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full mt-1 py-3 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 active:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    불러오는 중...
                  </>
                ) : (
                  `더보기 (${total - projects.length}개 남음)`
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
