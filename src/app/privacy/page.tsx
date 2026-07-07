import { BackButton } from "@/components/ui/back-button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background mx-auto max-w-[600px]">
      <BackButton label="개인정보 처리방침" />
      <div className="px-6 py-8 space-y-6 text-sm text-foreground leading-relaxed">
        <p>
          &quot;(주)테크밋&quot;(이하 &quot;회사&quot;)은 테크밋 소속 프리랜서 개발자를 위한 프로젝트
          매칭 서비스(이하 &quot;서비스&quot;)를 운영하며, &apos;개인정보 보호법&apos; 등 관련 법령에
          따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
          다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="font-semibold text-base mb-2">1. 개인정보의 처리 목적</h2>
          <p>회사는 다음의 목적을 위하여 개인정보를 처리하며, 목적이 변경되는 경우 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>회원 가입 의사 확인, 본인 확인 및 카카오 소셜 로그인 연동</li>
            <li>프리랜서 프로필(경력·학력·자격증·기술스택 등) 관리 및 프로젝트 매칭·지원 서비스 제공</li>
            <li>프로젝트 지원 내역 관리 및 지원 상태 안내</li>
            <li>계약 체결 및 용역 대금 정산(사업자·개인 구분, 계좌정보 확인 등)</li>
            <li>카카오 알림톡을 통한 신규 프로젝트 등록·지원 현황 변경·공지사항 안내</li>
            <li>이력서 및 계약 서류(사업자등록증, 계좌 사본) 보관 및 확인</li>
            <li>서비스 이용 통계 분석을 통한 서비스 개선 및 부정 이용 방지</li>
            <li>법령상 의무 이행 및 분쟁 대응</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">2. 처리하는 개인정보 항목 및 수집 방법</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">2-1. 회원가입 시 수집 항목 (필수)</p>
              <p>이메일, 이름, 생년월일, 휴대폰 번호, 비밀번호(카카오 로그인 시 불필요) 및 카카오 계정 식별정보(카카오 로그인 이용 시)</p>
            </div>
            <div>
              <p className="font-medium">2-2. 서비스 이용 중 등록하는 항목 (선택)</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>기본 정보: 자기소개, 기술 스택, 주소, 성별, 투입 가능 상태 및 투입 가능일, 추천인 메모</li>
                <li>경력사항: 회사명, 직무, 근무기간, 업무 내용, 사용 기술 스택</li>
                <li>학력·자격증: 학교명, 학위, 전공, 재학기간, 졸업 여부, 자격증명, 취득일</li>
                <li>스킬 인벤토리(프로젝트 수행 경험): 프로젝트명, 수행기간, 고객사, 산업군, 담당 역할, 사용 언어·DBMS·툴 등</li>
                <li>이력서 파일(PDF, DOC, DOCX, HWP)</li>
                <li>계약·정산 정보: 계약 형태(사업자/개인/정규직), 사업자명·사업자등록번호·사업장 주소·사업자등록증 사본, 은행명·계좌번호·계좌 사본 이미지</li>
                <li>프로젝트 지원 시 희망 단가 및 참고사항</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">2-3. 자동으로 수집되는 항목</p>
              <p>서비스 이용 기록, 접속 로그, 알림톡 발송·수신 이력, 쿠키</p>
            </div>
            <div>
              <p className="font-medium">2-4. 수집 방법</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>카카오 소셜 로그인을 통한 이용자 동의 후 수집</li>
                <li>회원가입, 내 정보, 이력서·계약 서류 업로드 화면에서 이용자가 직접 입력</li>
                <li>서비스 이용 과정에서 자동으로 생성·수집</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">3. 개인정보의 처리 및 보유 기간</h2>
          <p>
            회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 동의받은 기간 내에서
            개인정보를 처리·보유합니다. 각 개인정보 처리 목적이 달성된 경우 해당 개인정보는 지체
            없이 파기합니다.
          </p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>회원 정보(프로필, 경력·학력·자격증, 이력서, 계약·정산 정보 포함): 회원 탈퇴 후 30일간 보관 후 파기. 단, 관계 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간까지 보관합니다.</li>
            <li>프로젝트 지원 내역: 회원 정보와 동일하게 회원 탈퇴 후 30일간 보관 후 파기</li>
            <li>카카오 알림톡 발송 이력: 발송 확인 및 민원 처리를 위해 회원 탈퇴 시까지 보관</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 이용자의 개인정보를 &quot;1. 개인정보의 처리 목적&quot;에서 명시한 범위 내에서만
            처리하며, 이용자의 동의 없이는 원칙적으로 제3자에게 제공하지 않습니다. 다만, 다음의
            경우에는 예외로 합니다.
          </p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>이용자가 사전에 별도로 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에서 정한 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">5. 개인정보 처리업무의 위탁</h2>
          <p>회사는 서비스 제공을 위하여 아래와 같이 개인정보 처리업무를 위탁하고 있으며, 위탁계약 체결 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.</p>
          <div className="overflow-x-auto -mx-2 px-2 mt-2">
            <table className="w-full text-xs border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-3 py-2 text-left">수탁업체</th>
                  <th className="border border-border px-3 py-2 text-left">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">Supabase, Inc.</td>
                  <td className="border border-border px-3 py-2">데이터베이스, 인증, 파일(이력서·계약서류) 저장소 운영</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">카카오(주)</td>
                  <td className="border border-border px-3 py-2">카카오 소셜 로그인 인증, 카카오 알림톡 발송</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">Vercel Inc.</td>
                  <td className="border border-border px-3 py-2">서비스 호스팅, 이용 통계·성능 분석</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">6. 정보주체의 권리·의무 및 행사방법</h2>
          <p>이용자는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있는 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
          <p className="mt-2">
            위 권리 행사는 서비스 내 &quot;내 정보&quot; 및 &quot;설정&quot; 메뉴를 통해 직접 열람·정정할
            수 있으며, 계정 삭제는 &quot;설정 &gt; 회원 탈퇴&quot;를 통해 요청할 수 있습니다. 그 밖의
            문의는 아래 개인정보 보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이
            조치하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">7. 쿠키(Cookie) 등 자동 수집 장치의 설치·운영 및 거부</h2>
          <p>
            회사는 로그인 상태 유지 등을 위해 쿠키를 사용합니다. 회원가입 진행 중에는 카카오 계정
            연동 확인을 위한 임시 쿠키가 사용되며, 회원가입 완료 또는 일정 시간 경과 시 자동으로
            삭제됩니다. &quot;최근 본 프로젝트&quot; 목록은 서버로 전송되지 않고 이용자의 브라우저
            로컬 저장소(localStorage)에만 저장됩니다. 이용자는 브라우저 설정을 통해 쿠키 저장을
            거부할 수 있으나, 이 경우 로그인 등 서비스 이용에 제약이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">8. 개인정보의 안전성 확보조치</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>비밀번호는 클라이언트에서 암호화하여 전송받은 후 암호화된 형태로 저장하며, 회사를 포함해 어느 누구도 이용자의 비밀번호를 조회할 수 없습니다.</li>
            <li>데이터베이스 접근 제어(행 단위 보안 정책)를 통해 이용자 본인의 정보만 조회·수정할 수 있도록 제한합니다.</li>
            <li>이력서, 사업자등록증, 계좌 사본 등 첨부파일은 비공개(private) 저장소에 보관되며, 본인 확인된 요청에 한해 임시 접근 권한(서명된 URL)으로만 다운로드할 수 있습니다.</li>
            <li>개인정보를 취급하는 임직원을 최소한으로 지정하고, 취급자를 대상으로 개인정보 보호 교육을 실시합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">9. 개인정보 보호책임자</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul className="mt-2 space-y-1">
            <li>상호 : &quot;(주)테크밋&quot;</li>
            <li>전화 : 010-8497-5877</li>
            <li>e-mail : lawzone.corp@gmail.com</li>
          </ul>
          <p className="mt-2">
            이용자는 회사의 서비스를 이용하며 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제
            등에 관한 사항을 개인정보 보호책임자에게 문의할 수 있습니다. 회사는 이용자의 문의에 대해
            지체 없이 답변 및 처리해 드릴 것입니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">10. 권익침해 구제방법</h2>
          <p>
            이용자는 개인정보침해로 인한 구제를 받기 위하여 아래 기관에 분쟁해결이나 상담 등을
            신청할 수 있습니다.
          </p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>개인정보분쟁조정위원회 : (국번없이) 1833-6972 / www.kopico.go.kr</li>
            <li>개인정보침해신고센터 : (국번없이) 118 / privacy.kisa.or.kr</li>
          </ul>
        </section>

        <p>
          본 개인정보 처리방침은 관련 법령 및 회사의 정책 변화에 따라 수시로 변경될 수 있으며,
          내용이 변경되는 경우 이 페이지를 통해 고지합니다. 변경사항에 의문이 있으실 때엔 언제든
          개인정보 보호책임자(lawzone.corp@gmail.com)에게 문의해 주십시오.
        </p>
      </div>
    </div>
  );
}
