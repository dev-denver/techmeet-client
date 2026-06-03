import { NextRequest, NextResponse } from "next/server";
import { parsePaginationParams } from "@/lib/api/server";
import { getProjects } from "@/lib/supabase/queries/projects";
import type { ProjectFilterValue } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = (searchParams.get("status") ?? "all") as ProjectFilterValue;
    const { page, pageSize } = parsePaginationParams(searchParams, { maxPageSize: 100 });
    const search = searchParams.get("search") ?? undefined;

    const result = await getProjects({ status, page, pageSize, search });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로젝트 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}
