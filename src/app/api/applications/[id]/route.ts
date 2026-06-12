import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { withdrawApplication } from "@/lib/supabase/queries/applications";
import { UUID_REGEX } from "@/lib/utils/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }
    await withdrawApplication(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "신청 취소에 실패했습니다" }, { status: 500 });
  }
}
