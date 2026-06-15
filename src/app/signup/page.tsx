import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignupForm } from "./SignupForm";

interface SignupPageProps {
  searchParams: Promise<{ name?: string; kakao_id?: string; ref?: string; birth_date?: string; phone?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const cookieStore = await cookies();
  const email = cookieStore.get("signup_email")?.value;

  if (!email) {
    redirect("/login");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg">
      <div className="w-full max-w-[600px] min-h-screen bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.06)] md:shadow-xl flex flex-col px-6 py-12 overflow-y-auto">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-xl font-bold">T</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">회원가입</h1>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-zinc-400">로딩 중...</div>}>
          <SignupForm
            email={email}
            kakaoId={params.kakao_id ?? ""}
            name={params.name ?? ""}
            birthDate={params.birth_date ?? ""}
            phone={params.phone ?? ""}
            refParam={params.ref ?? ""}
          />
        </Suspense>
      </div>
    </div>
  );
}
