/**
 * 환경변수 타입 안전 접근 레이어
 *
 * getter 방식 사용 이유:
 * - import 시점이 아닌 접근 시점에 검증
 * - 테스트 환경에서 불필요한 변수까지 강요하지 않음
 * - 빌드 시 검증 없이 런타임에만 오류 발생
 */

function requireServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `서버 환경변수 "${key}"가 설정되지 않았습니다. .env.local을 확인하세요.`
    );
  }
  return value;
}

/** 서버 전용 환경변수 (NEXT_PUBLIC_ 접두사 없음) */
export const serverEnv = {
  get kakaoRestApiKey() {
    return requireServerEnv("KAKAO_REST_API_KEY");
  },
  get kakaoRedirectUri() {
    return requireServerEnv("KAKAO_REDIRECT_URI");
  },
  get kakaoAlimtalkAppKey() {
    return requireServerEnv("KAKAO_ALIMTALK_APP_KEY");
  },
  get kakaoAlimtalkSenderKey() {
    return requireServerEnv("KAKAO_ALIMTALK_SENDER_KEY");
  },
  get supabaseUrl() {
    return requireServerEnv("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return requireServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
};

/** 클라이언트에서 접근 가능한 공개 환경변수 (NEXT_PUBLIC_ 접두사) */
export const publicEnv = {
  get kakaoRestApiKey() {
    const value = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    if (!value) throw new Error(`공개 환경변수 "NEXT_PUBLIC_KAKAO_REST_API_KEY"가 설정되지 않았습니다. .env.local을 확인하세요.`);
    return value;
  },
  get kakaoRedirectUri() {
    const value = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    if (!value) throw new Error(`공개 환경변수 "NEXT_PUBLIC_KAKAO_REDIRECT_URI"가 설정되지 않았습니다. .env.local을 확인하세요.`);
    return value;
  },
  get supabaseUrl() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!value) throw new Error(`공개 환경변수 "NEXT_PUBLIC_SUPABASE_URL"가 설정되지 않았습니다. .env.local을 확인하세요.`);
    return value;
  },
  get supabaseAnonKey() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!value) throw new Error(`공개 환경변수 "NEXT_PUBLIC_SUPABASE_ANON_KEY"가 설정되지 않았습니다. .env.local을 확인하세요.`);
    return value;
  },
  get appUrl() {
    const value = process.env.NEXT_PUBLIC_APP_URL;
    if (!value) throw new Error(`공개 환경변수 "NEXT_PUBLIC_APP_URL"가 설정되지 않았습니다. .env.local을 확인하세요.`);
    return value;
  },
  get appEnv() {
    return process.env.NEXT_PUBLIC_APP_ENV ?? "development";
  },
};
