import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/config/env";

export async function GET() {
  try {
    return NextResponse.json({
      publicKey: serverEnv.authRsaPublicKey.replace(/\\n/g, "\n"),
    });
  } catch (error) {
    console.error("[public-key] 공개키 조회 실패:", error);
    return NextResponse.json({ error: "서버 설정 오류가 발생했습니다" }, { status: 500 });
  }
}
