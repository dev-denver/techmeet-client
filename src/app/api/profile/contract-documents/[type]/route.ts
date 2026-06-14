import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createServerClient } from "@/lib/supabase/server";
import { getContractDocument, updateContractDocument } from "@/lib/supabase/queries/profile";
import { CONTRACT_DOCUMENT_TYPES, isContractDocumentType } from "@/lib/constants/contractDocuments";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "bin";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { type } = await params;
    if (!isContractDocumentType(type)) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const config = CONTRACT_DOCUMENT_TYPES[type];
    if (!config.allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ error: `${config.label} 파일 형식이 올바르지 않습니다` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다" }, { status: 400 });
    }

    const supabase = await createServerClient();

    const existing = await getContractDocument(type);
    if (existing) {
      await supabase.storage.from("contract-documents").remove([existing.filePath]);
    }

    const ext = getExtension(file.type);
    const uuid = crypto.randomUUID();
    const filePath = `${user.id}/${type}/${uuid}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("contract-documents")
      .upload(filePath, arrayBuffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 });
    }

    const document = { fileName: file.name, filePath };
    await updateContractDocument(type, document);

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(
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

    const existing = await getContractDocument(type);
    if (existing) {
      const supabase = await createServerClient();
      await supabase.storage.from("contract-documents").remove([existing.filePath]);
    }

    await updateContractDocument(type, null);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "파일 삭제에 실패했습니다" }, { status: 500 });
  }
}
