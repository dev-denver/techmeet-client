"use client";

import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
export { Plus, Pencil, Trash2, ChevronDown, ChevronUp };
import { SaveButton } from "@/components/ui/save-button";

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">
      {children}
    </span>
  );
}

export function CardWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 hover:border-muted-foreground transition-colors bg-background"
        >
          <Plus className="h-3 w-3" />
          추가
        </button>
      )}
    </div>
  );
}

export function EditDeleteActions({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        onClick={onDelete}
        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function DashedAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{label}</p>
      <p className="text-sm text-foreground font-medium">{value || "-"}</p>
    </div>
  );
}

export function FormInput({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2.5 rounded-lg border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background"
      />
    </div>
  );
}

export function FormSelect({
  label,
  children,
  required,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2.5 rounded-lg border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background"
      >
        {children}
      </select>
    </div>
  );
}

export function validateDateRange(start: string, end: string): string | null {
  if (!start || !end) return null;
  if (start > end) return "시작 날짜가 종료 날짜보다 늦을 수 없습니다";
  return null;
}

export function BottomSheetForm({
  title,
  open,
  onClose,
  onSubmit,
  isLoading,
  error,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-card rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs font-medium">닫기</button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {children}
          </div>
          <div className="px-5 py-4 border-t border-border shrink-0 space-y-2.5">
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}
            <SaveButton isLoading={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = (e.currentTarget.value || "").trim();
      if (val && !tags.includes(val)) onChange([...tags, val]);
      e.currentTarget.value = "";
    }
  }
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <div className="min-h-[42px] px-3 py-2 rounded-lg border border-input flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-red-300">×</button>
          </span>
        ))}
        <input
          type="text"
          placeholder={placeholder ?? "입력 후 Enter"}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-24 text-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
