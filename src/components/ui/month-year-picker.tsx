"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface MonthYearPickerProps {
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  name?: string;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function parseMonthYear(v: string): { year: string; month: string } {
  if (!v) return { year: "", month: "" };
  const parts = v.slice(0, 7).split("-");
  return { year: (parts[0] ?? "").slice(0, 4), month: parts[1] ?? "" };
}

export function MonthYearPicker({
  value,
  onChange,
  defaultValue,
  name,
  minYear,
  maxYear,
  disabled,
  error,
  className,
}: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const effectiveMinYear = minYear ?? 1960;
  const effectiveMaxYear = maxYear ?? currentYear + 1;

  const initial = parseMonthYear(value ?? defaultValue ?? "");
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [yearError, setYearError] = useState("");
  const [prevValue, setPrevValue] = useState(value);

  // value prop이 외부에서 바뀌면 내부 상태 동기화 (렌더 중 보정 — effect 불필요)
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      const parsed = parseMonthYear(value);
      setYear(parsed.year);
      setMonth(parsed.month);
    }
  }

  // 4자리 연도와 월이 모두 있을 때만 값 생성
  const computed = year.length === 4 && month ? `${year}-${month}` : "";

  function handleYearChange(y: string) {
    const safe = y.slice(0, 4);
    setYear(safe);
    if (yearError && safe.length === 4) setYearError("");
    const next = safe.length === 4 && month ? `${safe}-${month}` : "";
    onChange?.(next);
  }

  function handleMonthChange(m: string) {
    setMonth(m);
    const next = year.length === 4 && m ? `${year}-${m}` : "";
    onChange?.(next);
  }

  // 년도 키 입력: 숫자만 허용, 4자리 초과 차단 (선택 영역 없을 때)
  function handleYearKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      /^[0-9]$/.test(e.key) &&
      !e.ctrlKey && !e.metaKey &&
      e.currentTarget.value.length >= 4
    ) {
      const el = e.currentTarget;
      if (el.selectionStart === el.selectionEnd) {
        e.preventDefault();
      }
    }
  }

  // 년도 포커스 해제 시 유효성 검사 및 범위 보정
  function handleYearBlur() {
    if (!year) { setYearError(""); return; }
    if (year.length < 4) {
      setYearError("년도 4자리를 입력해주세요");
      return;
    }
    const num = Number(year);
    if (num < effectiveMinYear) { handleYearChange(String(effectiveMinYear)); }
    else if (num > effectiveMaxYear) { handleYearChange(String(effectiveMaxYear)); }
    setYearError("");
  }

  const fieldClass = (hasErr: boolean) =>
    cn(
      "h-10 px-2 rounded-lg border text-sm text-foreground bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent transition-all",
      hasErr ? "border-destructive/50" : "border-input",
      disabled && "opacity-40 cursor-not-allowed"
    );

  return (
    <div className={cn("flex gap-2 items-start", className)}>
      {name && <input type="hidden" name={name} value={computed} />}

      {/* 년도: 숫자 텍스트 입력 (4자리 고정) */}
      <div className="flex-1 flex flex-col">
        <input
          type="text"
          inputMode="numeric"
          value={year}
          onChange={(e) => {
            handleYearChange(e.target.value.replace(/\D/g, ""));
          }}
          onKeyDown={handleYearKeyDown}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
            handleYearChange(pasted);
          }}
          onBlur={handleYearBlur}
          autoComplete="off"
          placeholder="년도"
          maxLength={4}
          disabled={disabled}
          className={cn(fieldClass(!!yearError || !!error), "w-full text-center")}
          aria-label="년도"
          aria-invalid={!!yearError}
        />
        {yearError && (
          <p className="text-[10px] text-destructive mt-0.5 leading-tight">{yearError}</p>
        )}
      </div>

      {/* 월 */}
      <select
        value={month}
        onChange={(e) => handleMonthChange(e.target.value)}
        disabled={disabled}
        className={cn(fieldClass(!!error && !month), "flex-1 appearance-none")}
        aria-label="월"
      >
        <option value="">월</option>
        {MONTHS.map((label, i) => {
          const val = String(i + 1).padStart(2, "0");
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
    </div>
  );
}
