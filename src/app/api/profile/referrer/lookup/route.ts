import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/config/env";
import { AccountStatus } from "@/types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})-(\d{3,4})-(\d{4})/, (_, p1, _p2, p3) => `${p1}-****-${p3}`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";

  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "유효하지 않은 ID입니다" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    publicEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

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
