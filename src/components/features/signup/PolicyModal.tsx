"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";

interface PolicyModalProps {
  type: "terms" | "privacy" | null;
  onClose: () => void;
}

function TermsContent() {
  return (
    <div className="px-6 py-5 space-y-6 text-sm text-foreground leading-relaxed">
      <section>
        <h3 className="font-semibold mb-2">제1조 (목적)</h3>
        <p>
          이 약관은 테크밋(이하 &quot;회사&quot;)이 운영하는 테크밋 프리랜서 플랫폼(이하 &quot;서비스&quot;)의
          이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제2조 (용어의 정의)</h3>
        <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
        <ol className="list-decimal ml-4 mt-2 space-y-1">
          <li>&quot;서비스&quot;란 회사가 제공하는 프리랜서 개발자 전용 프로젝트 매칭 플랫폼을 의미합니다.</li>
          <li>&quot;회원&quot;이란 서비스에 가입하여 이 약관에 동의한 자를 의미합니다.</li>
          <li>&quot;프로젝트&quot;란 회사가 등록하는 개발 업무 공고를 의미합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제3조 (서비스 이용)</h3>
        <ol className="list-decimal ml-4 space-y-1">
          <li>서비스는 테크밋 소속 프리랜서 개발자만 이용할 수 있습니다.</li>
          <li>회원은 카카오 계정을 통해 가입 및 로그인할 수 있습니다.</li>
          <li>서비스는 프로젝트 조회, 지원, 프로필 관리 기능을 제공합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제4조 (회원의 의무)</h3>
        <ol className="list-decimal ml-4 space-y-1">
          <li>회원은 허위 정보를 등록해서는 안 됩니다.</li>
          <li>회원은 타인의 계정을 도용해서는 안 됩니다.</li>
          <li>회원은 서비스를 이용하여 불법적인 행위를 해서는 안 됩니다.</li>
          <li>회원은 회사의 사전 동의 없이 서비스를 이용하여 영업 활동을 할 수 없습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제5조 (서비스 이용 제한)</h3>
        <p>
          회사는 회원이 이 약관의 의무를 위반하거나, 서비스의 정상적인 운영을 방해한 경우
          서비스 이용을 제한하거나 회원 자격을 정지할 수 있습니다.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제6조 (회원 탈퇴)</h3>
        <p>
          회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴를 신청할 수 있습니다.
          탈퇴 시 개인정보는 관련 법령이 정한 기간 동안 보관 후 파기됩니다.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제7조 (책임 제한)</h3>
        <p>
          회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
          서비스 제공에 관한 책임이 면제됩니다.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제8조 (준거법 및 관할법원)</h3>
        <p>
          이 약관에 관한 분쟁은 대한민국 법률에 따르며, 분쟁 발생 시 서울중앙지방법원을
          제1심 관할법원으로 합니다.
        </p>
      </section>

      <p className="text-xs text-muted-foreground pt-4 border-t">시행일: 2025년 1월 1일</p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="px-6 py-5 space-y-6 text-sm text-foreground leading-relaxed">
      <p>
        테크밋(이하 &quot;회사&quot;)은 정보통신망 이용촉진 및 정보보호 등에 관한 법률,
        개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고
        이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이
        개인정보 처리방침을 수립·공개합니다.
      </p>

      <section>
        <h3 className="font-semibold mb-2">제1조 (수집하는 개인정보 항목 및 수집 방법)</h3>
        <div className="space-y-2">
          <p className="font-medium">① 수집 항목</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="font-medium">필수:</span> 이메일, 이름, 생년월일, 휴대폰 번호, 카카오 계정 ID</li>
            <li><span className="font-medium">선택:</span> 프로필 사진, 경력사항, 기술스택, 자기소개</li>
            <li><span className="font-medium">자동 수집:</span> 서비스 이용 기록, 접속 로그, 쿠키</li>
          </ul>
          <p className="font-medium mt-2">② 수집 방법</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>카카오 소셜 로그인을 통한 동의 후 수집</li>
            <li>서비스 이용 과정에서 이용자가 직접 입력</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제2조 (개인정보의 처리 목적)</h3>
        <ul className="list-disc ml-4 space-y-1">
          <li>회원 가입 및 관리, 본인 확인</li>
          <li>프로젝트 지원 및 매칭 서비스 제공</li>
          <li>카카오 알림톡을 통한 신규 프로젝트 및 지원 현황 알림 발송</li>
          <li>서비스 개선 및 맞춤형 서비스 제공</li>
          <li>법령 의무 이행</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제3조 (개인정보의 보유 및 이용 기간)</h3>
        <p>
          회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 동의받은 기간 내에서
          개인정보를 처리·보유합니다.
        </p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>회원 정보: 회원 탈퇴 후 30일까지 보관 후 파기 (단, 관련 법령에 따라 보존 필요 시 해당 기간까지)</li>
          <li>서비스 이용 기록: 3개월</li>
          <li>전자상거래법에 따른 계약 또는 청약철회 기록: 5년</li>
          <li>소비자 불만 및 분쟁 기록: 3년</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제4조 (개인정보의 제3자 제공)</h3>
        <p>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          다만, 다음의 경우에는 예외로 합니다.
        </p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제5조 (개인정보 처리 위탁)</h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-xs border-collapse border border-border mt-2">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left">수탁업체</th>
                <th className="border border-border px-3 py-2 text-left">위탁 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Supabase Inc.</td>
                <td className="border border-border px-3 py-2">데이터베이스 및 인증 서비스</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">카카오(주)</td>
                <td className="border border-border px-3 py-2">소셜 로그인, 알림톡 발송</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제6조 (이용자의 권리·의무)</h3>
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>개인정보 열람 요구</li>
          <li>오류가 있는 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리 정지 요구</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">제7조 (개인정보 보호책임자)</h3>
        <ul className="space-y-1">
          <li>담당자: 테크밋 운영팀</li>
          <li>이메일: privacy@techmeet.io</li>
        </ul>
      </section>

      <p className="text-xs text-muted-foreground pt-4 border-t">
        공고일: 2025년 1월 1일 &nbsp;|&nbsp; 시행일: 2025년 1월 1일
      </p>
    </div>
  );
}

const TITLES = {
  terms: "이용약관",
  privacy: "개인정보 처리방침",
};

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  if (!type || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      <div className="w-full max-w-[600px] mx-auto flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-2 rounded-lg text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="닫기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base font-semibold">{TITLES[type]}</h2>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto">
          {type === "terms" && <TermsContent />}
          {type === "privacy" && <PrivacyContent />}
        </div>
      </div>
    </div>,
    document.body
  );
}
