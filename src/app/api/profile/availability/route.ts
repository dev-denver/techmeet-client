import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { updateAvailability } from "@/lib/supabase/queries/profile";
import { AvailabilityStatus } from "@/types";

const validStatuses = new Set<string>(Object.values(AvailabilityStatus));

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json() as { status?: string; availableFromDate?: string | null };

    if (!body.status) {
      return NextResponse.json({ error: "상태값이 필요합니다" }, { status: 400 });
    }

    if (!validStatuses.has(body.status)) {
      return NextResponse.json({ error: "올바르지 않은 상태값입니다" }, { status: 400 });
    }

    const status = body.status as AvailabilityStatus;
    const availableFromDate = body.availableFromDate ?? null;

    await updateAvailability({ status, availableFromDate });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "가용 상태 변경에 실패했습니다" }, { status: 500 });
  }
}
