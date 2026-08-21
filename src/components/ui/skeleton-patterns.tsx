/**
 * loading.tsx 파일에서 반복되는 스켈레톤 패턴 조각 모음.
 *
 * SkeletonCard          — SurfaceCard와 동일한 padding 스케일을 공유하는 래퍼 (프로젝트/지원/알림 카드 공통)
 * SkeletonBadgeRow      — 가로 나열된 pill 스켈레톤 (기술 스택 등)
 * SkeletonSectionHeader — 섹션 제목 + 우측 링크 형태의 헤더 스켈레톤
 */
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { surfaceCardVariants, type SurfaceCardProps } from "@/components/ui/surface-card";

interface SkeletonCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: SurfaceCardProps["padding"];
}

export function SkeletonCard({ children, className, padding = "md" }: SkeletonCardProps) {
  return (
    <div className={cn(surfaceCardVariants({ padding }), "space-y-3", className)}>
      {children}
    </div>
  );
}

export function SkeletonBadgeRow({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-12 rounded-full" />
      ))}
    </div>
  );
}

export function SkeletonSectionHeader() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
