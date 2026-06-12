import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createServerClient } from "@/lib/supabase/server";
import { deleteProfileResume } from "@/lib/supabase/queries/profile";
import { UUID_REGEX } from "@/lib/utils/validation";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }

    const filePath = await deleteProfileResume(id, user.id);

    const supabase = await createServerClient();
    await supabase.storage.from("resumes").remove([filePath]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "이력서 삭제에 실패했습니다" }, { status: 500 });
  }
}
