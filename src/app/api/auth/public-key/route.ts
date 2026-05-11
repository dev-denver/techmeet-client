import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/config/env";

export async function GET() {
  try {
    // Vercel 등 일부 환경에서 env 값에 따옴표가 포함될 수 있어 제거
    const rawKey = serverEnv.authRsaPublicKey.replace(/^["']|["']$/g, "").trim();
    // 모든 줄바꿈 표현 방식 정규화 (literal \n, \r\n, 실제 개행 등)
    const normalized = rawKey
      .replace(/\\r\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    // PEM 헤더/푸터 제거 후 순수 base64만 추출
    const publicKey = normalized
      .split("\n")
      .filter(line => !line.startsWith("-----") && line.trim() !== "")
      .join("");
    return NextResponse.json({ publicKey });
  } catch (error) {
    console.error("[public-key] 공개키 조회 실패:", error);
    return NextResponse.json({ error: "서버 설정 오류가 발생했습니다" }, { status: 500 });
  }
}
