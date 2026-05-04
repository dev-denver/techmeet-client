import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAlimtalkLogs } from "@/lib/supabase/queries/notifications";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));

    const result = await getAlimtalkLogs(page, pageSize);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "알림 내역을 불러오지 못했습니다" }, { status: 500 });
  }
}
