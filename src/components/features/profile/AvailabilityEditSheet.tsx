"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AVAILABILITY_TOGGLE_CONFIG } from "@/lib/constants";
import { AvailabilityStatus } from "@/types";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SaveButton } from "@/components/ui/save-button";
import { DateSelectPicker } from "@/components/ui/date-select-picker";
import { validateFutureDate } from "@/lib/utils/validation";

interface AvailabilityEditSheetProps {
  open: boolean;
  onClose: () => void;
  status: AvailabilityStatus;
  availableFromDate: string | null;
  onSave: (status: AvailabilityStatus, availableFromDate: string | null) => Promise<boolean>;
}

const options = (
  Object.entries(AVAILABILITY_TOGGLE_CONFIG) as [AvailabilityStatus, { label: string; className: string }][]
).map(([value, config]) => ({ value, ...config }));

/**
 * 투입 가능 상태 변경 시트 — 자주 바뀌지 않는 값이므로 기본정보 탭에서는 요약만 노출하고 변경은 여기서 처리.
 * 호출 측에서 `key={open ? "open" : "closed"}`로 렌더링해 열릴 때마다 현재 저장된 값으로 재초기화한다.
 */
export function AvailabilityEditSheet({ open, onClose, status, availableFromDate, onSave }: AvailabilityEditSheetProps) {
  const [selected, setSelected] = useState<AvailabilityStatus>(status);
  const [dateInput, setDateInput] = useState(availableFromDate ?? "");
  const [dateError, setDateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleSelect(next: AvailabilityStatus) {
    setSelected(next);
    if (next !== AvailabilityStatus.Partial) setDateError("");
  }

  async function handleSave() {
    let dateToSave: string | null = null;
    if (selected === AvailabilityStatus.Partial) {
      if (!dateInput) { setDateError("투입 가능 예정일을 선택해주세요"); return; }
      const err = validateFutureDate(dateInput);
      if (err) { setDateError(err); return; }
      dateToSave = dateInput;
    }
    setIsSaving(true);
    const ok = await onSave(selected, dateToSave);
    setIsSaving(false);
    if (ok) onClose();
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      header={
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">투입 가능 상태 변경</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xs font-medium rounded-md px-2 py-1.5 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            닫기
          </button>
        </div>
      }
      footer={
        <div className="px-5 py-4">
          <SaveButton type="button" onClick={handleSave} isLoading={isSaving} />
        </div>
      }
    >
      <div className="px-5 py-4 space-y-3">
        <div className="flex gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected === option.value
                  ? option.className
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selected === AvailabilityStatus.Partial && (
          <div className="rounded-xl bg-status-info/5 border border-status-info/20 p-3 space-y-2.5">
            <label className="block text-xs font-semibold text-status-info">
              투입 가능 예정일을 선택해주세요
            </label>
            <DateSelectPicker
              value={dateInput}
              onChange={(v) => { setDateInput(v); setDateError(""); }}
              minDate={new Date().toISOString().slice(0, 10)}
              error={!!dateError}
            />
            {dateError && <p className="text-xs text-destructive">{dateError}</p>}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          * 투입 상태는 담당 매니저에게 공유됩니다.
        </p>
      </div>
    </BottomSheet>
  );
}
