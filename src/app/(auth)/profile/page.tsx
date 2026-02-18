import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { AvailabilityToggle } from "@/components/features/profile/AvailabilityToggle";
import { CareerSection } from "@/components/features/profile/CareerSection";
import { TechStackSection } from "@/components/features/profile/TechStackSection";
import { mockProfile } from "@/lib/utils/mockData";

export default function ProfilePage() {
  const profile = mockProfile;

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
