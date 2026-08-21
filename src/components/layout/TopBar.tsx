"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils/cn";
import { NavLink } from "@/components/ui/nav-link";
import { PAGE_TITLES, PROJECT_DETAIL_TITLE, NOTICE_DETAIL_TITLE } from "@/lib/constants";

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/projects/") && pathname !== "/projects/applications") {
    return PROJECT_DETAIL_TITLE;
  }
  if (pathname.startsWith("/notices/")) {
    return NOTICE_DETAIL_TITLE;
  }
  return "테크밋";
}

function isDetailPage(pathname: string): boolean {
  if (
    pathname.startsWith("/projects/") &&
    pathname !== "/projects" &&
    pathname !== "/projects/applications"
  ) {
    return true;
  }
  if (pathname === "/settings/profile" || pathname === "/settings/password" || pathname === "/settings/withdraw") {
    return true;
  }
  if (pathname === "/notifications") {
    return true;
  }
  if (pathname.startsWith("/notices/")) {
    return true;
  }
  return false;
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrolled(10);
  const title = getTitle(pathname);
  const showBackButton = isDetailPage(pathname);

  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-14 bg-background z-50 flex items-center px-4 transition-colors border-b",
        scrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="flex items-center w-full gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 -ml-2.5 items-center justify-center rounded-md hover:bg-accent active:bg-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <h1 className="flex-1 text-base font-semibold">{title}</h1>

        {!showBackButton && (
          <NavLink
            href="/notifications"
            className="flex h-10 w-10 -mr-2.5 items-center justify-center rounded-md hover:bg-accent active:bg-accent/80 transition-colors"
            aria-label="알림 내역"
          >
            <History className="h-5 w-5" />
          </NavLink>
        )}
      </div>
    </header>
  );
}
