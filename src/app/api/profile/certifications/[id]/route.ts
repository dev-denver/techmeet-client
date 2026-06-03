import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/server";
import { deleteCertification } from "@/lib/supabase/queries/resume";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    await deleteCertification(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
