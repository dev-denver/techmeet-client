import { Skeleton } from "@/components/ui/skeleton";

export default function NoticesLoading() {
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <Skeleton className="h-4 w-20" />
      <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
