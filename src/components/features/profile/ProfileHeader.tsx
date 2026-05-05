import Link from "next/link";
import { Pencil } from "lucide-react";
import type { FreelancerProfile } from "@/types";

interface ProfileHeaderProps {
  profile: FreelancerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-zinc-950 px-5 pt-6 pb-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-white text-xl font-bold truncate">{profile.name}</h2>
          <Link
            href="/settings/profile"
            className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors rounded shrink-0"
            aria-label="내 정보 수정"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {profile.experienceYears !== null && (
            <span className="inline-flex items-center text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/80 px-2.5 py-1 rounded-lg font-medium">
              경력 {profile.experienceYears}년
            </span>
          )}
          {profile.phone && (
            <span className="text-xs text-zinc-600">{profile.phone}</span>
          )}
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mt-4">{profile.bio}</p>
      )}
    </div>
  );
}
