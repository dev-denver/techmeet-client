import Link from "next/link";
import { Pencil } from "lucide-react";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name.slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 px-4 pt-5 pb-6">
      <div className="flex items-center gap-4">
        <div className="h-[72px] w-[72px] rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-xl font-bold truncate">{profile.name}</h2>
            <Link
              href="/settings/profile"
              className="p-1 text-white/60 hover:text-white transition-colors rounded shrink-0"
              aria-label="내 정보 수정"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {profile.experienceYears !== null && (
              <span className="inline-flex items-center text-xs bg-white/15 text-white/80 px-2.5 py-0.5 rounded-full font-medium">
                경력 {profile.experienceYears}년
              </span>
            )}
            {profile.phone && (
              <span className="text-xs text-white/50">{profile.phone}</span>
            )}
          </div>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mt-4">{profile.bio}</p>
      )}
    </div>
  );
}
