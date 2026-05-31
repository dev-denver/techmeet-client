import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { updateEducation, deleteEducation } from "@/lib/supabase/queries/resume";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const body = await req.json();

  // 학교명 길이 검사
  if (body.schoolName !== undefined) {
    const trimmed = String(body.schoolName).trim();
    if (!trimmed) return NextResponse.json({ error: "학교명을 입력해주세요" }, { status: 400 });
    if (trimmed.length > 100) return NextResponse.json({ error: "학교명은 100자 이하로 입력해주세요" }, { status: 400 });
    body.schoolName = trimmed;
  }

  // 날짜 역전 검사
  if (body.startDate && body.endDate && body.endDate <= body.startDate) {
    return NextResponse.json({ error: "졸업일(종료)은 입학일(시작)보다 이후여야 합니다" }, { status: 400 });
  }

  try {
    await updateEducation(id, {
      schoolName: body.schoolName,
      degree: body.degree ?? null,
      major: body.major ?? null,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      isGraduated: body.isGraduated,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    await deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
