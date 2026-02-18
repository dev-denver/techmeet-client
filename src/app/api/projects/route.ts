import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/supabase/queries/projects";
import type { ProjectFilterValue } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = (searchParams.get("status") ?? "all") as ProjectFilterValue;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);

    const result = await getProjects({ status, page, pageSize });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로젝트 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}
