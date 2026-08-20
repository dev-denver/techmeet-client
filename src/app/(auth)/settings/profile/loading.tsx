import { Skeleton } from "@/components/ui/skeleton";

export default function EditProfileLoading() {
  return (
    <div className="p-4 pb-8 space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
