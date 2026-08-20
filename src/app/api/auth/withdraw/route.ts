import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/server";
import { decryptPassword } from "@/lib/crypto/rsa";
import { AccountStatus } from "@/types";
import type { WithdrawRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as Partial<WithdrawRequest>;
    if (typeof body.encryptedPassword !== "string") {
      return NextResponse.json({ error: "비밀번호를 입력해주세요" }, { status: 400 });
    }

    let password: string;
    try {
      password = decryptPassword(body.encryptedPassword);
    } catch {
      return NextResponse.json({ error: "비밀번호 처리에 실패했습니다" }, { status: 400 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "계정 정보를 확인할 수 없습니다" }, { status: 400 });
    }

    // persistSession: false인 admin 클라이언트로 검증하여 현재 세션에 영향을 주지 않음
    const supabaseAdmin = createAdminClient();
    const { error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (verifyError) {
      return NextResponse.json({ error: "비밀번호가 올바르지 않습니다" }, { status: 401 });
    }

    // requireAuth()는 인증 확인만 담당하므로, 이후 DB 작업을 위해 별도 클라이언트 생성
    const supabase = await createServerClient();

    // 소프트 탈퇴: profiles 테이블의 account_status를 'withdrawn'으로 변경
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        account_status: AccountStatus.Withdrawn,
        withdrawn_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("[회원탈퇴] profiles 업데이트 실패:", profileError);
      return NextResponse.json({ error: "탈퇴 처리에 실패했습니다" }, { status: 500 });
    }

    // 세션 종료
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "탈퇴 처리 중 오류가 발생했습니다" }, { status: 500 });
  }
}
