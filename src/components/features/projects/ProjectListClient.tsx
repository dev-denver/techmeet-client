"use client";

import { useState, useRef } from "react";
import { FolderOpen, Loader2, Search, X } from "lucide-react";
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
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const hasMore = projects.length < total;

  async function fetchProjects(
    status: ProjectFilterValue,
    nextPage: number,
    append: boolean,
    searchValue?: string,
  ) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status,
        page: String(nextPage),
        pageSize: String(PAGE_SIZE),
      });
      const q = searchValue ?? search;
      if (q.trim()) params.set("search", q.trim());

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

  function handleSearch(value: string) {
    setSearch(value);
    void fetchProjects(filter, 1, false, value);
  }

  function handleClearSearch() {
    setSearch("");
    searchRef.current?.focus();
    void fetchProjects(filter, 1, false, "");
  }

  function handleLoadMore() {
    void fetchProjects(filter, page + 1, true);
  }

  return (
    <div>
      {/* 검색 + 필터 바 */}
      <div className="sticky top-0 z-40 bg-white border-b">
        {/* 검색창 */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 focus-within:border-zinc-400 focus-within:bg-white transition-colors">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="프로젝트 검색..."
              className="flex-1 text-sm bg-transparent text-zinc-800 placeholder:text-zinc-400 outline-none"
            />
            {search && (
              <button onClick={handleClearSearch} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {/* 필터 탭 */}
        <div className="px-4 pb-3">
          <ProjectFilters onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* 총 개수 */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            총 <span className="font-semibold text-foreground">{total}</span>개 프로젝트
            {search && <span className="ml-1 text-zinc-400">— &ldquo;{search}&rdquo; 검색 결과</span>}
          </p>
        )}

        {isLoading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600">
                {search ? `"${search}"에 해당하는 프로젝트가 없습니다` : "해당하는 프로젝트가 없습니다"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search ? "다른 검색어를 입력해보세요" : "다른 필터를 선택해보세요"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full mt-1 py-3 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 active:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />불러오는 중...</>
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
