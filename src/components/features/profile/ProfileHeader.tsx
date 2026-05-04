import Link from "next/link";
import { Pencil } from "lucide-react";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name.slice(0, 2);

  return (
    <div className="px-4 pt-5 pb-4 border-b">
      <div className="flex items-center gap-4">
        <div className="h-[72px] w-[72px] rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
          <span className="text-2xl font-bold text-zinc-600">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{profile.name}</h2>
            <Link
              href="/settings/profile"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded shrink-0"
              aria-label="내 정보 수정"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {profile.experienceYears !== null && (
              <span className="inline-flex items-center text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
                경력 {profile.experienceYears}년
              </span>
            )}
            {profile.phone && (
              <span className="text-xs text-muted-foreground">{profile.phone}</span>
            )}
          </div>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3 mt-3">{profile.bio}</p>
      )}
    </div>
  );
}
