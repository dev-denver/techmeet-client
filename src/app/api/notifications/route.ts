import { NextRequest, NextResponse } from "next/server";
import { requireAuth, parsePaginationParams } from "@/lib/api/server";
import { getAlimtalkLogs } from "@/lib/supabase/queries/notifications";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePaginationParams(searchParams, { pageSize: 20, maxPageSize: 50 });

    const result = await getAlimtalkLogs(page, pageSize);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "알림 내역을 불러오지 못했습니다" }, { status: 500 });
  }
}
