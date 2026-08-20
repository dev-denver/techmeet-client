import { ImageResponse } from "next/og";

export const alt = "테크밋 | 프리랜서 개발자 프로젝트 매칭 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          backgroundColor: "#18181b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 32,
            backgroundColor: "#fafafa",
            color: "#18181b",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          T
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>테크밋 TechMeet</div>
        <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa" }}>
          프리랜서 개발자를 위한 프로젝트 매칭 플랫폼
        </div>
      </div>
    ),
    { ...size }
  );
}
