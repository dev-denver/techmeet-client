import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/config/env";

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: unknown; password?: unknown };
  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요" },
      { status: 400 }
    );
  }

  const supabaseResponse = NextResponse.json({ success: true });

  const supabase = createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2]);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
      { status: 401 }
    );
  }

  // 탈퇴 회원 체크
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (sessionUser) {
    const supabaseAdmin = createClient(
      publicEnv.supabaseUrl,
      serverEnv.supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("account_status")
      .eq("id", sessionUser.id)
      .single();

    if (profile?.account_status === "withdrawn") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "탈퇴한 계정입니다.", code: "withdrawn" },
        { status: 403 }
      );
    }
  }

  return supabaseResponse;
}
