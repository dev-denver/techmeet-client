import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { AvailabilityToggle } from "@/components/features/profile/AvailabilityToggle";
import { CareerSection } from "@/components/features/profile/CareerSection";
import { TechStackSection } from "@/components/features/profile/TechStackSection";
import { getProfile } from "@/lib/supabase/queries/profile";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
  const result = await getProfile();
  const profile = result?.data;

  if (!profile) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            프로필 정보를 불러올 수 없습니다.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <ProfileHeader profile={profile} />
      <AvailabilityToggle initialStatus={profile.availabilityStatus} />
      <TechStackSection techStack={profile.techStack} />
      <CareerSection careers={profile.careers} />

      {/* 자기 소개 */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold">자기 소개</h3>
        <p className="text-sm text-zinc-700 leading-relaxed">{profile.bio}</p>
      </div>
    </div>
  );
}
