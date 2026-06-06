"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileBasicForm } from "@/components/features/profile/ProfileBasicForm";
import { ErrorMessage } from "@/components/ui/error-message";
import { Skeleton } from "@/components/ui/skeleton";
import type { FreelancerProfile } from "@/types";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json() as Promise<{ data: FreelancerProfile }>)
      .then(({ data }) => setProfile(data))
      .catch(() => setLoadError("프로필 정보를 불러올 수 없습니다."))
      .finally(() => setIsLoading(false));
  }, []);

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

  if (!profile) {
    return (
      <div className="p-4">
        <ErrorMessage size="sm">{loadError || "프로필 정보를 불러올 수 없습니다."}</ErrorMessage>
      </div>
    );
  }

  return (
    <div className="p-4 pb-8">
      <ProfileBasicForm
        initial={profile}
        onSuccess={() => {
          // 저장 성공 → 내 정보 페이지로 이동 + 서버 컴포넌트 재요청으로 최신화
          router.push("/profile");
          router.refresh();
        }}
      />
    </div>
  );
}
