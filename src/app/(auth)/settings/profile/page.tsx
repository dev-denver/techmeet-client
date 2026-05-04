"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { validatePhone, formatPhone } from "@/lib/utils/validation";
import { TechStackInput } from "@/components/features/profile/TechStackInput";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import type { FreelancerProfile } from "@/types";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json() as Promise<{ data: FreelancerProfile }>)
      .then(({ data }) => {
        setName(data.name);
        setPhone(data.phone ?? "");
        setBio(data.bio ?? "");
        setTechStack(data.techStack);
        setExperienceYears(data.experienceYears ?? 0);
      })
      .catch(() => setServerError("프로필 정보를 불러올 수 없습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  function validate(): boolean {
    let valid = true;

    if (!name.trim()) {
      setNameError("이름을 입력해주세요");
      valid = false;
    } else {
      setNameError("");
    }

    if (phone && !validatePhone(phone)) {
      setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)");
      valid = false;
    } else {
      setPhoneError("");
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, bio, techStack, experienceYears }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setServerError(data.error ?? "저장 중 오류가 발생했습니다.");
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => router.back(), 900);
    } catch {
      setServerError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="pb-8">
        <div className="p-4 space-y-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-8">
      <div className="p-4 space-y-5">
        <FormField label="이름" required error={nameError}>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(e.target.value.trim() ? "" : "이름을 입력해주세요");
            }}
            className={nameError ? "border-red-300" : ""}
          />
        </FormField>

        <FormField
          label="휴대폰 번호"
          optional
          error={phoneError}
          hint={!phoneError ? "010-XXXX-XXXX 형식" : undefined}
        >
          <Input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(formatPhone(e.target.value));
              if (phoneError) setPhoneError("");
            }}
            onBlur={() => {
              if (phone && !validatePhone(phone)) {
                setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)");
              }
            }}
            placeholder="010-0000-0000"
            maxLength={13}
            className={phoneError ? "border-red-300" : ""}
          />
        </FormField>

        <FormField label="경력 연수">
          <div className="flex items-center gap-0 border border-zinc-200 rounded-lg overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setExperienceYears((y) => Math.max(0, y - 1))}
              className="h-11 w-11 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 active:bg-zinc-100 transition-colors border-r border-zinc-200"
              aria-label="경력 연수 감소"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-16 text-center text-sm font-medium tabular-nums select-none">
              {experienceYears}년
            </span>
            <button
              type="button"
              onClick={() => setExperienceYears((y) => Math.min(50, y + 1))}
              className="h-11 w-11 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 active:bg-zinc-100 transition-colors border-l border-zinc-200"
              aria-label="경력 연수 증가"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </FormField>

        <FormField label="기술 스택" optional>
          <TechStackInput value={techStack} onChange={setTechStack} />
        </FormField>

        <FormField label="자기 소개" optional>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="간단한 자기 소개를 작성해주세요"
          />
        </FormField>

        {serverError && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2.5">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving || saveSuccess}
          className={cn(
            "w-full rounded-xl py-3.5 text-[15px] font-semibold transition-all flex items-center justify-center gap-2",
            saveSuccess
              ? "bg-green-600 text-white"
              : "bg-zinc-900 text-white hover:opacity-90 active:opacity-80 disabled:opacity-50"
          )}
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              저장되었습니다
            </>
          ) : isSaving ? (
            "저장 중..."
          ) : (
            "저장"
          )}
        </button>
      </div>
    </form>
  );
}
