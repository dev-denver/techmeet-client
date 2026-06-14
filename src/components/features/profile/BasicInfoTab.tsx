"use client";

import type { ContractDocument, FreelancerProfile } from "@/types";
import { AvailabilityStatus, ContractType } from "@/types";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { CardWrap, FieldRow, SectionHeader } from "./tabs/TabShared";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CONTRACT_TYPE_CONFIG } from "@/lib/constants/status";
import type { ContractDocumentType } from "@/lib/constants/contractDocuments";

function ContractDocumentRow({ label, type, document }: { label: string; type: ContractDocumentType; document: ContractDocument | null }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{label}</p>
      {document ? (
        <a
          href={`/api/profile/contract-documents/${type}/download`}
          download
          className="text-sm text-primary font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          {document.fileName}
        </a>
      ) : (
        <p className="text-sm text-foreground font-medium">-</p>
      )}
    </div>
  );
}

interface BasicInfoTabProps {
  profile: FreelancerProfile;
  availStatus: AvailabilityStatus;
  availFromDate: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onStatusChange: (status: AvailabilityStatus, date?: string | null) => void;
  onSave: () => void;
}

/** 내 정보 > 기본정보 탭 (읽기 전용 뷰 + 투입 가능 상태 토글/저장) */
export function BasicInfoTab({ profile, availStatus, availFromDate, isDirty, isSaving, onStatusChange, onSave }: BasicInfoTabProps) {
  const genderLabel = profile.gender === "male" ? "남" : profile.gender === "female" ? "여" : null;

  return (
    <div className="space-y-5">
      <div>
        <SectionHeader title="기본 정보" />
        <CardWrap>
          <div className="divide-y divide-border">
            <FieldRow label="이름" value={profile.name} />
            <FieldRow label="성별" value={genderLabel} />
            <FieldRow
              label="생년월일"
              value={profile.birthDate ? profile.birthDate.slice(0, 10).replace(/-/g, ". ") : null}
            />
          </div>
        </CardWrap>
      </div>

      <div>
        <SectionHeader title="연락처 및 주소" />
        <CardWrap>
          <div className="divide-y divide-border">
            <FieldRow label="휴대폰번호" value={profile.phone} />
            <FieldRow label="이메일" value={profile.email} />
            <FieldRow label="주소" value={profile.address} />
          </div>
        </CardWrap>
      </div>

      <div>
        <SectionHeader title="계약 정보" />
        <CardWrap>
          <div className="divide-y divide-border">
            <FieldRow
              label="계약형태"
              value={profile.contractType ? CONTRACT_TYPE_CONFIG[profile.contractType].label : null}
            />
            {profile.contractType === ContractType.Business && (
              <>
                <FieldRow label="사업자명" value={profile.businessName} />
                <FieldRow label="사업자 번호" value={profile.businessNumber} />
                <FieldRow label="사업장 주소" value={profile.businessAddress} />
                <ContractDocumentRow label="사업자등록증" type="business-registration" document={profile.businessRegistrationFile} />
              </>
            )}
            <FieldRow label="은행" value={profile.bankName} />
            <FieldRow label="계좌번호" value={profile.bankAccountNumber} />
            <ContractDocumentRow label="계좌 이미지" type="bank-account-image" document={profile.bankAccountImage} />
          </div>
        </CardWrap>
      </div>

      {/* 투입 가능 상태 — 수동 저장 방식 */}
      <div>
        <SectionHeader title="투입 가능 상태" />
        <AvailabilityToggle
          status={availStatus}
          availableFromDate={availFromDate}
          isDirty={isDirty}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* 투입 상태 저장 버튼 (변경 있을 때만) */}
      {isDirty && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          aria-busy={isSaving || undefined}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-base font-semibold transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:opacity-50 bg-status-info text-white hover:opacity-90 active:opacity-80"
          )}
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 shrink-0" />
              투입 상태 저장하기
            </>
          )}
        </button>
      )}

    </div>
  );
}
