// 서버 전용 API 헬퍼 — next/server를 import하므로 클라이언트 번들에 포함되어선 안 됨.
// lib/api/index.ts(re-export)에 추가하지 말 것. API Route에서 직접 import해서 사용.
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

type AuthSuccess = { user: User; errorResponse: null };
type AuthFailure = { user: null; errorResponse: NextResponse };

/**
 * 인증 게이트 헬퍼.
 * 모든 보호된 API Route 핸들러 최상단에서 호출한다.
 *
 * 사용법:
 *   const { user, errorResponse } = await requireAuth();
 *   if (errorResponse) return errorResponse;
 *   // 이 아래는 user가 non-null로 타입 좁혀짐
 *
 * 주의: 이후 Supabase DB 작업이 필요한 경우 createServerClient()를 별도로 호출해야 한다.
 * (이 함수는 인증 확인용으로만 클라이언트를 생성하며 반환하지 않음)
 */
export async function requireAuth(): Promise<AuthSuccess | AuthFailure> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 }),
    };
  }

  return { user, errorResponse: null };
}

/**
 * URL 쿼리 파라미터에서 page / pageSize를 안전하게 파싱한다.
 * NaN·음수·범위 초과를 방어하며, defaults로 상한(maxPageSize)을 강제할 수 있다.
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults?: { page?: number; pageSize?: number; maxPageSize?: number }
): { page: number; pageSize: number } {
  const page = Math.max(
    1,
    parseInt(searchParams.get("page") ?? String(defaults?.page ?? 1), 10)
  );
  const pageSize = Math.min(
    defaults?.maxPageSize ?? 100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? String(defaults?.pageSize ?? 20), 10))
  );
  return { page, pageSize };
}
