import { CheckCircle, XCircle, Clock, Megaphone, User, FolderOpen, Bell } from "lucide-react";
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
      <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
        <Clock className="h-3 w-3" />
        처리중
      </span>
    );
  }
  if (isSuccess) {
    return (
      <span className="flex items-center gap-1 text-[10px] text-status-success bg-status-success/10 px-2 py-0.5 rounded-full">
        <CheckCircle className="h-3 w-3" />
        발송 완료
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full">
      <XCircle className="h-3 w-3" />
      발송 실패
    </span>
  );
}

export default async function NotificationsPage() {
  const { data: logs, total } = await getAlimtalkLogs();

  return (
    <div className="pb-6">
      <div className="px-5 py-3.5 border-b border-zinc-100">
        <p className="text-[11px] text-zinc-400 font-medium">
          카카오 알림톡 발송 내역 · 총 {total}건
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <Bell className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm text-zinc-500">받은 알림이 없습니다</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-2">
          {logs.map((log) => {
            const typeConfig = SERVICE_TYPE_CONFIG[log.serviceType] ?? SERVICE_TYPE_CONFIG[AlimtalkServiceType.Individual];
            const TypeIcon = typeConfig.icon;
            const displayTime = log.sentAt ?? log.createdAt;

            return (
              <div key={log.id} className="rounded-xl border border-zinc-100 bg-white overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                    <TypeIcon className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 leading-snug">{log.templateName}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[11px] text-zinc-400">{formatDate(displayTime)}</span>
                      <StatusBadge isSuccess={log.isSuccess} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
