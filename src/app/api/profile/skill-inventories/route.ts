import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getSkillInventories, addSkillInventory } from "@/lib/supabase/queries/resume";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const data = await getSkillInventories();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const body = await req.json();
  if (!body.projectName) return NextResponse.json({ error: "프로젝트명은 필수입니다" }, { status: 400 });

  try {
    await addSkillInventory({
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
