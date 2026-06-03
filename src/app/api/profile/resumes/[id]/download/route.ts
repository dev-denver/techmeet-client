import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const supabase = await createServerClient();

    const { data: row, error: fetchError } = await supabase
      .from("profile_resumes")
      .select("file_path, file_name")
      .eq("id", id)
      .eq("profile_id", user.id)
      .single();

    if (fetchError || !row) {
      return NextResponse.json({ error: "이력서를 찾을 수 없습니다" }, { status: 404 });
    }

    const { data: signedData, error: signError } = await supabase.storage
      .from("resumes")
      .createSignedUrl(row.file_path, 60);

    if (signError || !signedData) {
      return NextResponse.json({ error: "다운로드 링크 생성에 실패했습니다" }, { status: 500 });
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch {
    return NextResponse.json({ error: "다운로드에 실패했습니다" }, { status: 500 });
  }
}
