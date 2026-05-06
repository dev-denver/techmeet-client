"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { AvailabilityStatus } from "@/types";

interface AvailabilityToggleProps {
  status: AvailabilityStatus;
  availableFromDate: string | null;
  isDirty: boolean;
  onStatusChange: (status: AvailabilityStatus, availableFromDate?: string | null) => void;
}

const options = (
  Object.entries(AVAILABILITY_TOGGLE_CONFIG) as [AvailabilityStatus, { label: string; className: string }][]
).map(([value, config]) => ({ value, ...config }));

export function AvailabilityToggle({ status, availableFromDate, isDirty, onStatusChange }: AvailabilityToggleProps) {
  // 날짜 확인 전에도 버튼을 즉시 파란색으로 표시하기 위한 시각적 상태
  const [visualStatus, setVisualStatus] = useState<AvailabilityStatus>(status);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(availableFromDate ?? "");
  const [dateError, setDateError] = useState("");

  function handleButtonClick(newStatus: AvailabilityStatus) {
    setVisualStatus(newStatus);
    if (newStatus === AvailabilityStatus.Partial) {
      setShowDatePicker(true);
      setDateInput(availableFromDate ?? "");
      setDateError("");
      return;
    }
    setShowDatePicker(false);
    onStatusChange(newStatus, null);
  }

  function handleDateConfirm() {
    if (!dateInput) {
      setDateError("투입 가능 예정일을 선택해주세요");
      return;
    }
    setDateError("");
    setShowDatePicker(false);
    onStatusChange(AvailabilityStatus.Partial, dateInput);
  }

  function handleDateCancel() {
    setShowDatePicker(false);
    setVisualStatus(status); // 취소 시 원래 상태로 복원
  }

  const fromDateLabel = (() => {
    if (status !== AvailabilityStatus.Partial || !availableFromDate) return null;
    const d = new Date(availableFromDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일부터 가능`;
  })();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleButtonClick(option.value)}
              className={cn(
                "flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                visualStatus === option.value
                  ? option.className
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 날짜 선택 (투입 가능 예정 선택 시) */}
        {showDatePicker && (
          <div className="rounded-xl bg-status-info/5 border border-status-info/20 p-3 space-y-2.5">
            <label className="block text-xs font-semibold text-status-info">
              투입 가능 예정일을 선택해주세요
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => { setDateInput(e.target.value); setDateError(""); }}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 py-2.5 rounded-lg border border-input text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-status-info focus:border-transparent"
            />
            {dateError && <p className="text-xs text-destructive">{dateError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDateConfirm}
                className="flex-1 py-2 rounded-lg bg-status-info text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                확인
              </button>
              <button
                type="button"
                onClick={handleDateCancel}
                className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 날짜 표시 (투입 가능 예정 + 날짜 확정 시) */}
        {!showDatePicker && fromDateLabel && (
          <p className="text-xs text-status-info font-medium">{fromDateLabel}</p>
        )}

        {/* 변경 안내 */}
        {isDirty && !showDatePicker && (
          <p className="text-[11px] text-status-info bg-status-info/8 border border-status-info/20 rounded-lg px-2.5 py-1.5">
            아래 버튼을 눌러야 변경 내용이 저장됩니다.
          </p>
        )}

        <p className="text-[11px] text-muted-foreground">
          * 투입 상태는 담당 매니저에게 공유됩니다.
        </p>
      </div>
    </div>
  );
}
