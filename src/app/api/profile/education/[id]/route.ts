import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { updateEducation, deleteEducation } from "@/lib/supabase/queries/resume";
import { UUID_REGEX } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import type { SaveEducationRequest } from "@/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
  }
  const body = (await req.json()) as Partial<SaveEducationRequest>;

  // 학교명 길이 검사
  let schoolName = body.schoolName;
  if (schoolName !== undefined) {
    const trimmed = String(schoolName).trim();
    if (!trimmed) return NextResponse.json({ error: "학교명을 입력해주세요" }, { status: 400 });
    if (trimmed.length > LIMITS.SCHOOL_MAX)
      return NextResponse.json({ error: `학교명은 ${LIMITS.SCHOOL_MAX}자 이하로 입력해주세요` }, { status: 400 });
    schoolName = trimmed;
  }

  // 날짜 역전 검사
  if (body.startDate && body.endDate && body.endDate <= body.startDate) {
    return NextResponse.json({ error: "졸업일(종료)은 입학일(시작)보다 이후여야 합니다" }, { status: 400 });
  }

  try {
    await updateEducation(id, {
      schoolName,
      degree: body.degree ?? null,
      major: body.major ?? null,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      isGraduated: body.isGraduated,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[학력 수정]", e);
    return NextResponse.json({ error: "학력 저장에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
  }

  try {
    await deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[학력 삭제]", e);
    return NextResponse.json({ error: "학력 삭제에 실패했습니다" }, { status: 500 });
  }
}
