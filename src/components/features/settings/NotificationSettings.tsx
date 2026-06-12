"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { settingsApi } from "@/lib/api/settings";
import { useToast } from "@/components/ui/toast";
import type { NotificationSettings as NotificationSettingsType } from "@/types";

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
  const [loadError, setLoadError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    settingsApi
      .getNotifications()
      .then(({ data }) => setSettings(data))
      .catch(() => setLoadError(true));
  }, []);

  async function handleChange(id: keyof NotificationSettingsType, value: boolean) {
    const prev = settings;
    setSettings((s) => ({ ...s, [id]: value }));
    setIsSaving(true);
    try {
      await settingsApi.updateNotifications({ [id]: value });
    } catch {
      setSettings(prev);
      showToast("설정 저장에 실패했습니다", "error");
    } finally {
      setIsSaving(false);
    }
  }

  if (loadError) {
    return (
      <p className="p-4 text-sm text-destructive">
        알림 설정을 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {notificationItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between px-4 py-3.5"
        >
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </p>
          </div>
          <Switch
            checked={settings[item.id]}
            onChange={(val) => handleChange(item.id, val)}
            disabled={isSaving}
            aria-label={item.label}
          />
        </div>
      ))}
    </div>
  );
}
