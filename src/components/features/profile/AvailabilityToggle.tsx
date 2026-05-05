"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { AvailabilityStatus } from "@/types";

interface AvailabilityToggleProps {
  status: AvailabilityStatus;
  availableFromDate: string | null;
  onStatusChange: (status: AvailabilityStatus, availableFromDate?: string | null) => void;
}

const options = (
  Object.entries(AVAILABILITY_TOGGLE_CONFIG) as [AvailabilityStatus, { label: string; className: string }][]
).map(([value, config]) => ({ value, ...config }));

export function AvailabilityToggle({ status, availableFromDate, onStatusChange }: AvailabilityToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(availableFromDate ?? "");
  const [dateError, setDateError] = useState("");

  async function callApi(newStatus: AvailabilityStatus, date?: string | null) {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, availableFromDate: date }),
      });
      if (res.ok) {
        onStatusChange(newStatus, date);
        return true;
      }
    } catch {
      // ignore
    } finally {
      setIsUpdating(false);
    }
    return false;
  }

  async function handleButtonClick(newStatus: AvailabilityStatus) {
    if (isUpdating) return;
    if (newStatus === AvailabilityStatus.Partial) {
      setShowDatePicker(true);
      setDateInput(availableFromDate ?? "");
      setDateError("");
      return;
    }
    setShowDatePicker(false);
    await callApi(newStatus, null);
  }

  async function handleDateSave() {
    if (!dateInput) {
      setDateError("투입 가능 예정일을 선택해주세요");
      return;
    }
    setDateError("");
    const ok = await callApi(AvailabilityStatus.Partial, dateInput);
    if (ok) setShowDatePicker(false);
  }

  const fromDateLabel = (() => {
    if (status !== AvailabilityStatus.Partial || !availableFromDate) return null;
    const d = new Date(availableFromDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일부터 가능`;
  })();

  return (
    <div className="rounded-xl border border-zinc-100 bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleButtonClick(option.value)}
              disabled={isUpdating}
              className={cn(
                "flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
                status === option.value
                  ? option.className
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 날짜 선택 (투입 가능 예정 선택 시) */}
        {showDatePicker && (
          <div className="pt-1 space-y-2">
            <label className="block text-xs font-medium text-zinc-600">
              투입 가능 예정일 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => { setDateInput(e.target.value); setDateError(""); }}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
            {dateError && <p className="text-xs text-red-500">{dateError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleDateSave}
                disabled={isUpdating}
                className="flex-1 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 날짜 표시 */}
        {!showDatePicker && fromDateLabel && (
          <p className="text-xs text-zinc-500">{fromDateLabel}</p>
        )}

        <p className="text-[11px] text-zinc-400">
          * 투입 상태는 담당 매니저에게 공유됩니다.
        </p>
      </div>
    </div>
  );
}
