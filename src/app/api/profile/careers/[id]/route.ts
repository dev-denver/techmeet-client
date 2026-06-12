import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { updateCareer, deleteCareer } from "@/lib/supabase/queries/profile";
import { UUID_REGEX, validateLength, validateStringArray } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import type { UpdateCareerRequest } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }
    const body = (await request.json()) as UpdateCareerRequest;

    // 업무 설명·기술스택 검사
    if (typeof body.description === "string") {
      const descriptionError = validateLength(body.description, LIMITS.DESCRIPTION_MAX, "업무 설명");
      if (descriptionError) return NextResponse.json({ error: descriptionError }, { status: 400 });
    }
    if (body.techStack !== undefined) {
      const techError = validateStringArray(body.techStack, {
        itemMax: LIMITS.TECH_ITEM_MAX,
        countMax: LIMITS.TECH_COUNT_MAX,
        label: "기술스택",
      });
      if (techError) return NextResponse.json({ error: techError }, { status: 400 });
    }

    // 회사명·직무 길이 검사
    if (body.company !== undefined) {
      const trimmed = body.company.trim();
      if (!trimmed) return NextResponse.json({ error: "회사명을 입력해주세요" }, { status: 400 });
      if (trimmed.length > 100) return NextResponse.json({ error: "회사명은 100자 이하로 입력해주세요" }, { status: 400 });
      body.company = trimmed;
    }
    if (body.role !== undefined) {
      const trimmed = body.role.trim();
      if (!trimmed) return NextResponse.json({ error: "직무/역할을 입력해주세요" }, { status: 400 });
      if (trimmed.length > 100) return NextResponse.json({ error: "직무/역할은 100자 이하로 입력해주세요" }, { status: 400 });
      body.role = trimmed;
    }

    // 재직 중이 아닌 경우 날짜 역전 검사
    if (body.isCurrent === false && body.startDate && body.endDate) {
      if (body.endDate <= body.startDate) {
        return NextResponse.json({ error: "종료일은 시작일보다 이후여야 합니다" }, { status: 400 });
      }
    }

    await updateCareer(id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "경력 수정에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }
    await deleteCareer(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "경력 삭제에 실패했습니다" }, { status: 500 });
  }
}
