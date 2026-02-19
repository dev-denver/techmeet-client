import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="pb-4">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* 투입 가능 상태 */}
      <div className="p-4 border-b space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="flex-1 h-9 rounded-lg" />
          ))}
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="p-4 border-b space-y-3">
        <Skeleton className="h-5 w-20" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>

      {/* 경력 */}
      <div className="p-4 border-b space-y-4">
        <Skeleton className="h-5 w-12" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="w-0.5 flex-1 mt-1" />
            </div>
            <div className="flex-1 space-y-1.5 pb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 자기 소개 */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
