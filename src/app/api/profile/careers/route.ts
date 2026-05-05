import { NextRequest, NextResponse } from "next/server";
import { addCareer } from "@/lib/supabase/queries/profile";
import type { AddCareerRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
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
    if (trimmedCompany.length > 100) return NextResponse.json({ error: "회사명은 100자 이하로 입력해주세요" }, { status: 400 });
    if (!trimmedRole) return NextResponse.json({ error: "직무/역할을 입력해주세요" }, { status: 400 });
    if (trimmedRole.length > 100) return NextResponse.json({ error: "직무/역할은 100자 이하로 입력해주세요" }, { status: 400 });

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
