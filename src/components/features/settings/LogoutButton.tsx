"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      alert("로그아웃에 실패했습니다");
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 text-red-500 text-sm font-medium hover:opacity-70 transition-opacity w-full py-2 disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
