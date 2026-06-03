import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { createServerClient } from "@/lib/supabase/server";
import { addProfileResume, getProfileResumes } from "@/lib/supabase/queries/profile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_RESUME_COUNT = 10;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/x-hwp",
  "application/haansofthwp",
]);

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/x-hwp": "hwp",
    "application/haansofthwp": "hwp",
  };
  return map[mimeType] ?? "bin";
}

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "PDF, DOC, DOCX, HWP 파일만 업로드할 수 있습니다" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다" }, { status: 400 });
    }

    const existing = await getProfileResumes(user.id);
    if (existing.length >= MAX_RESUME_COUNT) {
      return NextResponse.json(
        { error: `이력서는 최대 ${MAX_RESUME_COUNT}개까지 업로드할 수 있습니다` },
        { status: 400 }
      );
    }

    const ext = getExtension(file.type);
    const uuid = crypto.randomUUID();
    const filePath = `${user.id}/${uuid}.${ext}`;

    const supabase = await createServerClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, arrayBuffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 });
    }

    const resume = await addProfileResume({
      profileId: user.id,
      fileName: file.name,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
    });

    return NextResponse.json({ success: true, resume }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "이력서 업로드에 실패했습니다" }, { status: 500 });
  }
}
