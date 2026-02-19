import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { validatePassword, validatePhone, validateBirthDate } from "@/lib/utils/validation";
import { type CookieOptions } from "@supabase/ssr";
import { publicEnv } from "@/lib/config/env";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    email?: unknown;
    password?: unknown;
    name?: unknown;
    birth_date?: unknown;
    phone?: unknown;
    kakaoId?: unknown;
  };

  const { email, password, name, birth_date, phone, kakaoId } = body;

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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, birth_date },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다" }, { status: 409 });
    }
    return NextResponse.json({ error: "회원가입에 실패했습니다" }, { status: 500 });
  }

  // 추가 프로필 필드 업데이트 (phone, kakao_id)
  if (data.user) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        phone,
        kakao_id: typeof kakaoId === "string" ? kakaoId : null,
      })
      .eq("id", data.user.id);

    if (updateError) {
      console.error("[회원가입] profiles update 실패:", updateError);
      return NextResponse.json({ error: "프로필 정보 저장에 실패했습니다" }, { status: 500 });
    }
  }

  return supabaseResponse;
}
