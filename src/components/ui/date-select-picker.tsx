"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface DateSelectPickerProps {
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  name?: string;
  minYear?: number;
  maxYear?: number;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDate(v: string): { year: string; month: string; day: string } {
  if (!v) return { year: "", month: "", day: "" };
  const parts = v.slice(0, 10).split("-");
  return { year: (parts[0] ?? "").slice(0, 4), month: parts[1] ?? "", day: parts[2] ?? "" };
}

export function DateSelectPicker({
  value,
  onChange,
  defaultValue,
  name,
  minYear,
  maxYear,
  minDate,
  maxDate,
  disabled,
  error,
  className,
}: DateSelectPickerProps) {
  const currentYear = new Date().getFullYear();
  const effectiveMinYear = minYear ?? 1900;
  const effectiveMaxYear = maxYear ?? currentYear + 1;

  // minDate / maxDate 에서 연도 범위 추가 보정
  const minDateYear = minDate ? Number(minDate.slice(0, 4)) : null;
  const maxDateYear = maxDate ? Number(maxDate.slice(0, 4)) : null;
  const actualMinYear = minDateYear ? Math.max(effectiveMinYear, minDateYear) : effectiveMinYear;
  const actualMaxYear = maxDateYear ? Math.min(effectiveMaxYear, maxDateYear) : effectiveMaxYear;

  const initial = parseDate(value ?? defaultValue ?? "");
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [yearError, setYearError] = useState("");
  const [prevValue, setPrevValue] = useState(value);

  // value prop이 외부에서 바뀌면 내부 상태 동기화 (렌더 중 보정 — effect 불필요)
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      const parsed = parseDate(value);
      setYear(parsed.year);
      setMonth(parsed.month);
      setDay(parsed.day);
    }
  }

  // 4자리 연도 + 월 + 일이 모두 있을 때만 날짜 문자열 생성
  function buildValue(y: string, m: string, d: string): string {
    if (!y || y.length !== 4 || !m || !d) return "";
    return `${y}-${m}-${d}`;
  }

  function clampDay(y: string, m: string, d: string): string {
    if (!y || y.length !== 4 || !m || !d) return d;
    const maxDay = getDaysInMonth(Number(y), Number(m));
    const clamped = Math.min(Number(d), maxDay);
    return String(clamped).padStart(2, "0");
  }

  function handleYearChange(y: string) {
    const safe = y.slice(0, 4);
    setYear(safe);
    if (yearError && safe.length === 4) setYearError("");
    const clamped = safe.length === 4 ? clampDay(safe, month, day) : day;
    if (clamped !== day) setDay(clamped);
    onChange?.(buildValue(safe, month, clamped));
  }

  function handleMonthChange(m: string) {
    setMonth(m);
    const clamped = clampDay(year, m, day);
    if (clamped !== day) setDay(clamped);
    onChange?.(buildValue(year, m, clamped));
  }

  function handleDayChange(d: string) {
    setDay(d);
    onChange?.(buildValue(year, month, d));
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
    if (num < actualMinYear) {
      handleYearChange(String(actualMinYear));
    } else if (num > actualMaxYear) {
      handleYearChange(String(actualMaxYear));
    }
    setYearError("");
  }

  const computed = buildValue(year, month, day);

  const daysInCurrentMonth =
    year.length === 4 && month ? getDaysInMonth(Number(year), Number(month)) : 31;

  const minDateParsed = minDate ? parseDate(minDate) : null;
  const maxDateParsed = maxDate ? parseDate(maxDate) : null;

  function isMonthDisabled(m: number): boolean {
    if (!year || year.length !== 4) return false;
    const yNum = Number(year);
    if (minDateParsed) {
      if (yNum < Number(minDateParsed.year)) return true;
      if (yNum === Number(minDateParsed.year) && m < Number(minDateParsed.month)) return true;
    }
    if (maxDateParsed) {
      if (yNum > Number(maxDateParsed.year)) return true;
      if (yNum === Number(maxDateParsed.year) && m > Number(maxDateParsed.month)) return true;
    }
    return false;
  }

  function isDayDisabled(d: number): boolean {
    if (!year || year.length !== 4 || !month) return false;
    const dStr = String(d).padStart(2, "0");
    const v = buildValue(year, month, dStr);
    if (!v) return false;
    if (minDate && v < minDate) return true;
    if (maxDate && v > maxDate) return true;
    return false;
  }

  const fieldClass = (hasErr: boolean) =>
    cn(
      "h-10 px-2 rounded-lg border text-sm text-foreground bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent transition-all",
      hasErr ? "border-destructive/50" : "border-input",
      disabled && "opacity-40 cursor-not-allowed"
    );

  return (
    <div className={cn("flex gap-1.5 items-start", className)}>
      {name && <input type="hidden" name={name} value={computed} />}

      {/* 년도: 숫자 텍스트 입력 (4자리 고정) */}
      <div className="flex-[2] flex flex-col">
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
          return (
            <option key={val} value={val} disabled={isMonthDisabled(i + 1)}>{label}</option>
          );
        })}
      </select>

      {/* 일 */}
      <select
        value={day}
        onChange={(e) => handleDayChange(e.target.value)}
        disabled={disabled}
        className={cn(fieldClass(!!error && !day), "flex-1 appearance-none")}
        aria-label="일"
      >
        <option value="">일</option>
        {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((d) => {
          const val = String(d).padStart(2, "0");
          return (
            <option key={val} value={val} disabled={isDayDisabled(d)}>{d}일</option>
          );
        })}
      </select>
    </div>
  );
}
