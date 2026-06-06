"use client";

import { cn } from "@/lib/utils/cn";
import type { CompletionItem, ProfileTabKey } from "@/lib/utils/profile-completion";

interface ProfileCompletionBarProps {
  percent: number;
  missing: CompletionItem[];
  onSelect: (tab: ProfileTabKey) => void;
  className?: string;
}

export function ProfileCompletionBar({ percent, missing, onSelect, className }: ProfileCompletionBarProps) {
  const complete = percent >= 100;

  return (
    <div className={cn("rounded-xl border border-border bg-card px-4 py-3.5", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">프로필 완성도</span>
        <span className={cn("text-sm font-bold tabular-nums", complete ? "text-status-success" : "text-foreground")}>
          {percent}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="프로필 완성도">
        <div
          className={cn("h-full rounded-full transition-all duration-500", complete ? "bg-status-success" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>

      {!complete && missing.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1.5">다음 항목을 채우면 매칭 확률이 올라가요</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 4).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => onSelect(m.tab)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                + {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
