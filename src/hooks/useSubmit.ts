"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";

/**
 * 폼 제출 공통 훅 — setLoading/try-catch/에러 메시지 보일러플레이트를 공통화한다.
 *
 * fn 안에서 lib/api의 *Api 함수(apiFetch 기반)를 호출하면
 * 서버가 내려준 에러 메시지(ApiError)가 error state에 그대로 노출된다.
 *
 * @example
 * const { isLoading, error, submit } = useSubmit();
 * await submit(() => profileApi.deleteCareer(id), {
 *   onSuccess: () => { router.refresh(); onClose(); },
 * });
 */
export function useSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit<T>(
    fn: () => Promise<T>,
    opts?: { onSuccess?: (result: T) => void }
  ): Promise<boolean> {
    setError("");
    setIsLoading(true);
    try {
      const result = await fn();
      opts?.onSuccess?.(result);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "네트워크 오류가 발생했습니다");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, setError, submit };
}
