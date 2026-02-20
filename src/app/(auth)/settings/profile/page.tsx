"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validatePhone, formatPhone } from "@/lib/utils/validation";
import { TechStackInput } from "@/components/features/profile/TechStackInput";
import { Skeleton } from "@/components/ui/skeleton";
import type { FreelancerProfile } from "@/types";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json() as Promise<{ data: FreelancerProfile }>)
      .then(({ data }) => {
        setName(data.name);
        setPhone(data.phone ?? "");
        setHeadline(data.headline);
        setBio(data.bio);
        setTechStack(data.techStack);
        setExperienceYears(data.experienceYears);
      })
      .catch(() => setError("프로필 정보를 불러올 수 없습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (phone && !validatePhone(phone)) {
      setError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, headline, bio, techStack, experienceYears }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "저장 중 오류가 발생했습니다.");
        return;
      }

      router.back();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="pb-8">
        <div className="p-4 space-y-5">
          {["이름", "휴대폰 번호", "한 줄 소개"].map((label) => (
            <div key={label} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
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
        {/* 이름 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* 휴대폰 번호 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">휴대폰 번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            maxLength={13}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* 한 줄 소개 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">한 줄 소개</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="ex) 5년차 React 프론트엔드 개발자"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* 경력 연수 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">경력 연수</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              max={50}
              className="w-24 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <span className="text-sm text-zinc-600">년</span>
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">기술 스택</label>
          <TechStackInput value={techStack} onChange={setTechStack} />
        </div>

        {/* 자기 소개 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">자기 소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="간단한 자기 소개를 작성해주세요"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
