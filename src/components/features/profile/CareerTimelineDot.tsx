import { cn } from "@/lib/utils/cn";

interface CareerTimelineDotProps {
  isCurrent: boolean;
  isLast: boolean;
}

export function CareerTimelineDot({ isCurrent, isLast }: CareerTimelineDotProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-2.5 h-2.5 rounded-full mt-1 shrink-0",
          isCurrent ? "bg-primary" : "bg-muted-foreground/40"
        )}
      />
      {!isLast && <div className="w-0.5 flex-1 bg-border mt-1" />}
    </div>
  );
}
