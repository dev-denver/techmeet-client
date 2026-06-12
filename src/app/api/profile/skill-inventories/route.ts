import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { getSkillInventories, addSkillInventory } from "@/lib/supabase/queries/resume";
import { LIMITS } from "@/lib/constants/limits";
import { validateSkillInventoryBody } from "./validate";
import type { SaveSkillInventoryRequest } from "@/types";

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const data = await getSkillInventories();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = (await req.json()) as Partial<SaveSkillInventoryRequest>;

  if (!body.projectName || typeof body.projectName !== "string" || !body.projectName.trim()) {
    return NextResponse.json({ error: "프로젝트명은 필수입니다" }, { status: 400 });
  }
  if (body.projectName.trim().length > LIMITS.PROJECT_NAME_MAX) {
    return NextResponse.json({ error: `프로젝트명은 ${LIMITS.PROJECT_NAME_MAX}자 이하로 입력해주세요` }, { status: 400 });
  }

  const invalid = validateSkillInventoryBody(body);
  if (invalid) return invalid;

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
    console.error("[스킬 인벤토리 추가]", e);
    return NextResponse.json({ error: "스킬 인벤토리 저장에 실패했습니다" }, { status: 500 });
  }
}
