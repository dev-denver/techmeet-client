import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { getEducations, addEducation } from "@/lib/supabase/queries/resume";

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const data = await getEducations();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = await req.json();
  const { schoolName, degree, major, startDate, endDate, isGraduated } = body;

  if (!schoolName || typeof schoolName !== "string" || !schoolName.trim()) {
    return NextResponse.json({ error: "학교명은 필수입니다" }, { status: 400 });
  }
  if (schoolName.trim().length > 100) {
    return NextResponse.json({ error: "학교명은 100자 이하로 입력해주세요" }, { status: 400 });
  }

  // 날짜 역전 검사
  if (startDate && endDate && endDate <= startDate) {
    return NextResponse.json({ error: "졸업일(종료)은 입학일(시작)보다 이후여야 합니다" }, { status: 400 });
  }

  try {
    await addEducation({ schoolName: schoolName.trim(), degree: degree ?? null, major: major ?? null, startDate: startDate ?? null, endDate: endDate ?? null, isGraduated: isGraduated ?? true });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
