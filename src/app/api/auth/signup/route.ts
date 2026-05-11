import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { validatePassword, validatePhone, validateBirthDate } from "@/lib/utils/validation";
import { type CookieOptions } from "@supabase/ssr";
import { publicEnv, serverEnv } from "@/lib/config/env";
import { AccountStatus } from "@/types";
import { decryptPassword } from "@/lib/crypto/rsa";

// 중복 이메일이 admin 계정인지 확인하여 명확한 에러 메시지 반환
// admin 계정이면 409(관리자 전용 안내), 아니면 null 반환 → 기존 409("이미 사용 중") 폴백
async function checkAdminAccount(
  email: string,
  supabaseAdmin: SupabaseClient
): Promise<NextResponse | null> {
  const { data: adminUser, error: adminQueryError } = await supabaseAdmin
    .from("admin_users")
    .select("auth_user_id")
    .eq("email", email)
    .maybeSingle();

  if (adminQueryError) {
    console.error("[admin 계정 확인] admin_users 조회 오류:", adminQueryError);
    return null;
  }
  if (!adminUser) return null;

  return NextResponse.json(
    { error: "관리자 계정으로 등록된 이메일입니다. 다른 이메일을 사용해주세요." },
    { status: 409 }
  );
}

export async function POST(request: NextRequest) {
  let body: {
    email?: unknown;
    encryptedPassword?: unknown;
    name?: unknown;
    birth_date?: unknown;
    phone?: unknown;
    kakaoId?: unknown;
    reactivate?: unknown;
    referrer_id?: unknown;
    agree_marketing?: unknown;
  };

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다" }, { status: 400 });
  }

  try {
    const { email, encryptedPassword, name, birth_date, phone, kakaoId } = body;
    const referrerId = typeof body.referrer_id === "string" && body.referrer_id ? body.referrer_id : null;
    const agreeMarketing = typeof body.agree_marketing === "boolean" ? body.agree_marketing : false;
    const reactivate = body.reactivate === true;

    if (
      typeof email !== "string" ||
      typeof encryptedPassword !== "string" ||
      typeof name !== "string" ||
      typeof birth_date !== "string" ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        { error: "모든 필드를 올바르게 입력해주세요" },
        { status: 400 }
      );
    }

    let password: string;
    try {
      password = decryptPassword(encryptedPassword);
    } catch {
      return NextResponse.json({ error: "비밀번호 처리에 실패했습니다" }, { status: 400 });
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

    let supabaseAdmin: SupabaseClient;
    try {
      supabaseAdmin = createClient(
        publicEnv.supabaseUrl,
        serverEnv.supabaseServiceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
    } catch (envError) {
      console.error("[공통] service_role 클라이언트 생성 실패 — 환경변수 확인 필요:", envError);
      return NextResponse.json({ error: "서버 설정 오류가 발생했습니다" }, { status: 500 });
    }

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
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, account_status")
        .eq("email", email)
        .single();

      if (!existingProfile || existingProfile.account_status !== AccountStatus.Withdrawn) {
        return NextResponse.json({ error: "재가입할 수 없는 계정입니다." }, { status: 400 });
      }

      // 기존 계정 완전 삭제 — profiles·career_items·applications 모두 CASCADE 삭제
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingProfile.id);
      if (deleteError) {
        console.error("[재가입] 기존 계정 삭제 실패:", deleteError);
        return NextResponse.json({ error: "재가입 처리에 실패했습니다." }, { status: 500 });
      }

      // 새 auth 계정 생성 (이메일 확인 즉시 처리)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, phone, birth_date },
      });

      if (createError || !newUser.user) {
        console.error("[재가입] 신규 계정 생성 실패:", createError);
        return NextResponse.json({ error: "재가입에 실패했습니다." }, { status: 500 });
      }

      const newProfileInsert: Record<string, unknown> = {
        id: newUser.user.id,
        name,
        email,
        phone,
        birth_date,
        kakao_id: typeof kakaoId === "string" && kakaoId ? kakaoId : null,
        notification_marketing: agreeMarketing,
        account_status: AccountStatus.Active,
      };
      if (referrerId) newProfileInsert.referrer_id = referrerId;

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(newProfileInsert, { onConflict: "id" });

      if (profileError) {
        console.error("[재가입] 프로필 생성 실패:", profileError);
        return NextResponse.json({ error: "프로필 정보 저장에 실패했습니다." }, { status: 500 });
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
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
      console.error("[회원가입] signUp 오류:", error.status, error.message);
      if (error.status === 422 || error.message.includes("already registered")) {
        const linked = await checkAdminAccount(email, supabaseAdmin);
        if (linked) return linked;
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
      }
      return NextResponse.json({ error: "회원가입에 실패했습니다" }, { status: 500 });
    }

    // 이메일 확인이 활성화된 경우 Supabase는 기존 이메일에 대해 유령 user를 반환함
    // identities가 빈 배열이면 이미 가입된 이메일
    if (!data.user || data.user.identities?.length === 0) {
      const linked = await checkAdminAccount(email, supabaseAdmin);
      if (linked) return linked;
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
    }

    if (data.user) {
      const profileUpsert: Record<string, unknown> = {
        id: data.user.id,
        name,
        email,
        phone,
        birth_date,
        kakao_id: typeof kakaoId === "string" && kakaoId ? kakaoId : null,
        notification_marketing: agreeMarketing,
        account_status: AccountStatus.Active,
      };
      if (referrerId) profileUpsert.referrer_id = referrerId;

      const { error: upsertError } = await supabaseAdmin
        .from("profiles")
        .upsert(profileUpsert, { onConflict: "id" });

      if (upsertError) {
        console.error("[회원가입] profiles upsert 실패:", upsertError.message, upsertError.code, upsertError.details);
        return NextResponse.json({ error: "프로필 정보 저장에 실패했습니다" }, { status: 500 });
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[회원가입] 처리되지 않은 오류:", error);
    return NextResponse.json({ error: "회원가입 중 서버 오류가 발생했습니다" }, { status: 500 });
  }
}
