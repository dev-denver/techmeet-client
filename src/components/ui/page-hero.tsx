/**
 * 인증된 페이지 상단의 어두운 헤더 배경 래퍼.
 * bg-primary + 좌우 패딩(px-5)·상단 패딩(pt-6)·하단 패딩(pb-5)을 기본 제공한다.
 * 하단 패딩이 다른 페이지는 className으로 오버라이드: <PageHero className="pb-6">
 *
 * 홈(/) 히어로는 <section> 태그를 사용해야 해서 이 컴포넌트를 쓰지 않는다.
 */
import { cn } from "@/lib/utils/cn";

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHero({ children, className }: PageHeroProps) {
  return (
    <div className={cn("bg-primary px-5 pt-6 pb-5", className)}>
      {children}
    </div>
  );
}
