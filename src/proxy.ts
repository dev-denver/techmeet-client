/**
 * Next.js 미들웨어 역할을 담당하는 프록시.
 * next.config.ts의 `experimental.instrumentationHook` 없이 middleware.ts 대신 사용하며,
 * Supabase 세션 쿠키 갱신 + 인증 보호 + 탈퇴 회원 차단을 처리한다.
 *
 * 이 파일은 middleware.ts에서 import하여 실행된다.
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/config/env";
import { AccountStatus } from "@/types";

// 인증 여부와 무관하게 항상 그대로 통과시키는 경로 — Supabase 세션 검증 자체가 불필요
const NO_AUTH_PATHS = ["/terms", "/privacy", "/api/auth"];
// "이미 로그인된 사용자면 홈으로" 리다이렉트만 필요한 경로 — 보호된 데이터 접근이 아니므로
// 네트워크 재검증(getUser) 없이 쿠키 로컬 디코드(getSession)로 충분
const AUTH_REDIRECT_PATHS = ["/login", "/signup"];

function isPublicPath(pathname: string) {
  return (
    NO_AUTH_PATHS.some((p) => pathname.startsWith(p)) ||
    AUTH_REDIRECT_PATHS.includes(pathname)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (NO_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  // 로그인/회원가입 페이지: 실제 데이터 접근을 게이트하지 않으므로 네트워크 재검증 없이
  // 쿠키에 있는 세션만으로 "이미 로그인됨" 여부를 판단
  if (AUTH_REDIRECT_PATHS.includes(pathname)) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미인증 사용자가 보호된 페이지 접근 → 로그인으로 리다이렉트
  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  // 인증된 사용자 처리
  if (user) {
    // 탈퇴 회원 체크 (공개 경로 제외)
    if (!isPublicPath(pathname)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_status")
        .eq("id", user.id)
        .single();

      if (profile?.account_status === AccountStatus.Withdrawn) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", AccountStatus.Withdrawn);
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|robots\\.txt|sitemap\\.xml|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
