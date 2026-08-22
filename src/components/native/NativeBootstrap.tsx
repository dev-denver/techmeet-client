"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";

/**
 * Capacitor 네이티브 셸 초기화. 웹 배포에서는 Capacitor.isNativePlatform()이
 * false라 아무 동작도 하지 않는다.
 */
export function NativeBootstrap() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });
    SplashScreen.hide();

    // Android 하드웨어 뒤로가기: 웹뷰 히스토리가 남아있으면 뒤로, 없으면 앱 종료
    const backHandlerPromise = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.exitApp();
    });

    return () => {
      backHandlerPromise.then((handler) => handler.remove());
    };
  }, []);

  return null;
}
