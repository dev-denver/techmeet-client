import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { serverEnv, publicEnv } from "@/lib/config/env";
import { exchangeCodeForToken, getKakaoUserInfo } from "@/lib/kakao/oauth";
import { AccountStatus } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("[카카오 콜백] 요청 수신", {
    url: request.url,
    hasCode: !!code,
    KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
    NEXT_PUBLIC_KAKAO_REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY ? "SET" : "MISSING",
    SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
  });

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    // Step 1: 카카오 인가 코드 → access_token 교환
    console.log("[카카오 콜백] Step 1: 토큰 교환 시작", {
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
    });
    const accessToken = await exchangeCodeForToken(code);
    console.log("[카카오 콜백] Step 1: 토큰 교환 성공");

    // Step 2: 카카오 사용자 정보 조회
    const kakaoUser = await getKakaoUserInfo(accessToken);
    console.log("[카카오 콜백] Step 2: 사용자 정보", {
      kakaoId: kakaoUser.kakaoId,
      hasEmail: !!kakaoUser.email,
      hasName: !!kakaoUser.name,
    });

    // 이메일 동의 없이 로그인 시도한 경우
    if (!kakaoUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=email_required", request.url)
      );
    }

    const { kakaoId, email, name, birthDate, phone } = kakaoUser;

    // Admin 클라이언트 생성 (RLS 우회, service_role key 사용)
    const supabaseAdmin = createClient(
      publicEnv.supabaseUrl,
      serverEnv.supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Step 3: DB에서 kakao_id로 기존 유저 조회
    // .single() 대신 .limit(1) 배열 방식 사용 — 중복 행 에러 방지
    const { data: profileRows, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, account_status")
      .eq("kakao_id", kakaoId)
      .limit(1);

    let profile = profileRows?.[0] ?? null;

    console.log("[카카오 콜백] Step 3: profiles 조회", {
      found: !!profile,
      errorCode: profileError?.code,
      errorMessage: profileError?.message,
    });

    // 탈퇴 회원은 기존 계정과 연결하지 않고 신규 회원으로 가입 처리
    if (profile?.account_status === AccountStatus.Withdrawn) {
      console.log("[카카오 콜백] Step 3: 탈퇴 회원 → 신규 가입 플로우로 진행");
      profile = null;
    }

    // kakao_id로 못 찾은 경우, 같은 이메일의 기존 프로필이 있으면 kakao_id 자동 연결
    if (!profile && email) {
      const { data: emailProfileRows } = await supabaseAdmin
        .from("profiles")
        .select("id, email, account_status")
        .eq("email", email)
        .limit(1);

      const emailProfile = emailProfileRows?.[0] ?? null;

      // 탈퇴 프로필에는 kakao_id를 연결하지 않음 (신규 가입 플로우로 진행)
      if (emailProfile && emailProfile.account_status !== AccountStatus.Withdrawn) {
        console.log("[카카오 콜백] Step 3-1: 이메일 일치 프로필 발견 → kakao_id 연결");
        await supabaseAdmin
          .from("profiles")
          .update({ kakao_id: kakaoId })
          .eq("id", emailProfile.id);
        profile = emailProfile;
      }
    }

    if (profile) {
      // 기존 유저: 매직 링크 생성 (이메일 발송 없음)
      const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: profile.email,
        });

      console.log("[카카오 콜백] Step 4: generateLink", {
        hasTokenHash: !!linkData?.properties?.hashed_token,
        error: linkError?.message,
      });

      if (linkError || !linkData?.properties?.hashed_token) {
        console.error("[카카오 콜백] Step 4 실패: generateLink 오류", linkError);
        return NextResponse.redirect(
          new URL("/login?error=session_error", request.url)
        );
      }

      // redirect response를 먼저 생성한 뒤, 세션 쿠키를 그 response에 직접 설정
      const redirectResponse = NextResponse.redirect(new URL("/", request.url));

      const supabase = createServerClient(
        publicEnv.supabaseUrl,
        publicEnv.supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
              cookiesToSet.forEach(({ name, value, options }) => {
                redirectResponse.cookies.set(name, value, options as Parameters<typeof redirectResponse.cookies.set>[2]);
              });
            },
          },
        }
      );

      const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: "magiclink",
      });

      console.log("[카카오 콜백] Step 5: verifyOtp", {
        hasSession: !!sessionData?.session,
        hasUser: !!sessionData?.user,
        error: verifyError?.message,
      });

      if (verifyError || !sessionData?.session) {
        console.error("[카카오 콜백] Step 5 실패: OTP 검증 오류", verifyError, "session:", sessionData?.session);
        return NextResponse.redirect(
          new URL("/login?error=session_error", request.url)
        );
      }

      console.log("[카카오 콜백] Step 5: 성공 → / 리다이렉트");
      return redirectResponse;
    }

    // 신규 유저: 회원가입 페이지로
    console.log("[카카오 콜백] 신규 유저 → /signup 리다이렉트");
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("name", name ?? "");
    signupUrl.searchParams.set("kakao_id", kakaoId);
    if (birthDate) signupUrl.searchParams.set("birth_date", birthDate);
    if (phone) signupUrl.searchParams.set("phone", phone);
    const signupResponse = NextResponse.redirect(signupUrl);
    signupResponse.cookies.set("signup_email", email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });
    return signupResponse;
  } catch (error) {
    console.error("[카카오 콜백 오류]", error);
    return NextResponse.redirect(
      new URL("/login?error=kakao_api_error", request.url)
    );
  }
}
