"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ProjectStatus } from "@/types";
import type { ProjectFilterValue } from "@/types";

const filters: { value: ProjectFilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: ProjectStatus.Recruiting, label: "모집중" },
  { value: ProjectStatus.InProgress, label: "진행중" },
  { value: ProjectStatus.Completed, label: "완료" },
];

interface ProjectFiltersProps {
  onFilterChange: (value: ProjectFilterValue) => void;
}

export function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [active, setActive] = useState<ProjectFilterValue>("all");

  const handleChange = (value: ProjectFilterValue) => {
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
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
