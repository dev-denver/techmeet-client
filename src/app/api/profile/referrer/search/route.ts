import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { publicEnv, serverEnv } from "@/lib/config/env";
import { AccountStatus } from "@/types";

function maskPhone(phone: string): string {
  // 010-1234-5678 → 010-****-5678
  return phone.replace(/(\d{3})-(\d{3,4})-(\d{4})/, (_, p1, _p2, p3) => `${p1}-****-${p3}`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json(
      { error: "검색어는 2자 이상 입력해주세요" },
      { status: 400 }
    );
  }

  // 로그인 사용자면 본인 제외
  let currentUserId: string | null = null;
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;
  } catch {
    // 미로그인 상태 (회원가입 중) - 무시
  }

  const supabaseAdmin = createClient(
    publicEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  let query = supabaseAdmin
    .from("profiles")
    .select("id, name, phone")
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
    .not("account_status", "eq", AccountStatus.Withdrawn)
    .limit(10);

  if (currentUserId) {
    query = query.neq("id", currentUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[referrer/search]", error);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다" }, { status: 500 });
  }

  const results = (data ?? []).map((row: { id: string; name: string; phone: string | null }) => ({
    id: row.id,
    name: row.name,
    maskedPhone: row.phone ? maskPhone(row.phone) : "-",
  }));

  return NextResponse.json({ data: results });
}
