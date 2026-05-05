import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { updateCareer, deleteCareer } from "@/lib/supabase/queries/profile";
import type { UpdateCareerRequest } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateCareerRequest;

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
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    await deleteCareer(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "경력 삭제에 실패했습니다" }, { status: 500 });
  }
}
