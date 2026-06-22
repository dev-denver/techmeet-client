import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/server";
import { LIMITS } from "@/lib/constants/limits";
import { validateLength } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  // requireAuth()는 인증 확인만 담당하므로, 이후 profiles 조회·수정에 별도 클라이언트 생성
  const supabase = await createServerClient();

  const body = await request.json() as { referrerNote?: unknown };
  const note = typeof body.referrerNote === "string" ? body.referrerNote.trim() : "";

  if (!note) {
    return NextResponse.json({ error: "추천인을 입력해주세요" }, { status: 400 });
  }

  const lengthError = validateLength(note, LIMITS.REFERRER_NOTE_MAX, "추천인");
  if (lengthError) {
    return NextResponse.json({ error: lengthError }, { status: 400 });
  }

  // 이미 추천인이 등록되어 있는지 확인
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("referrer_note")
    .eq("id", user.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "프로필 조회 중 오류가 발생했습니다" }, { status: 500 });
  }

  if (currentProfile?.referrer_note) {
    return NextResponse.json(
      { error: "이미 추천인이 등록되어 있습니다" },
      { status: 409 }
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ referrer_note: note })
    .eq("id", user.id);

  if (updateError) {
    console.error("[referrer POST]", updateError);
    return NextResponse.json({ error: "추천인 등록 중 오류가 발생했습니다" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
