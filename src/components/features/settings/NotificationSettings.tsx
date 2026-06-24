"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { settingsApi } from "@/lib/api/settings";
import { useToast } from "@/components/ui/toast";
import type { NotificationSettings as NotificationSettingsType } from "@/types";

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    privacy_consent: false,
    sms_consent: false,
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

  async function handleChange(
    id: keyof NotificationSettingsType,
    value: boolean
  ) {
    const prev = settings;

    // 개인정보 수집 이용 동의를 해제하면 SMS 수신 동의도 함께 해제
    const next: NotificationSettingsType =
      id === "privacy_consent" && !value
        ? { ...settings, privacy_consent: false, sms_consent: false }
        : { ...settings, [id]: value };

    setSettings(next);
    setIsSaving(true);
    try {
      await settingsApi.updateNotifications(
        id === "privacy_consent" && !value
          ? { privacy_consent: false, sms_consent: false }
          : { [id]: value }
      );
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
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium">개인정보 수집 이용 동의</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            SMS 수신을 위해 개인정보 수집 이용에 동의합니다.
          </p>
        </div>
        <Switch
          checked={settings.privacy_consent}
          onChange={(val) => handleChange("privacy_consent", val)}
          disabled={isSaving}
          aria-label="개인정보 수집 이용 동의"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3.5 pl-8">
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium">SMS 수신 동의</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {settings.privacy_consent
              ? "SMS로 알림을 받습니다."
              : "개인정보 수집 이용 동의가 필요합니다."}
          </p>
        </div>
        <Switch
          checked={settings.sms_consent}
          onChange={(val) => handleChange("sms_consent", val)}
          disabled={isSaving || !settings.privacy_consent}
          aria-label="SMS 수신 동의"
        />
      </div>
    </div>
  );
}
