"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { SaveButton } from "@/components/ui/save-button";
import { PasswordStrength } from "@/components/features/signup/PasswordStrength";
import { useSubmit } from "@/hooks/useSubmit";
import { useToast } from "@/components/ui/toast";
import { validatePassword } from "@/lib/utils/validation";
import { encryptPassword } from "@/lib/crypto/client";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils/cn";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, error, setError, submit } = useSubmit();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentError, setCurrentError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  function validate(): boolean {
    let valid = true;

    if (!currentPassword) {
      setCurrentError("현재 비밀번호를 입력해주세요");
      valid = false;
    } else {
      setCurrentError("");
    }

    const { valid: pwValid, errors: pwErrors } = validatePassword(newPassword);
    if (!pwValid) {
      setNewError(pwErrors[0]);
      valid = false;
    } else if (newPassword === currentPassword) {
      setNewError("현재 비밀번호와 다른 비밀번호를 입력해주세요");
      valid = false;
    } else {
      setNewError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("비밀번호가 일치하지 않습니다");
      valid = false;
    } else {
      setConfirmError("");
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    await submit(
      async () => {
        const { publicKey } = await authApi.getPublicKey();
        const [encryptedCurrentPassword, encryptedNewPassword] = await Promise.all([
          encryptPassword(currentPassword, publicKey),
          encryptPassword(newPassword, publicKey),
        ]);
        return authApi.changePassword({ encryptedCurrentPassword, encryptedNewPassword });
      },
      {
        onSuccess: () => {
          showToast("비밀번호가 변경되었습니다");
          router.back();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5">
      <FormField label="현재 비밀번호" required error={currentError}>
        <div className="relative">
          <Input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (currentError) setCurrentError("");
            }}
            placeholder="현재 비밀번호를 입력해주세요"
            className={cn("pr-10", currentError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showCurrent ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      <FormField label="새 비밀번호" required error={newError}>
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (newError) {
                const { valid, errors } = validatePassword(e.target.value);
                setNewError(valid ? "" : errors[0]);
              }
              if (confirmError && confirmPassword) {
                setConfirmError(e.target.value !== confirmPassword ? "비밀번호가 일치하지 않습니다" : "");
              }
            }}
            placeholder="영문 소문자·숫자·특수문자 포함 8자 이상"
            className={cn("pr-10", newError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showNew ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={newPassword} />
      </FormField>

      <FormField label="새 비밀번호 확인" required error={confirmError}>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmError(e.target.value !== newPassword ? "비밀번호가 일치하지 않습니다" : "");
            }}
            placeholder="새 비밀번호를 다시 입력해주세요"
            className={cn("pr-10", confirmError ? "border-destructive/50" : "")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showConfirm ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      <ErrorMessage size="sm">{error}</ErrorMessage>

      <SaveButton isLoading={isLoading} label="비밀번호 변경" loadingLabel="변경 중..." />
    </form>
  );
}
