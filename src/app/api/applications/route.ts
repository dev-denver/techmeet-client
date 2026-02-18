import { NextRequest, NextResponse } from "next/server";
import { getApplications, createApplication } from "@/lib/supabase/queries/applications";
import type { CreateApplicationRequest } from "@/types";

export async function GET() {
  try {
    const result = await getApplications();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "신청 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CreateApplicationRequest>;
    const { projectId, coverLetter, expectedRate } = body;

    if (
      typeof projectId !== "string" ||
      typeof coverLetter !== "string" ||
      typeof expectedRate !== "number"
    ) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }

    const result = await createApplication({ projectId, coverLetter, expectedRate });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "지원 신청에 실패했습니다" }, { status: 500 });
  }
}
