import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="pb-4">
      {/* 계정 */}
      <div className="p-4 border-b">
        <Skeleton className="h-4 w-12 mb-3" />
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="p-4 pb-0 border-b">
        <Skeleton className="h-4 w-20 mb-3" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b">
          <div className="space-y-1 flex-1 pr-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full shrink-0" />
        </div>
      ))}

      {/* 앱 정보 */}
      <div className="p-4 border-b">
        <Skeleton className="h-4 w-16 mb-3" />
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="p-4">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
