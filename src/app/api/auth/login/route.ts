import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: unknown; password?: unknown };
  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요" },
      { status: 400 }
    );
  }

  // TODO: Supabase에서 이메일로 유저 조회
  // const user = await supabase.from("users").select("*").eq("email", email).single();
  type UserRow = { id: string; email: string; password_hash: string };
  const user: UserRow | null = null as UserRow | null;

  if (!user) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
      { status: 401 }
    );
  }

  // TODO: Supabase Auth 세션 발급
  // await supabase.auth.setSession(...)

  return NextResponse.json({ success: true });
}
