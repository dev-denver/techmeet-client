import { Skeleton } from "@/components/ui/skeleton";

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
        <div key={i} className="p-4 border rounded-xl space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-1.5">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-5 w-12 rounded-full" />
            ))}
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
