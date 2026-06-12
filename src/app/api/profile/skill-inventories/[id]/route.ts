import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { updateSkillInventory, deleteSkillInventory } from "@/lib/supabase/queries/resume";
import { UUID_REGEX } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import { validateSkillInventoryBody } from "../validate";
import type { SaveSkillInventoryRequest } from "@/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
  }
  const body = (await req.json()) as Partial<SaveSkillInventoryRequest>;

  // 프로젝트명 길이 검사
  let projectName = body.projectName;
  if (projectName !== undefined) {
    const trimmed = String(projectName).trim();
    if (!trimmed) return NextResponse.json({ error: "프로젝트명을 입력해주세요" }, { status: 400 });
    if (trimmed.length > LIMITS.PROJECT_NAME_MAX)
      return NextResponse.json({ error: `프로젝트명은 ${LIMITS.PROJECT_NAME_MAX}자 이하로 입력해주세요` }, { status: 400 });
    projectName = trimmed;
  }

  const invalid = validateSkillInventoryBody(body);
  if (invalid) return invalid;

  try {
    await updateSkillInventory(id, {
      projectName,
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
    console.error("[스킬 인벤토리 수정]", e);
    return NextResponse.json({ error: "스킬 인벤토리 저장에 실패했습니다" }, { status: 500 });
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
    await deleteSkillInventory(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[스킬 인벤토리 삭제]", e);
    return NextResponse.json({ error: "스킬 인벤토리 삭제에 실패했습니다" }, { status: 500 });
  }
}
