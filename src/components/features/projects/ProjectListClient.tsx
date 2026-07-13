"use client";

import { useState, useRef, useEffect } from "react";
import { ClipboardList, FolderOpen, Loader2, Search, X } from "lucide-react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/empty-state";
import { NavLink } from "@/components/ui/nav-link";
import type { Project, ProjectFilterValue } from "@/types";
import type { GetProjectsResponse } from "@/types/api";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

interface ProjectListClientProps {
  initialProjects: Project[];
  initialTotal: number;
  mySkills?: string[];
}

export function ProjectListClient({ initialProjects, initialTotal, mySkills }: ProjectListClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter]     = useState<ProjectFilterValue>("all");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 요청 순번 — 디바운스 검색과 더보기가 겹칠 때 늦게 도착한 이전 응답이 최신 상태를 덮어쓰지 않도록 함
  const requestSeqRef = useRef(0);

  // 언마운트 시 대기 중인 디바운스 타이머 정리
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const hasMore = projects.length < total;

  async function fetchProjects(
    status: ProjectFilterValue,
    nextPage: number,
    append: boolean,
    searchValue?: string,
  ) {
    const seq = ++requestSeqRef.current;
    setIsLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams({
        status,
        page: String(nextPage),
        pageSize: String(PAGE_SIZE),
      });
      const q = searchValue ?? search;
      if (q.trim()) params.set("search", q.trim());

      const res = await fetch(`/api/projects?${params}`);
      if (!res.ok) throw new Error(`projects fetch failed: ${res.status}`);
      const result: GetProjectsResponse = await res.json();
      if (seq !== requestSeqRef.current) return; // 더 최신 요청이 있으면 이 응답은 무시
      setTotal(result.total);
      setProjects(append ? (prev) => [...prev, ...result.data] : result.data);
      setPage(nextPage);
    } catch {
      if (seq === requestSeqRef.current) {
        setLoadError("프로젝트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      if (seq === requestSeqRef.current) setIsLoading(false);
    }
  }

  function handleFilterChange(newFilter: ProjectFilterValue) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilter(newFilter);
    void fetchProjects(newFilter, 1, false);
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchProjects(filter, 1, false, value);
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleClearSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
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
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        {/* 검색창 */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border focus-within:border-muted-foreground/50 focus-within:bg-background transition-colors">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="프로젝트 검색..."
              className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            />
            {search && (
              <button onClick={handleClearSearch} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {/* 필터 탭 */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <ProjectFilters onFilterChange={handleFilterChange} />
          </div>
          <NavLink
            href="/projects/applications"
            className="shrink-0 inline-flex items-center h-[30px] px-3 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors gap-1"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            내 신청 현황
          </NavLink>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* 로드 실패 메시지 */}
        {loadError && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
            {loadError}
          </p>
        )}

        {/* 총 개수 */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            총 <span className="font-semibold text-foreground">{total}</span>개 프로젝트
            {search && <span className="ml-1 text-muted-foreground">— &ldquo;{search}&rdquo; 검색 결과</span>}
          </p>
        )}

        {isLoading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            iconShape="rounded"
            title={search ? `"${search}"에 해당하는 프로젝트가 없습니다` : "해당하는 프로젝트가 없습니다"}
            description={search ? "다른 검색어를 입력해보세요" : "다른 필터를 선택해보세요"}
          />
        ) : (
          <>
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} mySkills={mySkills} />
              ))}
            </div>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full mt-1 py-3 text-sm font-normal text-muted-foreground border border-border rounded-md hover:bg-muted/50 active:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
