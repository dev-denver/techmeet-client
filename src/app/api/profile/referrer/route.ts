import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { AccountStatus } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = await request.json() as { referrerId?: unknown };
  const { referrerId } = body;

  if (typeof referrerId !== "string" || !referrerId) {
    return NextResponse.json({ error: "추천인 ID가 필요합니다" }, { status: 400 });
  }

  if (referrerId === user.id) {
    return NextResponse.json({ error: "본인을 추천인으로 지정할 수 없습니다" }, { status: 400 });
  }

  // 이미 추천인이 등록되어 있는지 확인
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("referrer_id")
    .eq("id", user.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "프로필 조회 중 오류가 발생했습니다" }, { status: 500 });
  }

  if (currentProfile?.referrer_id) {
    return NextResponse.json(
      { error: "이미 추천인이 등록되어 있습니다" },
      { status: 409 }
    );
  }

  // 추천인 존재 여부 확인
  const { data: referrerProfile, error: referrerError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", referrerId)
    .eq("account_status", AccountStatus.Active)
    .single();

  if (referrerError || !referrerProfile) {
    return NextResponse.json({ error: "존재하지 않는 추천인입니다" }, { status: 404 });
  }

  // 추천인 저장
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ referrer_id: referrerId })
    .eq("id", user.id);

  if (updateError) {
    console.error("[referrer POST]", updateError);
    return NextResponse.json({ error: "추천인 등록 중 오류가 발생했습니다" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
