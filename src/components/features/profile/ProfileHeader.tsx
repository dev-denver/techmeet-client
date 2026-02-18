import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name
    .split("")
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Avatar className="h-16 w-16">
        {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
        <AvatarFallback className="text-lg font-semibold bg-zinc-200">
          {initials}
        </AvatarFallback>
      </Avatar>
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
