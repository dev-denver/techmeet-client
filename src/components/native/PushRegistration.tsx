"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { pushApi } from "@/lib/api/push";

/**
 * 로그인된 사용자에게만 의미가 있어 (auth) 레이아웃에서만 마운트한다.
 * 발송 트리거/비즈니스 로직은 범위 밖 — 디바이스 토큰을 서버에 저장하기까지만 담당.
 */
export function PushRegistration() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const registrationHandler = PushNotifications.addListener("registration", (token) => {
      void pushApi.register({
        platform: Capacitor.getPlatform() as "ios" | "android",
        token: token.value,
      });
    });

    void (async () => {
      const permission = await PushNotifications.checkPermissions();
      if (permission.receive !== "granted") {
        const requested = await PushNotifications.requestPermissions();
        if (requested.receive !== "granted") return;
      }
      await PushNotifications.register();
    })();

    return () => {
      registrationHandler.then((handler) => handler.remove());
    };
  }, []);

  return null;
}
