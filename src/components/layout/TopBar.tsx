"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils/cn";

const pageTitles: Record<string, string> = {
  "/": "홈",
  "/projects": "프로젝트",
  "/projects/applications": "내 신청 내역",
  "/profile": "내 정보",
  "/settings": "설정",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/projects/") && pathname !== "/projects/applications") {
    return "프로젝트 상세";
  }
  return "테크밋";
}

function isDetailPage(pathname: string): boolean {
  return (
    pathname.startsWith("/projects/") &&
    pathname !== "/projects" &&
    pathname !== "/projects/applications"
  );
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
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-14 bg-white z-50 flex items-center px-4 transition-shadow",
        scrolled ? "shadow-sm" : "border-b border-transparent"
      )}
    >
      <div className="flex items-center w-full gap-3">
        {showBackButton ? (
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 rounded-md hover:bg-accent transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}

        <h1 className="flex-1 text-base font-semibold">{title}</h1>

        {scrolled && !showBackButton ? (
          <button
            className="p-1 -mr-1 rounded-md hover:bg-accent transition-colors"
            aria-label="메뉴"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
