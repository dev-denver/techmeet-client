"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

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
      aria-label="푸시 알림 토글"
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

type PushState = "unsupported" | "denied" | "subscribed" | "unsubscribed";

export function PushNotificationToggle() {
  const [state, setState] = useState<PushState>("unsubscribed");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      setIsLoading(false);
      return;
    }

    if (Notification.permission === "denied") {
      setState("denied");
      setIsLoading(false);
      return;
    }

    navigator.serviceWorker.ready
      .then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        setState(sub ? "subscribed" : "unsubscribed");
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleToggle(value: boolean) {
    if (value) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  }

  async function subscribe() {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setState("denied");
        return;
      }
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("VAPID 키 미설정");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!res.ok) throw new Error("서버 저장 실패");
      setState("subscribed");
    } catch {
      setState("unsubscribed");
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        setState("unsubscribed");
        return;
      }

      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      await subscription.unsubscribe();
      setState("unsubscribed");
    } catch {
      setState("unsubscribed");
    } finally {
      setIsLoading(false);
    }
  }

  if (state === "unsupported") {
    return (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium">푸시 알림</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            이 브라우저는 푸시 알림을 지원하지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium">푸시 알림</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {state === "denied"
            ? "브라우저 설정에서 알림 권한을 허용해주세요."
            : "새 프로젝트 및 신청 상태 변경을 브라우저 알림으로 받습니다."}
        </p>
      </div>
      <Toggle
        checked={state === "subscribed"}
        onChange={handleToggle}
        disabled={isLoading || state === "denied"}
      />
    </div>
  );
}
