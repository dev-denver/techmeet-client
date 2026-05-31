import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-patterns";

export default function NotificationsLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-4 w-24" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-3 w-28 ml-11" />
        </SkeletonCard>
      ))}
    </div>
  );
}
