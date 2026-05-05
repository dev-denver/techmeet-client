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

const PUBLIC_PATHS = ["/login", "/signup", "/terms", "/privacy", "/api/auth", "/api/profile/referrer/search", "/api/profile/referrer/lookup"];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 미인증 사용자가 보호된 페이지 접근 → 로그인으로 리다이렉트
  if (!user && !isPublicPath(pathname)) {
    const ref = request.nextUrl.searchParams.get("ref");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    const redirectResponse = NextResponse.redirect(loginUrl);

    if (ref && UUID_REGEX.test(ref)) {
      redirectResponse.cookies.set("pending_referral", ref, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
    return redirectResponse;
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

    // 로그인/회원가입 페이지 접근 → 홈으로 리다이렉트
    if (pathname === "/login" || pathname === "/signup") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
