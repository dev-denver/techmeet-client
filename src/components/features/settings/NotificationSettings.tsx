"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import type { NotificationSettings as NotificationSettingsType } from "@/types";

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
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

interface NotificationSettingItem {
  id: keyof NotificationSettingsType;
  label: string;
  description: string;
}

const notificationItems: NotificationSettingItem[] = [
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
  const [settings, setSettings] = useState<NotificationSettingsType>({
    new_project: true,
    application_update: true,
    marketing: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/notifications")
      .then((res) => res.json() as Promise<{ data: NotificationSettingsType }>)
      .then(({ data }) => setSettings(data))
      .catch(() => {});
  }, []);

  async function handleChange(id: keyof NotificationSettingsType, value: boolean) {
    const prev = settings;
    setSettings((s) => ({ ...s, [id]: value }));
    setIsSaving(true);
    try {
      await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [id]: value }),
      });
    } catch {
      setSettings(prev);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-0">
      {notificationItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 border-b"
        >
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </p>
          </div>
          <Toggle
            checked={settings[item.id]}
            onChange={(val) => handleChange(item.id, val)}
            disabled={isSaving}
          />
        </div>
      ))}
    </div>
  );
}
