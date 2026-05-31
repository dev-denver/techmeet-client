import Link from "next/link";
import { ChevronRight, Shield, Info, UserCog, UserX } from "lucide-react";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { LogoutButton } from "@/components/features/settings/LogoutButton";
import { PageHero } from "@/components/ui/page-hero";
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
      className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 active:bg-muted transition-colors"
    >
      <span className={`flex items-center gap-2.5 text-sm ${danger ? "text-destructive" : ""}`}>
        <span className={danger ? "text-destructive/80" : "text-muted-foreground"}>{icon}</span>
        {label}
      </span>
      <ChevronRight className={`h-4 w-4 ${danger ? "text-destructive/50" : "text-muted-foreground"}`} />
    </Link>
  );
}

export default async function SettingsPage() {
  const result = await getProfile();
  const profile = result?.data;

  return (
    <div className="pb-8">
      {/* 프로필 요약 */}
      <PageHero className="pb-6">
        <p className="text-primary-foreground/50 text-xs font-medium tracking-wide">설정</p>
        <p className="text-primary-foreground font-bold text-lg leading-tight mt-0.5">{profile?.name ?? "-"}</p>
        <p className="text-primary-foreground/60 text-sm mt-1">{profile?.email ?? "-"}</p>
      </PageHero>

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
        <div className="pt-2 flex items-center justify-between px-1">
          <LogoutButton />
          <Link
            href="/settings/withdraw"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-1 py-1"
          >
            <UserX className="h-3.5 w-3.5" />
            회원 탈퇴
          </Link>
        </div>
      </div>
    </div>
  );
}
