"use client";

import { useState } from "react";
import { SaveButton } from "@/components/ui/save-button";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  validatePhone,
  formatPhone,
  validateBirthDateWithMessage,
  validateBusinessNumber,
  formatBusinessNumber,
} from "@/lib/utils/validation";
import { TechStackInput } from "@/components/features/profile/TechStackInput";
import { KakaoAddressInput } from "@/components/features/profile/KakaoAddressInput";
import { ContractDocumentField } from "@/components/features/profile/ContractDocumentField";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateSelectPicker } from "@/components/ui/date-select-picker";
import { profileApi } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import { LIMITS } from "@/lib/constants/limits";
import { CONTRACT_TYPE_CONFIG } from "@/lib/constants/status";
import { ContractType } from "@/types";
import type { FreelancerProfile } from "@/types";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="pt-2 pb-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}

interface ProfileBasicFormProps {
  /** 초기값 (이미 로드된 프로필) */
  initial: FreelancerProfile;
  /** 저장 성공 후 호출 (예: 인라인 모드 종료 + refresh, 또는 페이지 이동) */
  onSuccess: () => void;
  /** 취소 버튼 핸들러. 지정 시 저장 버튼 옆에 취소 버튼 노출 (인라인 모드) */
  onCancel?: () => void;
}

/**
 * 기본정보 편집 폼 (이름/연락처/기술/소개/계약 정보).
 * /settings/profile 페이지와 내 정보 탭 인라인 편집에서 공유한다. PUT /api/profile 사용.
 */
