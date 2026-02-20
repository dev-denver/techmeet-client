import { AvatarUpload } from "./AvatarUpload";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <AvatarUpload initialAvatarUrl={profile.avatarUrl} name={profile.name} />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground leading-snug mt-0.5">
          {profile.headline}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          경력 {profile.experienceYears}년
        </p>
      </div>
    </div>
  );
}
