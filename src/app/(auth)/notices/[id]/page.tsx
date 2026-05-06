import { notFound } from "next/navigation";
import Link from "next/link";
import { Bell, CalendarDays, ChevronUp, ChevronDown, LayoutList } from "lucide-react";
import { getNoticeById, getNotices } from "@/lib/supabase/queries/notices";
import { formatDate } from "@/lib/utils/format";

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const [notice, allNoticesResult] = await Promise.all([
    getNoticeById(id),
    getNotices(),
  ]);

  if (!notice) notFound();

  const allNotices = allNoticesResult.data;
  const currentIndex = allNotices.findIndex((n) => n.id === id);
  // 목록은 최신순(desc) — index 낮을수록 최신
  const newerNotice = currentIndex > 0 ? allNotices[currentIndex - 1] : null;
  const olderNotice = currentIndex < allNotices.length - 1 ? allNotices[currentIndex + 1] : null;

  return (
    <div className="pb-6">
      {/* 헤더 */}
      <div className="px-4 pt-6 pb-5 border-b">
        {notice.isImportant && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 mb-3">
            <Bell className="h-3 w-3" />
            중요 공지
          </span>
        )}
        <h1 className="text-xl font-bold leading-snug">{notice.title}</h1>
        <div className="flex items-center gap-1.5 mt-3">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formatDate(notice.createdAt)}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 py-6 min-h-[200px]">
        <p className="text-base text-foreground leading-loose whitespace-pre-wrap">
          {notice.content}
        </p>
      </div>

      {/* 이전 / 다음 / 목록 */}
      <div className="border-t border-b divide-y divide-border">
        {newerNotice && (
          <Link href={`/notices/${newerNotice.id}`}>
            <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 active:bg-muted transition-colors">
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 w-10">
                <ChevronUp className="h-3.5 w-3.5" />
                다음
              </span>
              <p className="text-sm text-foreground truncate flex-1">{newerNotice.title}</p>
            </div>
          </Link>
        )}
        {olderNotice && (
          <Link href={`/notices/${olderNotice.id}`}>
            <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 active:bg-muted transition-colors">
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 w-10">
                <ChevronDown className="h-3.5 w-3.5" />
                이전
              </span>
              <p className="text-sm text-foreground truncate flex-1">{olderNotice.title}</p>
            </div>
          </Link>
        )}
      </div>

      <Link href="/">
        <div className="flex items-center justify-center gap-1.5 px-4 py-4 hover:bg-muted/50 active:bg-muted transition-colors">
          <LayoutList className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">목록으로</span>
        </div>
      </Link>
    </div>
  );
}
