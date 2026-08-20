"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";

/** 회원가입 직후(?welcome=1) 홈 도착 시 완료 안내 토스트를 띄우고 쿼리를 정리한다 (렌더 없음) */
export function WelcomeToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const welcome = searchParams.get("welcome");

  useEffect(() => {
    if (welcome !== "1") return;
    showToast("가입을 환영합니다! 테크밋과 함께 시작해보세요");
    router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcome]);

  return null;
}
