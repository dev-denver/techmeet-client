/**
 * bg-primary 헤더 안에 사용하는 통계 그리드.
 * stats 배열 길이에 따라 컬럼 수가 자동으로 결정된다.
 *
 * valueSize: "lg" (보조 정보) | "xl" (기본, 홈 화면 · 지원 내역 페이지)
 * labelSize: "xs" (기본, 12px) | "10px" (홈 화면처럼 더 작은 레이블)
 * compact: true면 셀 패딩을 줄여 전체 높이를 축소 (홈 화면처럼 보조 정보일 때)
 *
 * 숫자는 DESIGN.md의 Stat Value 타이포 토큰(font-mono, tabular-nums)을 따른다.
 * Two-Weight Rule: text-2xl 이상은 쓰지 않는다 — valueSize에도 "2xl" 옵션을 두지 않는다.
 */
import { cn } from "@/lib/utils/cn";

interface Stat {
  label: string;
  value: React.ReactNode;
}

interface StatsGridProps {
  stats: Stat[];
  valueSize?: "lg" | "xl";
  labelSize?: "xs" | "10px";
  compact?: boolean;
  className?: string;
}

export function StatsGrid({ stats, valueSize = "xl", labelSize = "xs", compact = false, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid divide-x divide-primary-foreground/20 bg-primary-foreground/10 border border-primary-foreground/15 rounded-2xl overflow-hidden",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className={cn("text-center", compact ? "py-2.5" : "py-4")}>
          <p
            className={cn(
              "text-primary-foreground font-bold font-mono leading-none tabular-nums",
              valueSize === "lg" ? "text-lg" : "text-xl"
            )}
          >
            {stat.value}
          </p>
          <p className={cn("text-primary-foreground/50 font-medium", compact ? "mt-1" : "mt-2", labelSize === "10px" ? "text-[10px]" : "text-xs")}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
