/**
 * bg-primary 헤더 안에 사용하는 통계 그리드.
 * stats 배열 길이에 따라 컬럼 수가 자동으로 결정된다.
 *
 * valueSize: "lg" (보조 정보) | "xl" (기본, 홈 화면) | "2xl" (지원 내역 페이지처럼 강조할 때)
 * labelSize: "xs" (기본, 12px) | "10px" (홈 화면처럼 더 작은 레이블)
 * compact: true면 셀 패딩을 줄여 전체 높이를 축소 (홈 화면처럼 보조 정보일 때)
 */
import { cn } from "@/lib/utils/cn";

interface Stat {
  label: string;
  value: React.ReactNode;
}

interface StatsGridProps {
  stats: Stat[];
  valueSize?: "lg" | "xl" | "2xl";
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
              "text-primary-foreground font-bold leading-none tabular-nums",
              valueSize === "2xl" ? "text-2xl" : valueSize === "lg" ? "text-lg" : "text-xl"
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
