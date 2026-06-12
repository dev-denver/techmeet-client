import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createAdminClient } from "@/lib/supabase/server";
import { decryptPassword } from "@/lib/crypto/rsa";
import { validatePassword } from "@/lib/utils/validation";
import type { ChangePasswordRequest } from "@/types";

export async function PUT(request: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as Partial<ChangePasswordRequest>;
    const { encryptedCurrentPassword, encryptedNewPassword } = body;

    if (typeof encryptedCurrentPassword !== "string" || typeof encryptedNewPassword !== "string") {
      return NextResponse.json({ error: "비밀번호를 입력해주세요" }, { status: 400 });
    }

    let currentPassword: string;
    let newPassword: string;
    try {
      currentPassword = decryptPassword(encryptedCurrentPassword);
      newPassword = decryptPassword(encryptedNewPassword);
    } catch {
      return NextResponse.json({ error: "비밀번호 처리에 실패했습니다" }, { status: 400 });
    }

    const { valid, errors } = validatePassword(newPassword);
    if (!valid) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "계정 정보를 확인할 수 없습니다" }, { status: 400 });
    }

    // persistSession: false인 admin 클라이언트로 검증·변경하여 현재 세션에 영향을 주지 않음
    const supabaseAdmin = createAdminClient();

    const { error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다" }, { status: 401 });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      console.error("[비밀번호 변경] 업데이트 실패:", updateError);
      return NextResponse.json({ error: "비밀번호 변경에 실패했습니다" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "비밀번호 변경 중 오류가 발생했습니다" }, { status: 500 });
  }
}
