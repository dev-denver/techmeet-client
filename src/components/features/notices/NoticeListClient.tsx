"use client";

import { useState } from "react";
import { Bell, Loader2, Megaphone } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { NavLink } from "@/components/ui/nav-link";
import { noticesApi } from "@/lib/api/notices";
import { formatDate } from "@/lib/utils/format";
import type { Notice } from "@/types";

const PAGE_SIZE = 10;

interface NoticeListClientProps {
  initialNotices: Notice[];
  initialTotal: number;
}

export function NoticeListClient({ initialNotices, initialTotal }: NoticeListClientProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = notices.length < total;

  async function handleLoadMore() {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await noticesApi.getList({ page: nextPage, pageSize: PAGE_SIZE });
      setNotices((prev) => [...prev, ...result.data]);
      setTotal(result.total);
      setPage(nextPage);
    } finally {
      setIsLoading(false);
    }
  }

  if (notices.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        iconShape="rounded"
        title="등록된 공지사항이 없습니다"
        className="py-20"
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <p className="text-xs text-muted-foreground">
        총 <span className="font-semibold text-foreground">{total}</span>개 공지
      </p>

      <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
        {notices.map((notice) => (
          <NavLink
            key={notice.id}
            href={`/notices/${notice.id}`}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 active:bg-muted transition-colors"
          >
            {notice.isImportant && <Bell className="h-3.5 w-3.5 text-status-warning shrink-0" />}
            <p className="flex-1 text-sm text-foreground leading-snug line-clamp-1">
              {notice.title}
            </p>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDate(notice.createdAt)}
            </span>
          </NavLink>
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
            `더보기 (${total - notices.length}개 남음)`
          )}
        </button>
      )}
    </div>
  );
}
