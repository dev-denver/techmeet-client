import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getKakaoUserInfo } from "@/lib/kakao/oauth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    // 카카오 인가 코드 → access_token 교환
    const accessToken = await exchangeCodeForToken(code);

    // 카카오 사용자 정보 조회
    const kakaoUser = await getKakaoUserInfo(accessToken);

    // 이메일 동의 없이 로그인 시도한 경우
    if (!kakaoUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=email_required", request.url)
      );
    }

    const { kakaoId, email, name } = kakaoUser;

    // TODO: DB에서 kakao_id로 유저 조회 (Supabase 연동 후 구현)
    // const { data: user } = await supabase
    //   .from("users")
    //   .select("id")
    //   .eq("kakao_id", kakaoId)
    //   .single();
    const user: { id: string } | null = null;

    if (user) {
      // TODO: Supabase Auth 세션 발급 후 홈으로 이동
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 신규 유저: 회원가입 페이지로
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("email", email);
    signupUrl.searchParams.set("name", name ?? "");
    signupUrl.searchParams.set("kakao_id", kakaoId);
    return NextResponse.redirect(signupUrl);
  } catch (error) {
    console.error("[카카오 콜백 오류]", error);
    return NextResponse.redirect(
      new URL("/login?error=kakao_api_error", request.url)
    );
  }
}
