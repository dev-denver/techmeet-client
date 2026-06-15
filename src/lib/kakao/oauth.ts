/**
 * 카카오 OAuth API 호출 유틸 (서버 전용)
 *
 * 사용처: src/app/api/auth/kakao/callback/route.ts
 */

import { serverEnv } from "@/lib/config/env";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    email?: string;
    email_needs_agreement?: boolean;
    name?: string;
    birthyear?: string;
    birthday?: string;
    phone_number?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export interface KakaoUserInfo {
  kakaoId: string;
  email: string | null;
  name: string | null;
  birthDate: string | null;
  phone: string | null;
}

/**
 * 카카오 birthyear(YYYY) + birthday(MMDD) → ISO 날짜(YYYY-MM-DD)
 */
function toIsoBirthDate(birthyear?: string, birthday?: string): string | null {
  if (!/^\d{4}$/.test(birthyear ?? "") || !/^\d{4}$/.test(birthday ?? "")) return null;
  return `${birthyear}-${birthday!.slice(0, 2)}-${birthday!.slice(2, 4)}`;
}

/**
 * 카카오 전화번호("+82 10-1234-5678") → 국내 형식(010-1234-5678)
 */
function toLocalPhone(phoneNumber?: string): string | null {
  if (!phoneNumber) return null;
  const localized = phoneNumber.replace(/^\+82\s*/, "0");
  return /^0\d{1,2}-\d{3,4}-\d{4}$/.test(localized) ? localized : null;
}

/**
 * 카카오 인가 코드 → access_token 교환
 *
 * @throws 카카오 API 오류 시 Error
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const params: Record<string, string> = {
    grant_type: "authorization_code",
    client_id: serverEnv.kakaoRestApiKey,
    redirect_uri: serverEnv.kakaoRedirectUri,
    code,
  };

  const clientSecret = serverEnv.kakaoClientSecret;
  if (clientSecret) {
    params.client_secret = clientSecret;
  }

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[카카오 oauth] 토큰 교환 실패", {
      status: res.status,
      body: errorBody,
      redirect_uri: params.redirect_uri,
    });
    throw new Error(`카카오 토큰 교환 실패 (${res.status}): ${errorBody}`);
  }

  const data = (await res.json()) as KakaoTokenResponse;
  return data.access_token;
}

/**
 * access_token으로 카카오 사용자 정보 조회
 *
 * @throws 카카오 API 오류 시 Error
 */
export async function getKakaoUserInfo(
  accessToken: string
): Promise<KakaoUserInfo> {
  const res = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`카카오 사용자 정보 조회 실패 (${res.status}): ${errorBody}`);
  }

  const data = (await res.json()) as KakaoUserResponse;
  const account = data.kakao_account;

  return {
    kakaoId: String(data.id),
    email: account?.email ?? null,
    name: account?.name ?? account?.profile?.nickname ?? null,
    birthDate: toIsoBirthDate(account?.birthyear, account?.birthday),
    phone: toLocalPhone(account?.phone_number),
  };
}
