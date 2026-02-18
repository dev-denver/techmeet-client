import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/supabase/queries/profile";
import type { UpdateProfileRequest } from "@/types";

export async function GET() {
  try {
    const result = await getProfile();

    if (!result) {
      return NextResponse.json({ error: "프로필을 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로필을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;
    await updateProfile(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "프로필 수정에 실패했습니다" }, { status: 500 });
  }
}
