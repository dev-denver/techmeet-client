import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { updateSkillInventory, deleteSkillInventory } from "@/lib/supabase/queries/resume";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

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
