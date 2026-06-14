import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createServerClient } from "@/lib/supabase/server";
import { getContractDocument } from "@/lib/supabase/queries/profile";
import { isContractDocumentType } from "@/lib/constants/contractDocuments";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { type } = await params;
    if (!isContractDocumentType(type)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }

    const document = await getContractDocument(type);
    if (!document) {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }

    // Windows/브라우저에서 금지된 문자 제거: \ / : * ? " < > |
    const safeFileName = document.fileName.replace(/[\\/:*?"<>|]/g, "_").trim() || "file";

    const supabase = await createServerClient();
    const { data: signedData, error: signError } = await supabase.storage
      .from("contract-documents")
      .createSignedUrl(document.filePath, 60, { download: safeFileName });

    if (signError || !signedData) {
      return NextResponse.json({ error: "다운로드 링크 생성에 실패했습니다" }, { status: 500 });
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch {
    return NextResponse.json({ error: "다운로드에 실패했습니다" }, { status: 500 });
  }
}
