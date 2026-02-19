"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import type { AvailabilityStatus } from "@/types";

const options = (Object.entries(AVAILABILITY_TOGGLE_CONFIG) as [AvailabilityStatus, { label: string; className: string }][]).map(
  ([value, config]) => ({ value, ...config })
);

interface AvailabilityToggleProps {
  initialStatus: AvailabilityStatus;
}

export function AvailabilityToggle({ initialStatus }: AvailabilityToggleProps) {
  const [status, setStatus] = useState<AvailabilityStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(newStatus: AvailabilityStatus) {
    if (newStatus === status || isUpdating) return;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      await fetch("/api/profile/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      setStatus(status);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="p-4 border-b space-y-3">
      <h3 className="font-semibold text-sm">투입 가능 상태</h3>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value)}
            disabled={isUpdating}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
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
