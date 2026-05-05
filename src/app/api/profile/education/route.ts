import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getEducations, addEducation } from "@/lib/supabase/queries/resume";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const data = await getEducations();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const body = await req.json();
  const { schoolName, degree, major, startDate, endDate, isGraduated } = body;

  if (!schoolName) return NextResponse.json({ error: "학교명은 필수입니다" }, { status: 400 });

  try {
    await addEducation({ schoolName, degree: degree ?? null, major: major ?? null, startDate: startDate ?? null, endDate: endDate ?? null, isGraduated: isGraduated ?? true });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
