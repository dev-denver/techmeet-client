import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/supabase/queries/projects";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await getProjectById(id);

    if (!result) {
      return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로젝트를 불러오지 못했습니다" }, { status: 500 });
  }
}
