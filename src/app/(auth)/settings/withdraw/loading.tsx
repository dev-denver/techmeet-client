import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center gap-3 pt-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-lg" />
      <Skeleton className="h-5 w-64" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
