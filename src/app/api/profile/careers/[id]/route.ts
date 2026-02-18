import { NextRequest, NextResponse } from "next/server";
import { updateCareer, deleteCareer } from "@/lib/supabase/queries/profile";
import type { UpdateCareerRequest } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateCareerRequest;
    await updateCareer(id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "경력 수정에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await deleteCareer(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "경력 삭제에 실패했습니다" }, { status: 500 });
  }
}
