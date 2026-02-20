import { notFound } from "next/navigation";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNoticeById } from "@/lib/supabase/queries/notices";
import { formatDate } from "@/lib/utils/format";

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <div className="pb-6">
      <div className="p-4 space-y-3 border-b">
        {notice.isImportant && (
          <Badge className="text-xs bg-orange-50 text-orange-600 border-orange-200 flex items-center gap-1 w-fit">
            <Bell className="h-3 w-3" />
            중요 공지
          </Badge>
        )}
        <h1 className="text-lg font-bold leading-snug">{notice.title}</h1>
        <p className="text-xs text-muted-foreground">{formatDate(notice.createdAt)}</p>
      </div>

      <div className="p-4">
        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
          {notice.content}
        </p>
      </div>
    </div>
  );
}
