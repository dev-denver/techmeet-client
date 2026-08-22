import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/server";

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as { platform?: string; token?: string };
    if (body.platform !== "ios" && body.platform !== "android") {
      return NextResponse.json({ error: "platform 값이 올바르지 않습니다" }, { status: 400 });
    }
    if (!body.token) {
      return NextResponse.json({ error: "token이 필요합니다" }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { error } = await supabase
      .from("push_tokens")
      .upsert(
        { profile_id: user.id, platform: body.platform, token: body.token },
        { onConflict: "profile_id,token" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "푸시 토큰 등록에 실패했습니다" }, { status: 500 });
  }
}
