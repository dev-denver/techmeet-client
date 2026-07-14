"use client";

import { useState } from "react";
import type { ContractDocument, FreelancerProfile } from "@/types";
import { AvailabilityStatus, ContractType } from "@/types";
import { AvailabilityEditSheet } from "./AvailabilityEditSheet";
import { CardWrap, FieldRow, SectionHeader, Tag } from "./tabs/TabShared";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AVAILABILITY_STATUS_CONFIG, CONTRACT_TYPE_CONFIG } from "@/lib/constants/status";
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
  onSaveAvailability: (status: AvailabilityStatus, availableFromDate: string | null) => Promise<boolean>;
}

/** 내 정보 > 기본정보 탭 (읽기 전용 뷰 + 투입 가능 상태 요약/변경) */
export function BasicInfoTab({ profile, availStatus, availFromDate, onSaveAvailability }: BasicInfoTabProps) {
  const [availSheetOpen, setAvailSheetOpen] = useState(false);
  const genderLabel = profile.gender === "male" ? "남" : profile.gender === "female" ? "여" : null;

  const availConfig = AVAILABILITY_STATUS_CONFIG[availStatus];
  const fromDateLabel = (() => {
    if (availStatus !== AvailabilityStatus.Partial || !availFromDate) return null;
    const d = new Date(availFromDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}부터`;
  })();

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <SectionHeader title="기본 정보" />
        <CardWrap>
          <div className="divide-y divide-border">
            <FieldRow label="이름" value={profile.name} />
            <div className="grid grid-cols-2 divide-x divide-border">
              <FieldRow label="성별" value={genderLabel} />
              <FieldRow
                label="생년월일"
                value={profile.birthDate ? profile.birthDate.slice(0, 10).replace(/-/g, ". ") : null}
              />
            </div>
            <FieldRow label="휴대폰번호" value={profile.phone} />
            <FieldRow label="이메일" value={profile.email} />
            <FieldRow label="주소" value={[profile.address, profile.addressDetail].filter(Boolean).join(" ") || null} />
          </div>
        </CardWrap>
      </div>

      {/* 기술 스택 */}
      <div>
        <SectionHeader title="기술 스택" />
        <CardWrap>
          <div className="p-4">
            {profile.techStack.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.techStack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 기술 스택이 없습니다.</p>
            )}
          </div>
        </CardWrap>
      </div>

      {/* 계약 정보 */}
      <div>
        <SectionHeader title="계약 정보" />
        <CardWrap>
          <div className="divide-y divide-border">
            <div className="px-4 py-3">
              <p className="text-[10px] text-muted-foreground font-medium mb-1">계약형태</p>
              {profile.contractType ? (
                <span className={cn("inline-flex text-xs font-semibold px-2 py-0.5 rounded-full", CONTRACT_TYPE_CONFIG[profile.contractType].className)}>
                  {CONTRACT_TYPE_CONFIG[profile.contractType].label}
                </span>
              ) : (
                <p className="text-sm text-foreground font-medium">-</p>
              )}
            </div>
            {profile.contractType === ContractType.Business && (
              <>
                <FieldRow label="사업자명" value={profile.businessName} />
                <FieldRow label="사업자 번호" value={profile.businessNumber} />
                <FieldRow label="사업장 주소" value={[profile.businessAddress, profile.businessAddressDetail].filter(Boolean).join(" ") || null} />
                <ContractDocumentRow label="사업자등록증" type="business-registration" document={profile.businessRegistrationFile} />
              </>
            )}
            <FieldRow label="은행" value={profile.bankName} />
            <FieldRow label="계좌번호" value={profile.bankAccountNumber} />
            <ContractDocumentRow label="계좌 이미지" type="bank-account-image" document={profile.bankAccountImage} />
          </div>
        </CardWrap>
      </div>

      {/* 투입 가능 상태 — 자주 바뀌지 않는 값이므로 요약만 노출, 변경은 시트에서 처리 */}
      <div>
        <SectionHeader title="투입 가능 상태" />
        <CardWrap>
          <button
            type="button"
            onClick={() => setAvailSheetOpen(true)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-muted/40 active:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0", availConfig.className)}>
                {availConfig.label}
              </span>
              {fromDateLabel && (
                <span className="text-xs text-muted-foreground truncate">{fromDateLabel}</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground shrink-0">
              <Pencil className="h-3.5 w-3.5" />
              변경
            </span>
          </button>
        </CardWrap>
        <p className="text-[11px] text-muted-foreground mt-2 px-1">
          * 투입 상태는 담당 매니저에게 공유됩니다.
        </p>
      </div>

      <AvailabilityEditSheet
        key={availSheetOpen ? "open" : "closed"}
        open={availSheetOpen}
        onClose={() => setAvailSheetOpen(false)}
        status={availStatus}
        availableFromDate={availFromDate}
        onSave={onSaveAvailability}
      />
    </div>
  );
}
