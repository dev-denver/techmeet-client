/**
 * 폼 제출 후 서버에서 반환된 오류 메시지를 표시하는 컴포넌트.
 * children이 falsy(빈 문자열·undefined·null)면 렌더링하지 않는다.
 *
 * size: "xs" (기본, 인라인 폼용) | "sm" (BottomSheet 하단 등 좀 더 눈에 띄어야 할 때)
 *
 * 이 컴포넌트는 bg-destructive/10 배경이 있는 스타일에만 사용한다.
 * 배경 없는 단순 에러 텍스트(form-field, referrer 등)는 로컬 p 태그를 그대로 사용.
 */
import { cn } from "@/lib/utils/cn";

interface ErrorMessageProps {
  children: React.ReactNode;
  size?: "xs" | "sm";
  className?: string;
}

export function ErrorMessage({ children, size = "xs", className }: ErrorMessageProps) {
  if (!children) return null;
  return (
    <p
      className={cn(
        "text-destructive bg-destructive/10 rounded-lg px-3",
        size === "sm" ? "text-sm py-2.5" : "text-xs py-2",
        className
      )}
    >
      {children}
    </p>
  );
}
