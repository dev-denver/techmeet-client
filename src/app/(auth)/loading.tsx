import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonBadgeRow, SkeletonSectionHeader } from "@/components/ui/skeleton-patterns";

export default function HomeLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* 인사 배너 */}
      <section className="flex items-center justify-between pt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </section>

      {/* 내 신청 현황 */}
      <section className="space-y-3">
        <SkeletonSectionHeader />
        <div className="flex gap-3 overflow-hidden -mx-4 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[200px] max-w-[220px] p-4 border rounded-xl space-y-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </section>

      {/* 최근 프로젝트 */}
      <section className="space-y-3">
        <SkeletonSectionHeader />
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i}>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
            <SkeletonBadgeRow />
          </SkeletonCard>
        ))}
      </section>
    </div>
  );
}
