"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/projects", label: "프로젝트", icon: FolderOpen },
  { href: "/profile", label: "내 정보", icon: User },
  { href: "/settings", label: "설정", icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 bg-white border-t border-border z-50">
      <div className="flex h-full">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