export function ProfileBasicForm({ initial, onSuccess, onCancel }: ProfileBasicFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 기본 정보
  const [name, setName] = useState(initial.name);
  const [birthDate, setBirthDate] = useState(initial.birthDate?.slice(0, 10) ?? "");
  const [gender, setGender] = useState<"male" | "female" | "">((initial.gender as "male" | "female" | "") ?? "");

  // 연락처 및 주소
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [addressDetail, setAddressDetail] = useState(initial.addressDetail ?? "");

  // 기술/소개
  const [techStack, setTechStack] = useState<string[]>(initial.techStack);
  const [bio, setBio] = useState(initial.bio ?? "");

  // 계약 정보
  const [contractType, setContractType] = useState<ContractType | "">(initial.contractType ?? "");
  const [businessName, setBusinessName] = useState(initial.businessName ?? "");
  const [businessNumber, setBusinessNumber] = useState(initial.businessNumber ?? "");
  const [businessAddress, setBusinessAddress] = useState(initial.businessAddress ?? "");
  const [businessAddressDetail, setBusinessAddressDetail] = useState(initial.businessAddressDetail ?? "");
  const [bankName, setBankName] = useState(initial.bankName ?? "");
  const [bankAccountNumber, setBankAccountNumber] = useState(initial.bankAccountNumber ?? "");

  const [nameError, setNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [businessNumberError, setBusinessNumberError] = useState("");
  const [businessAddressError, setBusinessAddressError] = useState("");
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    let valid = true;
    if (!name.trim()) { setNameError("이름을 입력해주세요"); valid = false; }
    else if (name.trim().length > 50) { setNameError("이름은 50자 이하로 입력해주세요"); valid = false; }
    else setNameError("");
    if (birthDate) {
      const bdErr = validateBirthDateWithMessage(birthDate);
      if (bdErr) { setBirthDateError(bdErr); valid = false; }
      else setBirthDateError("");
    } else setBirthDateError("");
    if (phone && !validatePhone(phone)) { setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)"); valid = false; }
    else setPhoneError("");
    if (contractType === ContractType.Business) {
      if (!businessName.trim()) { setBusinessNameError("사업자명을 입력해주세요"); valid = false; }
      else setBusinessNameError("");
      if (!businessNumber || !validateBusinessNumber(businessNumber)) { setBusinessNumberError("올바른 사업자 번호 형식이 아닙니다 (000-00-00000)"); valid = false; }
      else setBusinessNumberError("");
      if (!businessAddress.trim()) { setBusinessAddressError("사업장 주소를 입력해주세요"); valid = false; }
      else setBusinessAddressError("");
    } else {
      setBusinessNameError("");
      setBusinessNumberError("");
      setBusinessAddressError("");
    }
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setServerError("");
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await profileApi.update({
        name,
        birthDate: birthDate || null,
        gender: gender || null,
        phone,
        address: address || null,
        addressDetail: addressDetail || null,
        techStack,
        bio,
        contractType: contractType || null,
        bankName: bankName || null,
        bankAccountNumber: bankAccountNumber || null,
        ...(contractType === ContractType.Business
          ? { businessName, businessNumber, businessAddress, businessAddressDetail: businessAddressDetail || null }
          : {}),
      });
      setSaveSuccess(true);
      setTimeout(onSuccess, 700);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 기본 정보 */}
      <SectionDivider label="기본 정보" />

      <FormField label="이름" required error={nameError} hint={!nameError ? `${name.length}/50` : undefined}>
        <Input
          type="text"
          value={name}
          maxLength={50}
          onChange={(e) => { setName(e.target.value); if (nameError) setNameError(e.target.value.trim() ? "" : "이름을 입력해주세요"); }}
          className={nameError ? "border-destructive/50" : ""}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="생년월일" optional error={birthDateError}>
          <DateSelectPicker
            value={birthDate}
            onChange={(v) => { setBirthDate(v); if (birthDateError) setBirthDateError(""); }}
            maxDate={new Date().toISOString().split("T")[0]}
            error={!!birthDateError}
          />
        </FormField>
        <FormField label="성별" optional>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
            className="w-full h-11 px-3 rounded-lg border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="">선택 안함</option>
            <option value="male">남</option>
            <option value="female">여</option>
          </select>
        </FormField>
      </div>

      {/* 연락처 및 주소 */}
      <SectionDivider label="연락처 및 주소" />

      <FormField label="휴대폰 번호" optional error={phoneError} hint={!phoneError ? "010-XXXX-XXXX 형식" : undefined}>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(formatPhone(e.target.value)); if (phoneError) setPhoneError(""); }}
          onBlur={() => { if (phone && !validatePhone(phone)) setPhoneError("올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)"); }}
          placeholder="010-0000-0000"
          maxLength={13}
          className={phoneError ? "border-destructive/50" : ""}
        />
      </FormField>

      <FormField label="주소" optional>
        <KakaoAddressInput base={address} detail={addressDetail} onBaseChange={setAddress} onDetailChange={setAddressDetail} />
      </FormField>

      {/* 기술 / 소개 */}
      <SectionDivider label="기술 및 소개" />

      <FormField label="기술 스택" optional>
        <TechStackInput value={techStack} onChange={setTechStack} />
      </FormField>

      <FormField label="자기 소개" optional hint={`${bio.length}/500`}>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 500))}
          rows={4}
          placeholder="간단한 자기 소개를 작성해주세요"
          maxLength={500}
        />
      </FormField>

      {/* 계약 정보 */}
      <SectionDivider label="계약 정보" />

      <FormField label="계약형태" optional>
        <select
          value={contractType}
          onChange={(e) => setContractType(e.target.value as ContractType | "")}
          className="w-full h-11 px-3 rounded-lg border border-input text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
        >
          <option value="">선택 안함</option>
          <option value={ContractType.Business}>{CONTRACT_TYPE_CONFIG[ContractType.Business].label}</option>
          <option value={ContractType.Individual}>{CONTRACT_TYPE_CONFIG[ContractType.Individual].label}</option>
          <option value={ContractType.Employee}>{CONTRACT_TYPE_CONFIG[ContractType.Employee].label}</option>
        </select>
      </FormField>

      {contractType === ContractType.Business && (
        <>
          <FormField
            label="사업자명"
            required
            error={businessNameError}
            hint={!businessNameError ? `${businessName.length}/${LIMITS.BUSINESS_NAME_MAX}` : undefined}
          >
            <Input
              type="text"
              value={businessName}
              maxLength={LIMITS.BUSINESS_NAME_MAX}
              onChange={(e) => { setBusinessName(e.target.value); if (businessNameError) setBusinessNameError(e.target.value.trim() ? "" : "사업자명을 입력해주세요"); }}
              className={businessNameError ? "border-destructive/50" : ""}
            />
          </FormField>

          <FormField
            label="사업자 번호"
            required
            error={businessNumberError}
            hint={!businessNumberError ? "000-00-00000 형식" : undefined}
          >
            <Input
              type="text"
              value={businessNumber}
              onChange={(e) => { setBusinessNumber(formatBusinessNumber(e.target.value)); if (businessNumberError) setBusinessNumberError(""); }}
              onBlur={() => { if (businessNumber && !validateBusinessNumber(businessNumber)) setBusinessNumberError("올바른 사업자 번호 형식이 아닙니다 (000-00-00000)"); }}
              placeholder="514-88-01786"
              maxLength={12}
              className={businessNumberError ? "border-destructive/50" : ""}
            />
          </FormField>

          <FormField label="사업장 주소" required error={businessAddressError}>
            <KakaoAddressInput
              base={businessAddress}
              detail={businessAddressDetail}
              onBaseChange={(v) => { setBusinessAddress(v); if (businessAddressError) setBusinessAddressError(v.trim() ? "" : "사업장 주소를 입력해주세요"); }}
              onDetailChange={setBusinessAddressDetail}
            />
          </FormField>

          <ContractDocumentField
            documentType="business-registration"
            label="사업자등록증"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            initialDocument={initial.businessRegistrationFile}
          />
        </>
      )}

      <FormField label="은행" optional>
        <Input type="text" value={bankName} maxLength={LIMITS.BANK_NAME_MAX} onChange={(e) => setBankName(e.target.value)} placeholder="ex. 국민은행" />
      </FormField>

      <FormField label="계좌번호" optional>
        <Input
          type="text"
          inputMode="numeric"
          value={bankAccountNumber}
          maxLength={LIMITS.BANK_ACCOUNT_MAX}
          onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^0-9-]/g, ""))}
          placeholder="계좌번호를 입력해주세요"
        />
      </FormField>

      <ContractDocumentField
        documentType="bank-account-image"
        label="계좌 이미지"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        initialDocument={initial.bankAccountImage}
      />

      <ErrorMessage size="sm">{serverError}</ErrorMessage>

      {onCancel ? (
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving || saveSuccess}
            className="flex-1 rounded-xl py-3.5 text-base font-semibold border border-border text-foreground hover:bg-muted/50 active:bg-muted transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            취소
          </button>
          <div className="flex-1">
            <SaveButton isLoading={isSaving} isSuccess={saveSuccess} />
          </div>
        </div>
      ) : (
        <SaveButton isLoading={isSaving} isSuccess={saveSuccess} />
      )}
    </form>
  );
}
