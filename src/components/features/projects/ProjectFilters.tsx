"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types";

type FilterValue = "all" | ProjectStatus;

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "recruiting", label: "모집중" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
];

interface ProjectFiltersProps {
  onFilterChange: (value: FilterValue) => void;
}

export function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [active, setActive] = useState<FilterValue>("all");

  const handleChange = (value: FilterValue) => {
    setActive(value);
    onFilterChange(value);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            active === value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
