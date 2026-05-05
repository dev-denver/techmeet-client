import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { updateSkillInventory, deleteSkillInventory } from "@/lib/supabase/queries/resume";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // 프로젝트명 길이 검사
  if (body.projectName !== undefined) {
    const trimmed = String(body.projectName).trim();
    if (!trimmed) return NextResponse.json({ error: "프로젝트명을 입력해주세요" }, { status: 400 });
    if (trimmed.length > 100) return NextResponse.json({ error: "프로젝트명은 100자 이하로 입력해주세요" }, { status: 400 });
    body.projectName = trimmed;
  }

  // 날짜 역전 검사
  if (body.startDate && body.endDate && body.endDate <= body.startDate) {
    return NextResponse.json({ error: "종료일은 시작일보다 이후여야 합니다" }, { status: 400 });
  }

  try {
    await updateSkillInventory(id, {
      projectName: body.projectName,
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

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const { id } = await params;

  try {
    await deleteSkillInventory(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
