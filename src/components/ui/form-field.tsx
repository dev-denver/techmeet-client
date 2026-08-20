import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * 지정 시 에러/힌트 문단에 `${id}-message` id가 붙는다.
   * 내부 입력에 `aria-describedby={`${id}-message`}` / `aria-invalid={!!error}`를 함께 넘겨
   * 스크린리더가 에러를 필드와 연결해 읽도록 한다 (FormField가 children을 자동으로 연결해주지 않음).
   */
  id?: string;
}

export function FormField({
  label,
  required,
  optional,
  error,
  hint,
  children,
  className,
  id,
}: FormFieldProps) {
  const messageId = id ? `${id}-message` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {required && <span className="text-destructive text-xs leading-none">*</span>}
          {optional && <span className="text-xs text-muted-foreground font-normal">(선택)</span>}
        </div>
      )}
      {children}
      {error ? (
        <p id={messageId} className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
