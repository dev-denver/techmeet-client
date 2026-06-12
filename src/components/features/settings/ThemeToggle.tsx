"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium">다크 모드</p>
        <p className="text-xs text-muted-foreground mt-0.5">화면을 어둡게 표시합니다</p>
      </div>
      <Switch checked={theme === "dark"} onChange={toggleTheme} aria-label="다크 모드" />
    </div>
  );
}
