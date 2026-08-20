import { CheckCircle, XCircle, Clock, Megaphone, User, FolderOpen, History, ChevronRight } from "lucide-react";
import { getAlimtalkLogs } from "@/lib/supabase/queries/notifications";
import { EmptyState } from "@/components/ui/empty-state";
import { NavLink } from "@/components/ui/nav-link";
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
      <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        <Clock className="h-3 w-3" />
        처리중
      </span>
    );
  }
  if (isSuccess) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium text-status-success bg-status-success/10 px-2 py-0.5 rounded-full">
        <CheckCircle className="h-3 w-3" />
        발송 완료
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-full">
      <XCircle className="h-3 w-3" />
      발송 실패
    </span>
  );
}

export default async function NotificationsPage() {
  let logs: Awaited<ReturnType<typeof getAlimtalkLogs>>["data"] = [];
  let total = 0;
  let loadFailed = false;
  try {
    const result = await getAlimtalkLogs();
    logs = result.data;
    total = result.total;
  } catch {
    loadFailed = true;
  }

  return (
    <div className="pb-6">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-xs text-muted-foreground font-medium">
          카카오 알림톡 발송 내역 · 총 {total}건
        </p>
      </div>

      {loadFailed ? (
        <EmptyState
          icon={History}
          title="발송 내역을 불러오지 못했습니다"
          description="잠시 후 다시 시도해주세요"
          iconShape="rounded"
          iconSize="sm"
          className="py-20"
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={History}
          title="발송된 알림이 없습니다"
          description="지원 결과나 신규 프로젝트가 등록되면 카카오 알림톡으로 안내드려요"
          iconShape="rounded"
          iconSize="sm"
          className="py-20"
        />
      ) : (
        <div className="px-4 pt-4 space-y-2">
          {logs.map((log) => {
            const typeConfig = SERVICE_TYPE_CONFIG[log.serviceType] ?? SERVICE_TYPE_CONFIG[AlimtalkServiceType.Individual];
            const TypeIcon = typeConfig.icon;
            const displayTime = log.sentAt ?? log.createdAt;
            // 프로젝트 알림은 프로젝트 목록으로, 공지 알림은 공지사항 목록으로 이동
            // (엔티티 레벨 딥링크는 DB 컬럼 필요 → 추후. 개별 알림은 대상을 특정할 수 없어 링크 없음)
            const href =
              log.serviceType === AlimtalkServiceType.Project
                ? "/projects"
                : log.serviceType === AlimtalkServiceType.Notice
                ? "/notices"
                : null;

            const cardInner = (
              <div className="flex items-start gap-3 px-4 py-3.5">
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted"
                  aria-hidden="true"
                >
                  <TypeIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-medium text-muted-foreground">{typeConfig.label}</span>
                  <p className="text-sm font-medium text-foreground leading-snug">{log.templateName}</p>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-xs text-muted-foreground">{formatDate(displayTime)}</span>
                    <StatusBadge isSuccess={log.isSuccess} />
                  </div>
                </div>
                {href && <ChevronRight className="h-4 w-4 text-muted-foreground self-center shrink-0" />}
              </div>
            );

            return href ? (
              <NavLink
                key={log.id}
                href={href}
                className="block rounded-xl border border-border bg-card overflow-hidden hover:bg-muted/40 active:bg-muted transition-colors"
              >
                {cardInner}
              </NavLink>
            ) : (
              <div key={log.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {cardInner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
