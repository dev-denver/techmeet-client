import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonBadgeRow } from "@/components/ui/skeleton-patterns";

export default function ProjectsLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-4 w-28" />
      {/* 필터 */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-full" />
        ))}
      </div>
      {/* 카드 목록 */}
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i}>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <SkeletonBadgeRow />
          <div className="flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
