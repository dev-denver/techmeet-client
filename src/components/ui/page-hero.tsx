/**
 * 인증된 페이지 상단의 어두운 헤더 배경 래퍼.
 * bg-primary + 좌우 패딩(px-5)·상단 패딩(pt-6)·하단 패딩(pb-5)을 기본 제공한다.
 * 하단 패딩이 다른 페이지는 className으로 오버라이드: <PageHero className="pb-6">
 *
 * as: "div"(기본) | "section" — 시맨틱하게 <section>이 필요한 곳(예: 홈 히어로)에서 사용
 */
import { cn } from "@/lib/utils/cn";

interface PageHeroProps {
  as?: "div" | "section";
  children: React.ReactNode;
  className?: string;
}

export function PageHero({ as: Tag = "div", children, className }: PageHeroProps) {
  return (
    <Tag className={cn("bg-primary px-5 pt-6 pb-5", className)}>
      {children}
    </Tag>
  );
}
