import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { addCareer } from "@/lib/supabase/queries/profile";
import { validateLength, validateStringArray } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import type { AddCareerRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as Partial<AddCareerRequest>;
    const { company, role, startDate, isCurrent, description, techStack } = body;

    if (
      typeof company !== "string" ||
      typeof role !== "string" ||
      typeof startDate !== "string" ||
      typeof isCurrent !== "boolean" ||
      typeof description !== "string" ||
      !Array.isArray(techStack)
    ) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }

    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();
    if (!trimmedCompany) return NextResponse.json({ error: "회사명을 입력해주세요" }, { status: 400 });
    if (trimmedCompany.length > LIMITS.COMPANY_MAX)
      return NextResponse.json({ error: `회사명은 ${LIMITS.COMPANY_MAX}자 이하로 입력해주세요` }, { status: 400 });
    if (!trimmedRole) return NextResponse.json({ error: "직무/역할을 입력해주세요" }, { status: 400 });
    if (trimmedRole.length > LIMITS.ROLE_MAX)
      return NextResponse.json({ error: `직무/역할은 ${LIMITS.ROLE_MAX}자 이하로 입력해주세요` }, { status: 400 });

    const descriptionError = validateLength(description, LIMITS.DESCRIPTION_MAX, "업무 설명");
    if (descriptionError) return NextResponse.json({ error: descriptionError }, { status: 400 });

    const techError = validateStringArray(techStack, {
      itemMax: LIMITS.TECH_ITEM_MAX,
      countMax: LIMITS.TECH_COUNT_MAX,
      label: "기술스택",
    });
    if (techError) return NextResponse.json({ error: techError }, { status: 400 });

    // 재직 중이 아닌 경우 종료일 필수 + 날짜 역전 검사
    if (!isCurrent) {
      if (!body.endDate) return NextResponse.json({ error: "종료일을 입력해주세요" }, { status: 400 });
      if (body.endDate <= startDate) return NextResponse.json({ error: "종료일은 시작일보다 이후여야 합니다" }, { status: 400 });
    }

    await addCareer({ company: trimmedCompany, role: trimmedRole, startDate, endDate: body.endDate, isCurrent, description, techStack });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "경력 추가에 실패했습니다" }, { status: 500 });
  }
}
