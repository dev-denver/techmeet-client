import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  optional,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-zinc-700">{label}</span>
          {required && <span className="text-red-500 text-xs leading-none">*</span>}
          {optional && <span className="text-xs text-zinc-400 font-normal">(선택)</span>}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
