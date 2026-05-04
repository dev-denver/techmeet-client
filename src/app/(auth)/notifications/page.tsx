import { Bell, CheckCircle, XCircle, Clock, Megaphone, User, FolderOpen } from "lucide-react";
import { getAlimtalkLogs } from "@/lib/supabase/queries/notifications";
import { AlimtalkServiceType } from "@/types";
import { formatDate } from "@/lib/utils/format";

const SERVICE_TYPE_CONFIG: Record<AlimtalkServiceType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  [AlimtalkServiceType.Project]: { label: "프로젝트", icon: FolderOpen },
  [AlimtalkServiceType.Notice]:  { label: "공지",     icon: Megaphone },
  [AlimtalkServiceType.Individual]: { label: "개별",  icon: User },
};

function StatusBadge({ isSuccess }: { isSuccess: boolean | null }) {
  if (isSuccess === null) {
    return (
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <Clock className="h-3.5 w-3.5" />
        처리중
      </span>
    );
  }
  if (isSuccess) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <CheckCircle className="h-3.5 w-3.5" />
        발송 완료
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-red-500">
      <XCircle className="h-3.5 w-3.5" />
      발송 실패
    </span>
  );
}

export default async function NotificationsPage() {
  const { data: logs, total } = await getAlimtalkLogs();

  return (
    <div className="pb-6">
      <div className="px-4 py-3 border-b">
        <p className="text-xs text-muted-foreground">
          카카오 알림톡으로 발송된 내역입니다. 총 {total}건
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Bell className="h-10 w-10 text-zinc-200" />
          <p className="text-sm text-muted-foreground">받은 알림이 없습니다</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {logs.map((log) => {
            const typeConfig = SERVICE_TYPE_CONFIG[log.serviceType] ?? SERVICE_TYPE_CONFIG[AlimtalkServiceType.Individual];
            const TypeIcon = typeConfig.icon;
            const displayTime = log.sentAt ?? log.createdAt;

            return (
              <li key={log.id} className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    <TypeIcon className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{log.templateName}</p>
                    <div className="flex items-center justify-between mt-1.5 gap-2">
                      <span className="text-xs text-muted-foreground">{formatDate(displayTime)}</span>
                      <StatusBadge isSuccess={log.isSuccess} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
