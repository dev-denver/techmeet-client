export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white mx-auto max-w-[430px] px-6 py-10">
      <h1 className="text-xl font-bold mb-6">개인정보 처리방침</h1>

      <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
        <p>
          테크밋(이하 &quot;회사&quot;)은 정보통신망 이용촉진 및 정보보호 등에 관한 법률,
          개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고
          이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이
          개인정보 처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="font-semibold text-base mb-2">제1조 (수집하는 개인정보 항목 및 수집 방법)</h2>
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
          <h2 className="font-semibold text-base mb-2">제2조 (개인정보의 처리 목적)</h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>회원 가입 및 관리, 본인 확인</li>
            <li>프로젝트 지원 및 매칭 서비스 제공</li>
            <li>카카오 알림톡을 통한 신규 프로젝트 및 지원 현황 알림 발송</li>
            <li>서비스 개선 및 맞춤형 서비스 제공</li>
            <li>법령 의무 이행</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제3조 (개인정보의 보유 및 이용 기간)</h2>
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
          <h2 className="font-semibold text-base mb-2">제4조 (개인정보의 제3자 제공)</h2>
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
          <h2 className="font-semibold text-base mb-2">제5조 (개인정보 처리 위탁)</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs border-collapse border border-zinc-200 mt-2">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="border border-zinc-200 px-3 py-2 text-left">수탁업체</th>
                  <th className="border border-zinc-200 px-3 py-2 text-left">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 px-3 py-2">Supabase Inc.</td>
                  <td className="border border-zinc-200 px-3 py-2">데이터베이스 및 인증 서비스</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 px-3 py-2">카카오(주)</td>
                  <td className="border border-zinc-200 px-3 py-2">소셜 로그인, 알림톡 발송</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제6조 (이용자의 권리·의무)</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>개인정보 열람 요구</li>
            <li>오류가 있는 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제7조 (개인정보 보호책임자)</h2>
          <ul className="space-y-1">
            <li>담당자: 테크밋 운영팀</li>
            <li>이메일: privacy@techmeet.io</li>
          </ul>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          공고일: 2025년 1월 1일 &nbsp;|&nbsp; 시행일: 2025년 1월 1일
        </p>
      </div>
    </div>
  );
}
