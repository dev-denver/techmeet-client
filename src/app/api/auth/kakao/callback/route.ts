import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  // TODO: code → Kakao access_token 교환
  // const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //   body: new URLSearchParams({
  //     grant_type: "authorization_code",
  //     client_id: process.env.KAKAO_REST_API_KEY!,
  //     redirect_uri: process.env.KAKAO_REDIRECT_URI!,
  //     code,
  //   }),
  // });
  // const token = await tokenRes.json();

  // TODO: Kakao 사용자 정보 조회
  // const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
  //   headers: { Authorization: `Bearer ${token.access_token}` },
  // });
  // const kakaoUser = await userRes.json();
  // const { id: kakaoId, kakao_account: { email, profile: { nickname: name } } } = kakaoUser;

  // TODO: DB에서 kakao_id로 유저 조회
  // const user = await supabase.from("users").select("*").eq("kakao_id", kakaoId).single();

  const user: { id: string } | null = null;

  // 예시 값 (실제 구현 시 위 TODO에서 채워짐)
  const kakaoId = "stub_kakao_id";
  const email = "stub@example.com";
  const name = "홍길동";

  if (user) {
    // 기존 유저: 세션 발급 후 홈으로
    // TODO: Supabase Auth 세션 발급
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 신규 유저: 회원가입 페이지로
  const signupUrl = new URL("/signup", request.url);
  signupUrl.searchParams.set("email", email);
  signupUrl.searchParams.set("name", name);
  signupUrl.searchParams.set("kakao_id", kakaoId);
  return NextResponse.redirect(signupUrl);
}
