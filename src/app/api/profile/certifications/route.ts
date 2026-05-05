import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getCertifications, addCertification } from "@/lib/supabase/queries/resume";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const data = await getCertifications();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });

  const body = await req.json();
  const { name, acquiredDate } = body;
  if (!name) return NextResponse.json({ error: "자격증명은 필수입니다" }, { status: 400 });

  try {
    await addCertification({ name, acquiredDate: acquiredDate ?? null });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
