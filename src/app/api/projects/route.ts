import { NextRequest, NextResponse } from "next/server";
import { parsePaginationParams } from "@/lib/api/server";
import { getProjects } from "@/lib/supabase/queries/projects";
import { LIMITS } from "@/lib/constants/limits";
import type { ProjectFilterValue } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = (searchParams.get("status") ?? "all") as ProjectFilterValue;
    const { page, pageSize } = parsePaginationParams(searchParams, { maxPageSize: 100 });
    // 검색어 길이 상한 — 과도한 입력으로 인한 비정상 쿼리 방지
    const search = searchParams.get("search")?.slice(0, LIMITS.SEARCH_MAX) || undefined;

    const result = await getProjects({ status, page, pageSize, search });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로젝트 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}
