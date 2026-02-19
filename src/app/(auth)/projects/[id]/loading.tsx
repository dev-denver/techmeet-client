import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="pb-6">
      {/* 헤더 */}
      <div className="p-4 space-y-3 border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* 기본 정보 */}
      <div className="p-4 space-y-3 border-b">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="p-4 space-y-3 border-b">
        <Skeleton className="h-5 w-20" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div className="p-4 space-y-3 border-b">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* 자격 요건 */}
      <div className="p-4 space-y-3 border-b">
        <Skeleton className="h-5 w-20" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* 버튼 */}
      <div className="p-4">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
