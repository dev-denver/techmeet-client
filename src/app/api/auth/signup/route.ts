import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { validatePassword, validatePhone, validateBirthDate, validateEmail, validateLength } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
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
  // 카카오 로그인을 거쳤는지 확인 (httpOnly 쿠키, 클라이언트에 노출 안 됨)
  const cookieEmail = request.cookies.get("signup_email")?.value;
  if (!cookieEmail) {
    return NextResponse.json(
      { error: "회원가입 세션이 만료되었습니다. 카카오 로그인을 다시 시도해주세요." },
      { status: 400 }
    );
  }

  let body: {
    encryptedPassword?: unknown;
    email?: unknown;
    name?: unknown;
    birth_date?: unknown;
    phone?: unknown;
    kakaoId?: unknown;
    referrer_note?: unknown;
    agree_marketing?: unknown;
  };

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다" }, { status: 400 });
  }

  try {
    const { encryptedPassword, name, birth_date, phone, kakaoId } = body;
    const referrerNote = typeof body.referrer_note === "string" ? body.referrer_note.trim() : "";
    const agreeMarketing = typeof body.agree_marketing === "boolean" ? body.agree_marketing : false;

    if (
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

    // 이메일: 카카오 계정 이메일을 기본값으로 하되, 사용자가 직접 수정한 이메일이 있으면 사용
    const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : cookieEmail;

    if (!validateEmail(email) || email.length > LIMITS.EMAIL_MAX) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다" }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > LIMITS.NAME_MAX) {
      return NextResponse.json(
        { error: `이름은 1~${LIMITS.NAME_MAX}자로 입력해주세요` },
        { status: 400 }
      );
    }

    if (referrerNote) {
      const lengthError = validateLength(referrerNote, LIMITS.REFERRER_NOTE_MAX, "추천인");
      if (lengthError) {
        return NextResponse.json({ error: lengthError }, { status: 400 });
      }
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
    supabaseResponse.cookies.set("signup_email", "", { maxAge: 0, path: "/" });

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

    // 이메일 중복 확인 (admin API로 rate limit 없이 조회)
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id, account_status")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.account_status === AccountStatus.Withdrawn) {
        // 탈퇴 계정: 기존 계정을 완전 삭제하고 신규 회원으로 가입 진행
        // (profiles·career_items·applications 모두 CASCADE 삭제)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
        if (deleteError) {
          console.error("[회원가입] 탈퇴 계정 삭제 실패:", deleteError);
          return NextResponse.json({ error: "회원가입에 실패했습니다" }, { status: 500 });
        }
      } else {
        const linked = await checkAdminAccount(email, supabaseAdmin);
        if (linked) return linked;
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
      }
    }

    // admin API로 생성 — rate limit 우회, 이메일 확인 즉시 처리
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: trimmedName, phone, birth_date },
    });

    if (createError || !newUser.user) {
      console.error("[회원가입] createUser 오류:", createError?.status, createError?.message);
      if (createError?.message?.includes("already registered") || createError?.message?.includes("already been registered")) {
        const linked = await checkAdminAccount(email, supabaseAdmin);
        if (linked) return linked;
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
      }
      return NextResponse.json({ error: "회원가입에 실패했습니다" }, { status: 500 });
    }

    const profileUpsert: Record<string, unknown> = {
      id: newUser.user.id,
      name: trimmedName,
      email,
      phone,
      birth_date,
      kakao_id: typeof kakaoId === "string" && kakaoId ? kakaoId : null,
      notification_marketing: agreeMarketing,
      account_status: AccountStatus.Active,
    };
    if (referrerNote) profileUpsert.referrer_note = referrerNote;

    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(profileUpsert, { onConflict: "id" });

    if (upsertError) {
      console.error("[회원가입] profiles upsert 실패:", upsertError.message, upsertError.code, upsertError.details);
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id).catch((e) =>
        console.error("[회원가입] 롤백 실패 — auth.users 고아 행 남음:", e)
      );
      return NextResponse.json({ error: "프로필 정보 저장에 실패했습니다" }, { status: 500 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      console.error("[회원가입] 로그인 실패:", signInError);
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id).catch((e) =>
        console.error("[회원가입] 롤백 실패 — auth.users 고아 행 남음:", e)
      );
      return NextResponse.json({ error: "로그인에 실패했습니다" }, { status: 500 });
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[회원가입] 처리되지 않은 오류:", error);
    return NextResponse.json({ error: "회원가입 중 서버 오류가 발생했습니다" }, { status: 500 });
  }
}
