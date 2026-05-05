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

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="pt-2 pb-1">
      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 기본 정보
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [militaryService, setMilitaryService] = useState("");

  // 소속 정보
  const [affiliation, setAffiliation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [department, setDepartment] = useState("");
  const [positionTitle, setPositionTitle] = useState("");

  // 연락처 및 주소
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 경력/기술/소개
  const [experienceYears, setExperienceYears] = useState(0);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json() as Promise<{ data: FreelancerProfile }>)
      .then(({ data }) => {
        setName(data.name);
        setBirthDate(data.birthDate?.slice(0, 10) ?? "");
        setGender((data.gender as "male" | "female" | "") ?? "");
        setMilitaryService(data.militaryService ?? "");
        setAffiliation(data.affiliation ?? "");
        setJoiningDate(data.joiningDate?.slice(0, 10) ?? "");
        setDepartment(data.department ?? "");
        setPositionTitle(data.positionTitle ?? "");
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
        setExperienceYears(data.experienceYears ?? 0);
        setTechStack(data.techStack);
        setBio(data.bio ?? "");
      })
      .catch(() => setServerError("프로필 정보를 불러올 수 없습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  function validate(): boolean {
    let valid = true;
    if (!name.trim()) { setNameError("이름을 입력해주세요"); valid = false; }
    else setNameError("");
    if (phone && !validatePhone(phone)) { setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)"); valid = false; }
    else setPhoneError("");
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
        body: JSON.stringify({
          name,
          birthDate: birthDate || null,
          gender: gender || null,
          militaryService: militaryService || null,
          affiliation: affiliation || null,
          joiningDate: joiningDate || null,
          department: department || null,
          positionTitle: positionTitle || null,
          phone,
          address: address || null,
          experienceYears,
          techStack,
          bio,
        }),
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-8">
      <div className="p-4 space-y-4">
        {/* 기본 정보 */}
        <SectionDivider label="기본 정보" />

        <FormField label="이름" required error={nameError}>
          <Input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(e.target.value.trim() ? "" : "이름을 입력해주세요"); }}
            className={nameError ? "border-red-300" : ""}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="생년월일" optional>
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </FormField>
          <FormField label="성별" optional>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
              className="w-full h-11 px-3 rounded-lg border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="">선택 안함</option>
              <option value="male">남</option>
              <option value="female">여</option>
            </select>
          </FormField>
        </div>

        <FormField label="병역 (역종)" optional>
          <Input type="text" value={militaryService} onChange={(e) => setMilitaryService(e.target.value)} placeholder="ex. 육군 병장 만기전역" />
        </FormField>

        {/* 소속 정보 */}
        <SectionDivider label="소속 정보" />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="소속" optional>
            <Input type="text" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="ex. 테크밋" />
          </FormField>
          <FormField label="입사일" optional>
            <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="부서" optional>
            <Input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="ex. 개발팀" />
          </FormField>
          <FormField label="직위" optional>
            <Input type="text" value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)} placeholder="ex. 시니어 개발자" />
          </FormField>
        </div>

        {/* 연락처 및 주소 */}
        <SectionDivider label="연락처 및 주소" />

        <FormField label="휴대폰 번호" optional error={phoneError} hint={!phoneError ? "010-XXXX-XXXX 형식" : undefined}>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(formatPhone(e.target.value)); if (phoneError) setPhoneError(""); }}
            onBlur={() => { if (phone && !validatePhone(phone)) setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)"); }}
            placeholder="010-0000-0000"
            maxLength={13}
            className={phoneError ? "border-red-300" : ""}
          />
        </FormField>

        <FormField label="주소" optional>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            placeholder="ex. 서울시 강남구 테헤란로 123"
          />
        </FormField>

        {/* 경력 / 기술 / 소개 */}
        <SectionDivider label="경력 및 기술" />

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
            <span className="w-16 text-center text-sm font-medium tabular-nums select-none">{experienceYears}년</span>
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
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="간단한 자기 소개를 작성해주세요" />
        </FormField>

        {serverError && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2.5">{serverError}</p>
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
          {saveSuccess ? (<><CheckCircle2 className="h-5 w-5" />저장되었습니다</>) : isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
