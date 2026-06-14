import Link from "next/link";
import { Pencil } from "lucide-react";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-primary px-5 pt-6 pb-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-primary-foreground text-xl font-bold truncate">{profile.name}</h2>
          <Link
            href="/settings/profile"
            className="p-1 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors rounded shrink-0"
            aria-label="내 정보 수정"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {profile.phone && (
            <span className="text-xs text-primary-foreground/50">{profile.phone}</span>
          )}
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-primary-foreground/60 leading-relaxed line-clamp-3 mt-4">{profile.bio}</p>
      )}
    </div>
  );
}
