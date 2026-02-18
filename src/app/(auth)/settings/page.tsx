import { ChevronRight, LogOut, Shield, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { mockProfile } from "@/lib/utils/mockData";

export default function SettingsPage() {
  const profile = mockProfile;

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
            <span className="text-sm font-medium">{profile.name}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">이메일</span>
            <span className="text-sm font-medium">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">카카오 ID</span>
            <span className="text-sm font-medium">{profile.kakaoId ?? "-"}</span>
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="p-4 pb-0 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          알림 설정
        </h3>
      </div>
      <NotificationSettings />

      {/* 앱 정보 */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          앱 정보
        </h3>
        <div className="space-y-1">
          <button className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity">
            <span className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              개인정보 처리방침
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity">
            <span className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              이용약관
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">앱 버전</span>
            <span className="text-sm text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* 로그아웃 */}
      <div className="p-4">
        <button className="flex items-center gap-2 text-red-500 text-sm font-medium hover:opacity-70 transition-opacity w-full py-2">
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
