import { NextRequest, NextResponse } from "next/server";
import { parsePaginationParams } from "@/lib/api/server";
import { getNotices } from "@/lib/supabase/queries/notices";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, pageSize } = parsePaginationParams(searchParams, { pageSize: 10, maxPageSize: 50 });

    const result = await getNotices({ page, pageSize });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "공지사항을 불러오지 못했습니다" }, { status: 500 });
  }
}
