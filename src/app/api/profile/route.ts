import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/supabase/queries/profile";
import {
  validatePhone,
  validateBirthDate,
  validateLength,
  validateStringArray,
  validateBusinessNumber,
} from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import { Gender, ContractType } from "@/types";
import type { UpdateProfileRequest } from "@/types";

const VALID_GENDERS = new Set<string>(Object.values(Gender));
const VALID_CONTRACT_TYPES = new Set<string>(Object.values(ContractType));

export async function GET() {
  try {
    const result = await getProfile();

    if (!result) {
      return NextResponse.json({ error: "프로필을 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "프로필을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;

    // 이름: 필수, 1-50자
    if (body.name !== undefined) {
      const trimmed = body.name.trim();
      if (!trimmed) return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
      if (trimmed.length > LIMITS.NAME_MAX)
        return NextResponse.json({ error: `이름은 ${LIMITS.NAME_MAX}자 이하로 입력해주세요` }, { status: 400 });
      body.name = trimmed;
    }

    // 길이 제한이 있는 텍스트 필드 일괄 검증 (클라이언트 maxLength와 동일 기준)
    const lengthChecks: Array<[string | null | undefined, number, string]> = [
      [body.bio, LIMITS.BIO_MAX, "자기소개"],
      [body.address, LIMITS.ADDRESS_MAX, "주소"],
      [body.addressDetail, LIMITS.ADDRESS_DETAIL_MAX, "상세 주소"],
      [body.businessName, LIMITS.BUSINESS_NAME_MAX, "사업자명"],
      [body.businessAddress, LIMITS.BUSINESS_ADDRESS_MAX, "사업장 주소"],
      [body.businessAddressDetail, LIMITS.BUSINESS_ADDRESS_DETAIL_MAX, "사업장 상세 주소"],
      [body.bankName, LIMITS.BANK_NAME_MAX, "은행"],
      [body.bankAccountNumber, LIMITS.BANK_ACCOUNT_MAX, "계좌번호"],
    ];
    for (const [value, max, label] of lengthChecks) {
      if (typeof value === "string") {
        const lengthError = validateLength(value, max, label);
        if (lengthError) return NextResponse.json({ error: lengthError }, { status: 400 });
      }
    }

    // 기술스택: 배열 형식·항목 수·항목 길이
    if (body.techStack !== undefined) {
      const techError = validateStringArray(body.techStack, {
        itemMax: LIMITS.TECH_ITEM_MAX,
        countMax: LIMITS.TECH_COUNT_MAX,
        label: "기술스택",
      });
      if (techError) return NextResponse.json({ error: techError }, { status: 400 });
    }

    // 휴대폰: 형식 검사
    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json({ error: "올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)" }, { status: 400 });
    }

    // 생년월일: 과거 날짜만 허용
    if (body.birthDate && !validateBirthDate(body.birthDate)) {
      return NextResponse.json({ error: "올바른 생년월일을 입력해주세요" }, { status: 400 });
    }

    // 성별: 허용값만 (Gender enum 기준)
    if (body.gender !== undefined && body.gender !== null && !VALID_GENDERS.has(body.gender)) {
      return NextResponse.json({ error: "올바른 성별 값이 아닙니다" }, { status: 400 });
    }

    // 계약형태: 허용값만 (ContractType enum 기준)
    if (body.contractType !== undefined && body.contractType !== null && !VALID_CONTRACT_TYPES.has(body.contractType)) {
      return NextResponse.json({ error: "올바른 계약형태 값이 아닙니다" }, { status: 400 });
    }

    // 사업자 계약: 사업자명/사업자번호/사업장주소 필수
    if (body.contractType === ContractType.Business) {
      if (!body.businessName?.trim()) {
        return NextResponse.json({ error: "사업자명을 입력해주세요" }, { status: 400 });
      }
      if (!body.businessNumber || !validateBusinessNumber(body.businessNumber)) {
        return NextResponse.json({ error: "올바른 사업자 번호 형식이 아닙니다 (000-00-00000)" }, { status: 400 });
      }
      if (!body.businessAddress?.trim()) {
        return NextResponse.json({ error: "사업장 주소를 입력해주세요" }, { status: 400 });
      }
    }

    await updateProfile(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "프로필 수정에 실패했습니다" }, { status: 500 });
  }
}
