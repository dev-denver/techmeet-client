"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { validatePhone, formatPhone } from "@/lib/utils/validation";
import type { FreelancerProfile } from "@/types";

function TechStackInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTech() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTech();
            }
          }}
          placeholder="기술 입력 후 Enter"
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button
          type="button"
          onClick={addTech}
          className="px-3 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium"
        >
          추가
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full"
            >
              {tech}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tech))}
                aria-label={`${tech} 삭제`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
              className="w-24 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
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
