"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface NavLinkProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick" | "onKeyDown" | "role" | "tabIndex"
> {
  href: string;
  /** 마운트 시 router.prefetch 수행 (기본 true) */
  prefetch?: boolean;
  /** 렌더링할 태그 (기본 "div"). <p> 등 phrasing content 내부의 인라인 텍스트 링크는 "span" 사용 — div는 p의 자식으로 올 수 없어 하이드레이션 에러가 발생한다 */
  as?: "div" | "span";
}

/**
 * 내부 페이지 이동용 Link 대체 컴포넌트.
 * <a href>는 모바일에서 블루투스 마우스 호버 시 하단에 주소가 노출되므로,
 * role="link" + router.push로 클릭/Enter 키 이동을 처리해 주소 노출을 방지한다.
 */
export function NavLink({
  href,
  className,
  children,
  prefetch = true,
  as: Tag = "div",
  ...rest
}: NavLinkProps) {
  const router = useRouter();

  useEffect(() => {
    if (prefetch) router.prefetch(href);
  }, [router, href, prefetch]);

  return (
    <Tag
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(href);
        }
      }}
      className={cn(
        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
