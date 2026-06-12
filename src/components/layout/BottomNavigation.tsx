"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, FolderOpen, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/projects", label: "프로젝트", icon: FolderOpen },
  { href: "/profile", label: "내 정보", icon: User },
  { href: "/settings", label: "설정", icon: Settings },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Link의 자동 prefetch 대체: 하단 탭은 항상 노출되므로 마운트 시 전체 프리페치
  useEffect(() => {
    navItems.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-16 bg-background border-t border-border z-50">
      <div className="flex h-full">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <button
              key={href}
              type="button"
              onClick={() => router.push(href)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-2")}
              />
              <span className={cn("font-medium", isActive ? "font-semibold" : "")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
