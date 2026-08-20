import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { publicEnv } from "@/lib/config/env";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "테크밋";
const SITE_DESCRIPTION =
  "테크밋(TechMeet)은 프리랜서 개발자를 위한 IT 프로젝트 매칭 플랫폼입니다. 프로젝트 지원, 경력·기술 스택 관리, 카카오 알림톡 알림까지 한 곳에서 관리하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.appUrl),
  title: {
    default: "테크밋(TechMeet) | 프리랜서 개발자 프로젝트 매칭 플랫폼",
    template: "%s | 테크밋",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "테크밋",
    "techmeet",
    "TechMeet",
    "프리랜서 개발자",
    "IT 프리랜서",
    "개발자 프로젝트 매칭",
    "프리랜서 프로젝트",
    "IT 프로젝트 플랫폼",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: "(주)테크밋" }],
  creator: "(주)테크밋",
  publisher: "(주)테크밋",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE_NAME,
    title: "테크밋(TechMeet) | 프리랜서 개발자 프로젝트 매칭 플랫폼",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "테크밋(TechMeet) | 프리랜서 개발자 프로젝트 매칭 플랫폼",
    description: SITE_DESCRIPTION,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "테크밋",
  alternateName: ["TechMeet", "(주)테크밋"],
  url: publicEnv.appUrl,
  description: SITE_DESCRIPTION,
  email: "lawzone.corp@gmail.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${geistMono.variable} antialiased bg-page-bg`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
