import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { deleteCertification } from "@/lib/supabase/queries/resume";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const { id } = await params;

  try {
    await deleteCertification(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
