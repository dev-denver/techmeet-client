import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { validatePassword, validatePhone, validateBirthDate } from "@/lib/utils/validation";
import { type CookieOptions } from "@supabase/ssr";
import { publicEnv, serverEnv } from "@/lib/config/env";
import { AccountStatus } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    email?: unknown;
    password?: unknown;
    name?: unknown;
    birth_date?: unknown;
    phone?: unknown;
    kakaoId?: unknown;
    reactivate?: unknown;
    referrer_id?: unknown;
  };

  const { email, password, name, birth_date, phone, kakaoId } = body;
  const referrerId = typeof body.referrer_id === "string" && body.referrer_id ? body.referrer_id : null;
  const agreeMarketing = typeof (body as { agree_marketing?: unknown }).agree_marketing === "boolean"
    ? (body as { agree_marketing: boolean }).agree_marketing
    : false;
  const reactivate = body.reactivate === true;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof birth_date !== "string" ||
    typeof phone !== "string"
  ) {
    return NextResponse.json(
      { error: "모든 필드를 올바르게 입력해주세요" },
      { status: 400 }
    );
  }

  const { valid: passwordValid, errors: passwordErrors } = validatePassword(password);
  if (!passwordValid) {
    return NextResponse.json({ error: passwordErrors[0] }, { status: 400 });
  }

  if (!validatePhone(phone)) {
    return NextResponse.json(
      { error: "올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)" },
      { status: 400 }
    );
  }

  if (!validateBirthDate(birth_date)) {
    return NextResponse.json(
      { error: "올바른 생년월일을 입력해주세요" },
      { status: 400 }
    );
  }

  const supabaseResponse = NextResponse.json({ success: true }, { status: 201 });

  const supabase = createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name: cookieName, value, options }) => {
            supabaseResponse.cookies.set(cookieName, value, options as Parameters<typeof supabaseResponse.cookies.set>[2]);
          });
        },
      },
    }
  );

  if (reactivate) {
    const supabaseAdmin = createClient(
      publicEnv.supabaseUrl,
      serverEnv.supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, account_status")
      .eq("email", email)
      .single();

    if (!existingProfile || existingProfile.account_status !== AccountStatus.Withdrawn) {
      return NextResponse.json({ error: "재가입할 수 없는 계정입니다." }, { status: 400 });
    }

    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      existingProfile.id,
      {
        password: password as string,
        ban_duration: "none",
        user_metadata: { name, phone, birth_date },
      }
    );

    if (updateAuthError) {
      console.error("[재가입] auth user 복원 실패:", updateAuthError);
      return NextResponse.json({ error: "재가입 처리에 실패했습니다." }, { status: 500 });
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        account_status: AccountStatus.Active,
        withdrawn_at: null,
        phone,
        kakao_id: typeof kakaoId === "string" && kakaoId ? kakaoId : null,
        notification_marketing: agreeMarketing,
      })
      .eq("id", existingProfile.id);

    if (profileError) {
      console.error("[재가입] profiles 복원 실패:", profileError);
      return NextResponse.json({ error: "프로필 복원에 실패했습니다." }, { status: 500 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (signInError) {
      console.error("[재가입] 로그인 실패:", signInError);
      return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 500 });
    }

    return supabaseResponse;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, birth_date },
    },
  });

  if (error) {
    if (error.status === 422 || error.message.includes("already registered")) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
    }
    return NextResponse.json({ error: "회원가입에 실패했습니다" }, { status: 500 });
  }

  // 추가 프로필 필드 업데이트 (phone, kakao_id)
  // signUp 직후 세션이 없을 수 있으므로 RLS를 우회하는 service_role 클라이언트 사용
  if (data.user) {
    const supabaseAdmin = createClient(
      publicEnv.supabaseUrl,
      serverEnv.supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const profileUpdate: Record<string, unknown> = {
      phone,
      kakao_id: typeof kakaoId === "string" ? kakaoId : null,
      notification_marketing: agreeMarketing,
      account_status: AccountStatus.Active,
    };
    if (referrerId) profileUpdate.referrer_id = referrerId;

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", data.user.id);

    if (updateError) {
      console.error("[회원가입] profiles update 실패:", updateError);
      return NextResponse.json({ error: "프로필 정보 저장에 실패했습니다" }, { status: 500 });
    }
  }

  return supabaseResponse;
}
