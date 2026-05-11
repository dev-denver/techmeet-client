import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/config/env";

export async function GET() {
  try {
    const rawKey = serverEnv.authRsaPublicKey;
    const publicKey = rawKey
      .replace(/\\r\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\n/g, "\n");
    return NextResponse.json({ publicKey });
  } catch (error) {
    console.error("[public-key] 공개키 조회 실패:", error);
    return NextResponse.json({ error: "서버 설정 오류가 발생했습니다" }, { status: 500 });
  }
}
