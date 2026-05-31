import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { UUID_REGEX } from "@/lib/utils/validation";
import { maskPhone } from "@/lib/utils/format";
import { AccountStatus } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";

  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, phone")
    .eq("id", id)
    .neq("account_status", AccountStatus.Withdrawn)
    .maybeSingle();

  if (error) {
    console.error("[referrer/lookup]", error);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "존재하지 않는 사용자입니다" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: data.id,
      name: data.name,
      maskedPhone: data.phone ? maskPhone(data.phone) : "-",
    },
  });
}
