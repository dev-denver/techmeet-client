/**
 * 카카오 알림톡 발송 유틸 (서버 전용)
 *
 * TODO: 제공업체(NHN Cloud, 솔라피 등) 계약 후 아래 엔드포인트/body 구조 채울 것
 * 현재: console.log로 발송 시도 로깅 후 return (no-op)
 */

interface AlimtalkMessage {
  to: string;
  templateCode: string;
  variables: Record<string, string>;
}

/**
 * 알림톡 단건 발송
 *
 * TODO: 제공업체 API 엔드포인트 및 인증 방식 확정 후 구현
 */
export async function sendAlimtalk(message: AlimtalkMessage): Promise<void> {
  // TODO: 제공업체 결정 후 실제 HTTP 호출 구현
  // 예시 (NHN Cloud):
  //   POST https://api-alimtalk.cloud.toast.com/alimtalk/v2.3/appkeys/{appKey}/messages
  //   Authorization: {secretKey}
  //   body: { senderKey, templateCode, recipientList: [{ recipientNo, templateParameter }] }
  console.log("[알림톡 발송 시도]", {
    to: message.to,
    templateCode: message.templateCode,
    variables: message.variables,
  });
}

/**
 * 신규 프로젝트 알림톡 발송
 *
 * TODO: templateCode를 제공업체 승인된 템플릿 코드로 교체
 */
export async function sendNewProjectNotification(params: {
  to: string;
  recipientName: string;
  projectTitle: string;
  projectUrl: string;
  deadline: string;
}): Promise<void> {
  await sendAlimtalk({
    to: params.to,
    templateCode: "NEW_PROJECT_NOTIFY", // TODO: 실제 승인된 템플릿 코드로 교체
    variables: {
      name: params.recipientName,
      projectTitle: params.projectTitle,
      projectUrl: params.projectUrl,
      deadline: params.deadline,
    },
  });
}

/**
 * 알림톡 대량 발송 (개별 실패해도 계속 진행)
 *
 * @returns 성공/실패 건수
 */
export async function sendBulkAlimtalk(
  recipients: Array<{ phone: string; name: string }>,
  projectInfo: { title: string; url: string; deadline: string }
): Promise<{ success: number; failed: number }> {
  const results = await Promise.allSettled(
    recipients.map((recipient) =>
      sendNewProjectNotification({
        to: recipient.phone,
        recipientName: recipient.name,
        projectTitle: projectInfo.title,
        projectUrl: projectInfo.url,
        deadline: projectInfo.deadline,
      })
    )
  );

  const success = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  if (failed > 0) {
    console.warn(`[알림톡 대량 발송] ${failed}건 실패, ${success}건 성공`);
  }

  return { success, failed };
}
