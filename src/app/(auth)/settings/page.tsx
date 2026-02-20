import Link from "next/link";
import { ChevronRight, Shield, Info, UserCog, UserX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { PushNotificationToggle } from "@/components/features/settings/PushNotificationToggle";
import { LogoutButton } from "@/components/features/settings/LogoutButton";
import { getProfile } from "@/lib/supabase/queries/profile";

export default async function SettingsPage() {
  const result = await getProfile();
  const profile = result?.data;

  return (
    <div className="pb-4">
      {/* 계정 정보 */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          계정
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">이름</span>
            <span className="text-sm font-medium">{profile?.name ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">이메일</span>
            <span className="text-sm font-medium">{profile?.email ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">카카오 ID</span>
            <span className="text-sm font-medium">{profile?.kakaoId ?? "-"}</span>
          </div>
          <Link
            href="/settings/profile"
            className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity"
          >
            <span className="flex items-center gap-2 text-sm">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              내 정보 수정
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="p-4 pb-0 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          알림 설정
        </h3>
      </div>
      <NotificationSettings />
      <PushNotificationToggle />

      {/* 앱 정보 */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          앱 정보
        </h3>
        <div className="space-y-1">
          <Link
            href="/privacy"
            className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity"
          >
            <span className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              개인정보 처리방침
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/terms"
            className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity"
          >
            <span className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              이용약관
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">앱 버전</span>
            <span className="text-sm text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* 로그아웃 + 회원탈퇴 */}
      <div className="p-4 space-y-3">
        <LogoutButton />
        <Link
          href="/settings/withdraw"
          className="flex w-full items-center justify-center rounded-xl border border-red-200 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <UserX className="h-4 w-4 mr-2" />
          회원 탈퇴
        </Link>
      </div>
    </div>
  );
}
