import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/config/env";

export async function GET() {
  return NextResponse.json({
    publicKey: serverEnv.authRsaPublicKey.replace(/\\n/g, "\n"),
  });
}
