import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { getSkillInventories, addSkillInventory } from "@/lib/supabase/queries/resume";

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const data = await getSkillInventories();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = await req.json();

  if (!body.projectName || typeof body.projectName !== "string" || !body.projectName.trim()) {
    return NextResponse.json({ error: "프로젝트명은 필수입니다" }, { status: 400 });
  }
  if (body.projectName.trim().length > 100) {
    return NextResponse.json({ error: "프로젝트명은 100자 이하로 입력해주세요" }, { status: 400 });
  }

  // 날짜 역전 검사
  if (body.startDate && body.endDate && body.endDate <= body.startDate) {
    return NextResponse.json({ error: "종료일은 시작일보다 이후여야 합니다" }, { status: 400 });
  }

  try {
    await addSkillInventory({
      projectName: body.projectName.trim(),
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      client: body.client ?? null,
      company: body.company ?? null,
      industry: body.industry ?? null,
      application: body.application ?? null,
      role: body.role ?? null,
      hardwareType: body.hardwareType ?? null,
      os: body.os ?? null,
      languages: body.languages ?? [],
      dbms: body.dbms ?? null,
      tools: body.tools ?? [],
      others: body.others ?? null,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
