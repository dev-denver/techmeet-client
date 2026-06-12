import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { maskPhone } from "@/lib/utils/format";
import { LIMITS } from "@/lib/constants/limits";
import { AccountStatus } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // PostgREST or() 필터에 보간되므로 구분자로 쓰이는 특수문자(쉼표·괄호)는 제거
  const q = (searchParams.get("q")?.trim() ?? "").replace(/[,()]/g, "");

  if (q.length < 2) {
    return NextResponse.json(
      { error: "검색어는 2자 이상 입력해주세요" },
      { status: 400 }
    );
  }
  if (q.length > LIMITS.SEARCH_MAX) {
    return NextResponse.json(
      { error: `검색어는 ${LIMITS.SEARCH_MAX}자 이하로 입력해주세요` },
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

  const supabaseAdmin = createAdminClient();

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
