"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-primary" : "bg-zinc-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: "new_project",
    label: "신규 프로젝트 알림",
    description: "새 프로젝트 등록 시 카카오 알림톡으로 알려드립니다.",
  },
  {
    id: "application_update",
    label: "신청 상태 변경 알림",
    description: "지원한 프로젝트의 상태가 변경될 때 알림을 받습니다.",
  },
  {
    id: "marketing",
    label: "마케팅 알림",
    description: "테크밋 이벤트 및 공지 알림을 받습니다.",
  },
];

export function NotificationSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    new_project: true,
    application_update: true,
    marketing: false,
  });

  const handleChange = (id: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-0">
      {notificationSettings.map((setting) => (
        <div
          key={setting.id}
          className="flex items-center justify-between p-4 border-b"
        >
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium">{setting.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {setting.description}
            </p>
          </div>
          <Toggle
            checked={settings[setting.id] ?? false}
            onChange={(val) => handleChange(setting.id, val)}
          />
        </div>
      ))}
    </div>
  );
}
