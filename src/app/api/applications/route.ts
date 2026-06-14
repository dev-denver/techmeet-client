import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { getApplications, createApplication, DuplicateApplicationError } from "@/lib/supabase/queries/applications";
import { getProjectById } from "@/lib/supabase/queries/projects";
import { getDeadlineDays } from "@/lib/utils/format";
import { UUID_REGEX } from "@/lib/utils/validation";
import { ProjectStatus } from "@/types";
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
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = (await request.json()) as Partial<CreateApplicationRequest>;
    const { projectId, note, expectedRate } = body;

    if (
      typeof projectId !== "string" ||
      typeof note !== "string" ||
      typeof expectedRate !== "number"
    ) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }

    if (!UUID_REGEX.test(projectId)) {
      return NextResponse.json({ error: "올바르지 않은 프로젝트입니다" }, { status: 400 });
    }

    // 참고사항: 필수 입력, 최대 1000자
    const trimmedNote = note.trim();
    if (!trimmedNote) {
      return NextResponse.json({ error: "참고사항을 입력해주세요" }, { status: 400 });
    }
    if (trimmedNote.length > 1000) {
      return NextResponse.json({ error: "참고사항은 1000자 이하로 입력해주세요" }, { status: 400 });
    }

    // 희망 단가: 1~9999만원 범위
    if (!Number.isInteger(expectedRate) || expectedRate < 1 || expectedRate > 9999) {
      return NextResponse.json({ error: "희망 단가는 1~9999만원 사이로 입력해주세요" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "존재하지 않는 프로젝트입니다" }, { status: 404 });
    }

    const { status, deadline } = project.data;
    if (status !== ProjectStatus.Recruiting) {
      return NextResponse.json({ error: "모집이 종료된 프로젝트입니다" }, { status: 400 });
    }
    if (deadline && getDeadlineDays(deadline) === null) {
      return NextResponse.json({ error: "지원이 마감된 프로젝트입니다" }, { status: 400 });
    }

    const result = await createApplication({ projectId, note: trimmedNote, expectedRate });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateApplicationError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "지원 신청에 실패했습니다" }, { status: 500 });
  }
}
