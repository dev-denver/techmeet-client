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
}

/**
 * 카카오 인가 코드 → access_token 교환
 *
 * @throws 카카오 API 오류 시 Error
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: serverEnv.kakaoRestApiKey,
      redirect_uri: serverEnv.kakaoRedirectUri,
      code,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
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

  return {
    kakaoId: String(data.id),
    email: data.kakao_account?.email ?? null,
    name: data.kakao_account?.profile?.nickname ?? null,
  };
}
