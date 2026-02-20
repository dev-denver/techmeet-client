import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withdrawApplication } from "@/lib/supabase/queries/applications";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    await withdrawApplication(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "신청 취소에 실패했습니다" }, { status: 500 });
  }
}
