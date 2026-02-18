import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validatePassword, validatePhone, validateAge } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    email?: unknown;
    password?: unknown;
    name?: unknown;
    age?: unknown;
    phone?: unknown;
    kakaoId?: unknown;
  };

  const { email, password, name, age, phone, kakaoId } = body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof age !== "number" ||
    typeof phone !== "string" ||
    typeof kakaoId !== "string"
  ) {
    return NextResponse.json(
      { error: "모든 필드를 올바르게 입력해주세요" },
      { status: 400 }
    );
  }

  const { valid: passwordValid, errors: passwordErrors } = validatePassword(password);
  if (!passwordValid) {
    return NextResponse.json(
      { error: passwordErrors[0] },
      { status: 400 }
    );
  }

  if (!validatePhone(phone)) {
    return NextResponse.json(
      { error: "올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)" },
      { status: 400 }
    );
  }

  if (!validateAge(age)) {
    return NextResponse.json(
      { error: "올바른 나이를 입력해주세요 (1~99)" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // TODO: Supabase에 유저 생성
  // await supabase.from("users").insert({
  //   email,
  //   name,
  //   age,
  //   phone,
  //   kakao_id: kakaoId,
  //   password_hash: passwordHash,
  // });
  console.log("passwordHash generated:", passwordHash.length > 0);

  // TODO: Supabase Auth 세션 발급
  // await supabase.auth.setSession(...)

  return NextResponse.json({ success: true });
}
