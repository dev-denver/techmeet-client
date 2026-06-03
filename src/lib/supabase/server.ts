import { createServerClient as createSSRServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { publicEnv, serverEnv } from "@/lib/config/env";

/**
 * RLS를 우회하는 서비스 롤 클라이언트.
 * 반드시 서버 사이드(API Route, Server Action)에서만 사용할 것.
 * 현재 사용처: 추천인 검색·조회 (profiles 테이블을 사용자 세션 없이 읽어야 할 때)
 */
export function createAdminClient() {
  return createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSSRServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
          });
        } catch {
          // Server Component에서 쿠키 설정은 무시 가능
        }
      },
    },
  });
}
