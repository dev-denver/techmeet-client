export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white mx-auto max-w-[430px] px-6 py-10">
      <h1 className="text-xl font-bold mb-6">이용약관</h1>

      <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-base mb-2">제1조 (목적)</h2>
          <p>
            이 약관은 테크밋(이하 &quot;회사&quot;)이 운영하는 테크밋 프리랜서 플랫폼(이하 &quot;서비스&quot;)의
            이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제2조 (용어의 정의)</h2>
          <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ol className="list-decimal ml-4 mt-2 space-y-1">
            <li>&quot;서비스&quot;란 회사가 제공하는 프리랜서 개발자 전용 프로젝트 매칭 플랫폼을 의미합니다.</li>
            <li>&quot;회원&quot;이란 서비스에 가입하여 이 약관에 동의한 자를 의미합니다.</li>
            <li>&quot;프로젝트&quot;란 회사가 등록하는 개발 업무 공고를 의미합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제3조 (서비스 이용)</h2>
          <ol className="list-decimal ml-4 space-y-1">
            <li>서비스는 테크밋 소속 프리랜서 개발자만 이용할 수 있습니다.</li>
            <li>회원은 카카오 계정을 통해 가입 및 로그인할 수 있습니다.</li>
            <li>서비스는 프로젝트 조회, 지원, 프로필 관리 기능을 제공합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제4조 (회원의 의무)</h2>
          <ol className="list-decimal ml-4 space-y-1">
            <li>회원은 허위 정보를 등록해서는 안 됩니다.</li>
            <li>회원은 타인의 계정을 도용해서는 안 됩니다.</li>
            <li>회원은 서비스를 이용하여 불법적인 행위를 해서는 안 됩니다.</li>
            <li>회원은 회사의 사전 동의 없이 서비스를 이용하여 영업 활동을 할 수 없습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제5조 (서비스 이용 제한)</h2>
          <p>
            회사는 회원이 이 약관의 의무를 위반하거나, 서비스의 정상적인 운영을 방해한 경우
            서비스 이용을 제한하거나 회원 자격을 정지할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제6조 (회원 탈퇴)</h2>
          <p>
            회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴를 신청할 수 있습니다.
            탈퇴 시 개인정보는 관련 법령이 정한 기간 동안 보관 후 파기됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제7조 (책임 제한)</h2>
          <p>
            회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
            서비스 제공에 관한 책임이 면제됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">제8조 (준거법 및 관할법원)</h2>
          <p>
            이 약관에 관한 분쟁은 대한민국 법률에 따르며, 분쟁 발생 시 서울중앙지방법원을
            제1심 관할법원으로 합니다.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          시행일: 2025년 1월 1일
        </p>
      </div>
    </div>
  );
}
