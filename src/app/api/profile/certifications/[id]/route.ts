import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { deleteCertification } from "@/lib/supabase/queries/resume";
import { UUID_REGEX } from "@/lib/utils/validation";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
  }

  try {
    await deleteCertification(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[자격증 삭제]", e);
    return NextResponse.json({ error: "자격증 삭제에 실패했습니다" }, { status: 500 });
  }
}
