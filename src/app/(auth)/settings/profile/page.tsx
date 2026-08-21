import type { Metadata } from "next";
import { ErrorMessage } from "@/components/ui/error-message";
import { EditProfileForm } from "@/components/features/settings/EditProfileForm";
import { getProfile } from "@/lib/supabase/queries/profile";
import { PAGE_TITLES } from "@/lib/constants";

export const metadata: Metadata = { title: PAGE_TITLES["/settings/profile"] };

export default async function EditProfilePage() {
  const result = await getProfile();
  const profile = result?.data;

  if (!profile) {
    return (
      <div className="p-4">
        <ErrorMessage size="sm">프로필 정보를 불러올 수 없습니다.</ErrorMessage>
      </div>
    );
  }

  return (
    <div className="p-4 pb-8">
      <EditProfileForm profile={profile} />
    </div>
  );
}
