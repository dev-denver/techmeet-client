import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { getCertifications, addCertification } from "@/lib/supabase/queries/resume";
import { LIMITS } from "@/lib/constants/limits";
import type { SaveCertificationRequest } from "@/types";

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const data = await getCertifications();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const body = (await req.json()) as Partial<SaveCertificationRequest>;
  const { name, acquiredDate } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "자격증명은 필수입니다" }, { status: 400 });
  }
  if (name.trim().length > LIMITS.CERT_NAME_MAX) {
    return NextResponse.json({ error: `자격증명은 ${LIMITS.CERT_NAME_MAX}자 이하로 입력해주세요` }, { status: 400 });
  }

  try {
    await addCertification({ name: name.trim(), acquiredDate: acquiredDate ?? null });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[자격증 추가]", e);
    return NextResponse.json({ error: "자격증 저장에 실패했습니다" }, { status: 500 });
  }
}
