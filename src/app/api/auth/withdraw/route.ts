import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { AccountStatus } from "@/types";

export async function POST() {
  try {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

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
