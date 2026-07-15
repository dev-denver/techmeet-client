import axios from "axios";
import { Sendon, SmsMessageType } from "@alipeople/sendon-sdk-typescript";
import { serverEnv } from "@/lib/config/env";

// 센드온은 발신 IP 화이트리스트를 요구해 고정 IP 프록시(AWS Squid)를 거쳐야 한다.
// 표준 HTTPS_PROXY 환경변수를 쓰면 빌드 단계 네트워크 요청까지 프록시를 타므로,
// 전용 SENDON_PROXY_URL로 분리하고 이 모듈이 실제로 쓰이는 시점(런타임)에만 적용한다.
let proxyConfigured = false;
function configureSendonProxy() {
  if (proxyConfigured) return;
  proxyConfigured = true;
  const proxyUrl = serverEnv.sendonProxyUrl;
  if (!proxyUrl) return;
  const url = new URL(proxyUrl);
  axios.defaults.proxy = {
    protocol: url.protocol.replace(":", ""),
    host: url.hostname,
    port: Number(url.port) || 80,
    ...(url.username
      ? {
          auth: {
            username: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
          },
        }
      : {}),
  };
}

export type SmsSendResult = {
  success: boolean;
  error?: string;
};

export async function sendSms(to: string, message: string, title: string): Promise<SmsSendResult> {
  configureSendonProxy();
  const client = new Sendon({ id: serverEnv.sendonId, apikey: serverEnv.sendonApiKey });
  try {
    const res = await client.sms.send({
      type: SmsMessageType.LMS,
      from: serverEnv.sendonFrom,
      to: [to],
      message,
      title,
    });
    const success = res.code === 200;
    return { success, error: success ? undefined : res.message };
  } catch (e) {
    // axios가 비-2xx 응답에 예외를 던지므로, 실제 센드온 API가 반환한 본문(response.data)을
    // 우선적으로 노출해야 거절 사유(발신번호 미등록/인증 실패 등)를 알 수 있다.
    const responseData = (e as { response?: { data?: unknown } })?.response?.data;
    const error = responseData
      ? JSON.stringify(responseData)
      : e instanceof Error
        ? e.message
        : "발송 중 오류 발생";
    return { success: false, error };
  }
}

export async function notifyAdminOfNewApplication(params: {
  applicantName: string;
  projectTitle: string;
  expectedRate: number | null;
}): Promise<void> {
  const message =
    `[테크밋] ${params.applicantName}님이 "${params.projectTitle}"에 지원했습니다.` +
    (params.expectedRate ? ` (희망단가 ${params.expectedRate}만원)` : "");

  const result = await sendSms(serverEnv.sendonAdminNotifyPhone, message, "신규 프로젝트 지원 알림");
  if (!result.success) {
    console.error("[관리자 SMS 발송 실패]", result.error);
  }
}
