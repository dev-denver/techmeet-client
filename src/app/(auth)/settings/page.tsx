import Link from "next/link";
import { ChevronRight, Shield, Info, UserCog, UserX, LogOut } from "lucide-react";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { LogoutButton } from "@/components/features/settings/LogoutButton";
import { getProfile } from "@/lib/supabase/queries/profile";
import { ReferrerSection } from "@/components/features/referrer/ReferrerSection";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground font-medium mb-1.5 px-1">{children}</p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function LinkRow({
  href,
  icon,
  label,
  danger,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
    >
      <span className={`flex items-center gap-2.5 text-sm ${danger ? "text-red-500" : ""}`}>
        <span className={danger ? "text-red-400" : "text-muted-foreground"}>{icon}</span>
        {label}
      </span>
      <ChevronRight className={`h-4 w-4 ${danger ? "text-red-300" : "text-muted-foreground"}`} />
    </Link>
  );
}

export default async function SettingsPage() {
  const result = await getProfile();
  const profile = result?.data;

  return (
    <div className="pb-8">
      {/* 프로필 요약 */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 px-4 pt-5 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-white">
              {profile?.name?.slice(0, 2) ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{profile?.name ?? "-"}</p>
            <p className="text-white/50 text-sm mt-0.5">{profile?.email ?? "-"}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 계정 */}
        <div>
          <SectionLabel>계정</SectionLabel>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            {profile?.phone && <InfoRow label="전화번호" value={profile.phone} />}
            <ReferrerSection currentReferrerName={profile?.referrerName} />
            <LinkRow href="/settings/profile" icon={<UserCog className="h-4 w-4" />} label="내 정보 수정" />
          </div>
        </div>

        {/* 알림 설정 */}
        <div>
          <SectionLabel>알림 설정</SectionLabel>
          <div className="rounded-xl border bg-card overflow-hidden">
            <NotificationSettings />
          </div>
        </div>

        {/* 앱 정보 */}
        <div>
          <SectionLabel>앱 정보</SectionLabel>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            <LinkRow href="/privacy" icon={<Shield className="h-4 w-4" />} label="개인정보 처리방침" />
            <LinkRow href="/terms" icon={<Info className="h-4 w-4" />} label="이용약관" />
            <InfoRow label="앱 버전" value="v1.0.0" />
          </div>
        </div>

        {/* 로그아웃 / 회원탈퇴 */}
        <div className="pt-1 space-y-2.5">
          <LogoutButton />
          <Link
            href="/settings/withdraw"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <UserX className="h-4 w-4" />
            회원 탈퇴
          </Link>
        </div>
      </div>
    </div>
  );
}
