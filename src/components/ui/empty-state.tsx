import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "md" ? "py-16 gap-3" : "py-10 gap-2.5",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-full bg-zinc-100 flex items-center justify-center",
            size === "md" ? "h-14 w-14" : "h-11 w-11"
          )}
        >
          <Icon
            className={cn(
              "text-zinc-400",
              size === "md" ? "h-6 w-6" : "h-5 w-5"
            )}
          />
        </div>
      )}
      <div className="space-y-1">
        <p
          className={cn(
            "font-medium text-zinc-600",
            size === "md" ? "text-sm" : "text-xs"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
