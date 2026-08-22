import type { CapacitorConfig } from "@capacitor/cli";

const isStaging = process.env.CAPACITOR_TARGET === "staging";

const config: CapacitorConfig = {
  appId: "app.techmeet.client",
  appName: "테크밋",
  webDir: "capacitor/www",
  server: {
    url: isStaging
      ? "https://<staging 도메인>"
      : "https://www.techmeet.kr",
    cleartext: false,
    // 카카오 로그인(kauth.kakao.com)이 앱 웹뷰를 벗어나지 않고 완료되도록 허용.
    // 실기기 테스트에서 로그인이 끝까지 정상 동작하지 않으면 이 옵션을 제거하고
    // 시스템 브라우저 + 딥링크 방식(계획 문서 Plan B)으로 전환할 것.
    allowNavigation: ["kauth.kakao.com", "accounts.kakao.com", "*.kakao.com"],
  },
  ios: {
    contentInset: "always",
  },
};

export default config;
