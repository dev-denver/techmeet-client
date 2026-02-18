import { NextRequest, NextResponse } from "next/server";
import { updateAvailability } from "@/lib/supabase/queries/profile";
import type { UpdateAvailabilityRequest } from "@/types";

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<UpdateAvailabilityRequest>;

    if (!body.status) {
      return NextResponse.json({ error: "상태값이 필요합니다" }, { status: 400 });
    }

    await updateAvailability({ status: body.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "가용 상태 변경에 실패했습니다" }, { status: 500 });
  }
}
