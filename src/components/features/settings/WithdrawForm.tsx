"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { useToast } from "@/components/ui/toast";
import { useSubmit } from "@/hooks/useSubmit";
import { authApi } from "@/lib/api/auth";
import { encryptPassword } from "@/lib/crypto/client";
import { cn } from "@/lib/utils/cn";

interface WithdrawFormProps {
  /** 진행 중(취소 대상)인 지원 건수 — 탈퇴 경고 문구를 구체화하는 용도 */
  activeApplicationCount: number;
}

export function WithdrawForm({ activeApplicationCount }: WithdrawFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, error, setError, submit } = useSubmit();
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleWithdraw() {
    setError("");
    if (!confirmed) return;
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요");
      return;
    }
    setPasswordError("");

    await submit(
      async () => {
        const { publicKey } = await authApi.getPublicKey();
        const encryptedPassword = await encryptPassword(password, publicKey);
        return authApi.withdraw({ encryptedPassword });
      },
      {
        onSuccess: () => {
          showToast("탈퇴가 완료되었습니다");
          router.replace("/login");
        },
        onError: (message) => {
          if (message.includes("비밀번호")) {
            setPasswordError(message);
          } else {
            setError(message);
          }
        },
      }
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 경고 아이콘 */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-lg font-bold text-center">회원 탈퇴</h2>
      </div>

      {/* 안내 내용 */}
      <div className="bg-muted rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">탈퇴 전 꼭 확인해주세요</p>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>탈퇴 후 로그인이 불가합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>
              {activeApplicationCount > 0
                ? `진행 중인 지원 내역 ${activeApplicationCount}건이 모두 취소됩니다.`
                : "진행 중인 지원 내역이 없습니다."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>개인정보는 탈퇴 후 30일간 보관 후 파기됩니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive/70 mt-0.5 shrink-0">•</span>
            <span>탈퇴 후에도 신규 회원으로 다시 가입하실 수 있습니다. (기존 정보는 복구되지 않습니다)</span>
          </li>
        </ul>
      </div>

      {/* 본인 확인 */}
      <FormField label="비밀번호" required error={passwordError}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            placeholder="본인 확인을 위해 비밀번호를 입력해주세요"
            className={cn("pr-10", passwordError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      {/* 동의 체크박스 */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <span className="text-sm text-foreground/80">
          위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
        </span>
      </label>

      <ErrorMessage>{error}</ErrorMessage>

      <div className="space-y-3">
        <Button
          variant="destructive"
          onClick={handleWithdraw}
          disabled={!confirmed || isLoading}
          aria-busy={isLoading || undefined}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? "처리 중..." : "회원 탈퇴"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full h-12 text-base font-semibold"
        >
          취소
        </Button>
      </div>
    </div>
  );
}
