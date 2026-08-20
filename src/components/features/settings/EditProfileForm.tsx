"use client";

import { useRouter } from "next/navigation";
import { ProfileBasicForm } from "@/components/features/profile/ProfileBasicForm";
import type { FreelancerProfile } from "@/types";

interface EditProfileFormProps {
  profile: FreelancerProfile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();

  return (
    <ProfileBasicForm
      initial={profile}
      onSuccess={() => {
        // 저장 성공 → 내 정보 페이지로 이동 + 서버 컴포넌트 재요청으로 최신화
        router.push("/profile");
        router.refresh();
      }}
    />
  );
}
