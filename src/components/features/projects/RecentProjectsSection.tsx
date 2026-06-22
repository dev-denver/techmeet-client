"use client";

import { useEffect, useSyncExternalStore } from "react";
import { History } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import {
  getRecentProjects,
  getRecentProjectsServerSnapshot,
  removeRecentProjects,
  subscribeRecentProjects,
} from "@/lib/utils/recent-projects";

interface RecentProjectsSectionProps {
  /** 현재 보고 있는 프로젝트는 목록에서 제외 (선택) */
  excludeId?: string;
}

export function RecentProjectsSection({ excludeId }: RecentProjectsSectionProps) {
  const all = useSyncExternalStore(
    subscribeRecentProjects,
    getRecentProjects,
    getRecentProjectsServerSnapshot
  );
  const items = excludeId ? all.filter((p) => p.id !== excludeId) : all;
  const idsKey = items.map((p) => p.id).join(",");

  // 삭제된 프로젝트는 localStorage에 그대로 남아있을 수 있으므로 서버에 존재 여부를 확인 후 정리
  useEffect(() => {
    if (!idsKey) return;
    const ids = idsKey.split(",");
    let cancelled = false;
    Promise.all(
      ids.map(async (id) => {
        try {
          await projectsApi.getById(id);
          return null;
        } catch (err) {
          return err instanceof ApiError && err.status === 404 ? id : null;
        }
      })
    ).then((staleIds) => {
      if (cancelled) return;
      const valid = staleIds.filter((id): id is string => id !== null);
      if (valid.length > 0) removeRecentProjects(valid);
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  // 최근 본 항목이 없으면 섹션 자체를 렌더링하지 않음 (서버 스냅샷이 빈 배열이라 하이드레이션 안전)
  if (items.length === 0) return null;

  return (
    <section className="pt-5 pb-4 border-b">
      <div className="flex items-center gap-1.5 px-4 mb-3">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold">최근 본 프로젝트</h3>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none px-4">
        {items.map((p) => (
          <NavLink
            key={p.id}
            href={`/projects/${p.id}`}
            className="block shrink-0 min-w-[160px] max-w-[200px] rounded-xl border border-border bg-card px-3.5 py-3 hover:border-muted-foreground/40 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold leading-snug line-clamp-2">{p.title}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
