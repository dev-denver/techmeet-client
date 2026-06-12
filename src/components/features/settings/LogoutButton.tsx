"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useSubmit } from "@/hooks/useSubmit";
import { authApi } from "@/lib/api/auth";

export function LogoutButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading, submit } = useSubmit();

  async function handleLogout() {
    const success = await submit(() => authApi.logout());
    if (success) {
      router.replace("/login");
    } else {
      showToast("로그아웃에 실패했습니다", "error");
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      aria-busy={isLoading || undefined}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 px-2 py-2 -mx-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <LogOut className="h-3.5 w-3.5" />
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
