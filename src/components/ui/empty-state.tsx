/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트.
 *
 * iconShape: "circle" (기본) | "rounded" — 아이콘 컨테이너 모양
 * iconSize:  "md" (기본, w-14 h-14) | "sm" (w-12 h-12)
 * action:    링크나 버튼 등 추가 인터랙션 (optional)
 */
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  iconShape?: "circle" | "rounded";
  iconSize?: "sm" | "md";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconShape = "circle",
  iconSize = "md",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          iconSize === "sm" ? "w-12 h-12" : "w-14 h-14",
          iconShape === "rounded" ? "rounded-2xl" : "rounded-full"
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            iconSize === "sm" ? "h-5 w-5" : "h-6 w-6"
          )}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
