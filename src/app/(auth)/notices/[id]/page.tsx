import { notFound } from "next/navigation";
import Link from "next/link";
import { Bell, CalendarDays, ChevronUp, ChevronDown, LayoutList, Paperclip, Download } from "lucide-react";
import { getNoticeById, getNotices } from "@/lib/supabase/queries/notices";
import { formatDate } from "@/lib/utils/format";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

      {/* 첨부파일 */}
      {notice.attachments.length > 0 && (
        <div className="px-4 pb-5 border-t pt-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              첨부파일 {notice.attachments.length}개
            </span>
          </div>
          <ul className="space-y-2">
            {notice.attachments.map((file, index) => (
              <li key={index}>
                <a
                  href={file.url}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 hover:bg-muted/60 active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
                  {file.size !== undefined && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

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
