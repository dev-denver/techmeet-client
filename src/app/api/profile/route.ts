import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/supabase/queries/profile";
import { validatePhone, validateBirthDate } from "@/lib/utils/validation";
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

    // 이름: 필수, 1-50자
    if (body.name !== undefined) {
      const trimmed = body.name.trim();
      if (!trimmed) return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
      if (trimmed.length > 50) return NextResponse.json({ error: "이름은 50자 이하로 입력해주세요" }, { status: 400 });
      body.name = trimmed;
    }

    // 휴대폰: 형식 검사
    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json({ error: "올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)" }, { status: 400 });
    }

    // 생년월일: 과거 날짜만 허용
    if (body.birthDate && !validateBirthDate(body.birthDate)) {
      return NextResponse.json({ error: "올바른 생년월일을 입력해주세요" }, { status: 400 });
    }

    // 경력 개월: 0-11 범위
    if (body.experienceMonths !== undefined && (body.experienceMonths < 0 || body.experienceMonths > 11)) {
      return NextResponse.json({ error: "경력 개월 수는 0~11 사이여야 합니다" }, { status: 400 });
    }

    // 성별: 허용값만
    if (body.gender !== undefined && body.gender !== null && body.gender !== "male" && body.gender !== "female") {
      return NextResponse.json({ error: "올바른 성별 값이 아닙니다" }, { status: 400 });
    }

    await updateProfile(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "프로필 수정에 실패했습니다" }, { status: 500 });
  }
}
