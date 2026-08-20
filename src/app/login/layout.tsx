import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "테크밋(TechMeet) 로그인 — 프리랜서 개발자를 위한 IT 프로젝트 매칭 플랫폼입니다. 카카오 계정 또는 이메일로 로그인하세요.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "테크밋",
    url: "/login",
    title: "로그인 | 테크밋",
    description:
      "테크밋(TechMeet) 로그인 — 프리랜서 개발자를 위한 IT 프로젝트 매칭 플랫폼입니다. 카카오 계정 또는 이메일로 로그인하세요.",
    images: ["/opengraph-image"],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
