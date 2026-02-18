"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { AvailabilityStatus } from "@/types";

const options: { value: AvailabilityStatus; label: string; className: string }[] = [
  {
    value: "available",
    label: "투입 가능",
    className: "bg-green-500 text-white",
  },
  {
    value: "partial",
    label: "일부 가능",
    className: "bg-yellow-400 text-yellow-900",
  },
  {
    value: "unavailable",
    label: "투입 불가",
    className: "bg-red-500 text-white",
  },
];

interface AvailabilityToggleProps {
  initialStatus: AvailabilityStatus;
}

export function AvailabilityToggle({ initialStatus }: AvailabilityToggleProps) {
  const [status, setStatus] = useState<AvailabilityStatus>(initialStatus);

  return (
    <div className="p-4 border-b space-y-3">
      <h3 className="font-semibold text-sm">투입 가능 상태</h3>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
              status === option.value
                ? option.className
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        * 투입 상태는 담당 매니저에게 공유됩니다.
      </p>
    </div>
  );
}
