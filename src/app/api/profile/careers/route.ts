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

    await addCareer({ company, role, startDate, endDate: body.endDate, isCurrent, description, techStack });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "경력 추가에 실패했습니다" }, { status: 500 });
  }
}
