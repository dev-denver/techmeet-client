/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트.
 *
 * variant:   "default" (기본, py-16 전체 페이지용) | "inline" (섹션 내 컴팩트, 점선 박스)
 * icon:      아이콘 (optional) — "inline" variant에서는 보통 생략
 * iconShape: "circle" (기본) | "rounded" — 아이콘 컨테이너 모양
 * iconSize:  "md" (기본, w-14 h-14) | "sm" (w-12 h-12)
 * action:    링크나 버튼 등 추가 인터랙션 (optional)
 */
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  iconShape?: "circle" | "rounded";
  iconSize?: "sm" | "md";
  variant?: "default" | "inline";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconShape = "circle",
  iconSize = "md",
  variant = "default",
  className,
}: EmptyStateProps) {
  if (variant === "inline") {
    return (
      <div className={cn("mx-4 rounded-xl bg-muted/50 border border-dashed border-border px-4 py-5 text-center", className)}>
        <p className="text-sm text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {action}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 gap-3", className)}>
      {Icon && (
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
      )}
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
