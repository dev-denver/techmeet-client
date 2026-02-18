import { NextRequest, NextResponse } from "next/server";
import { withdrawApplication } from "@/lib/supabase/queries/applications";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await withdrawApplication(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "신청 취소에 실패했습니다" }, { status: 500 });
  }
}
