import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name.slice(0, 2);

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center shrink-0">
        <span className="text-lg font-semibold">{initials}</span>
      </div>
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
