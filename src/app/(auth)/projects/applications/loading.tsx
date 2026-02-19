import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-4 w-24" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
