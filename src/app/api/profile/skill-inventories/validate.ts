import { NextResponse } from "next/server";
import { validateStringArray } from "@/lib/utils/validation";
import { LIMITS } from "@/lib/constants/limits";
import type { SaveSkillInventoryRequest } from "@/types";

/**
 * 스킬 인벤토리 공통 입력 검증 (POST·PUT 공용).
 * 통과 시 null, 실패 시 400 응답을 반환한다.
 * route.ts는 핸들러 외 export가 금지라 별도 파일로 분리했다.
 */
export function validateSkillInventoryBody(body: Partial<SaveSkillInventoryRequest>): NextResponse | null {
  // 날짜 역전 검사
  if (body.startDate && body.endDate && body.endDate <= body.startDate) {
    return NextResponse.json({ error: "종료일은 시작일보다 이후여야 합니다" }, { status: 400 });
  }

  // 단문 텍스트 필드 길이 검사
  const textFields: Array<[string | null | undefined, string]> = [
    [body.client, "고객사"],
    [body.company, "근무회사"],
    [body.industry, "산업 분야"],
    [body.application, "응용 분야"],
    [body.role, "역할"],
    [body.hardwareType, "기종"],
    [body.os, "OS"],
    [body.dbms, "DBMS"],
    [body.others, "기타"],
  ];
  for (const [value, label] of textFields) {
    if (typeof value === "string" && value.length > LIMITS.COMPANY_MAX) {
      return NextResponse.json({ error: `${label}은(는) ${LIMITS.COMPANY_MAX}자 이하로 입력해주세요` }, { status: 400 });
    }
  }

  // 개발언어·TOOL 배열 검사
  for (const [arr, label] of [
    [body.languages, "개발언어"],
    [body.tools, "TOOL"],
  ] as const) {
    if (arr !== undefined) {
      const arrError = validateStringArray(arr, {
        itemMax: LIMITS.TECH_ITEM_MAX,
        countMax: LIMITS.TECH_COUNT_MAX,
        label,
      });
      if (arrError) return NextResponse.json({ error: arrError }, { status: 400 });
    }
  }

  return null;
}
