import { NextResponse } from "next/server";
import { getNotices } from "@/lib/supabase/queries/notices";

export async function GET() {
  try {
    const result = await getNotices();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "공지사항을 불러오지 못했습니다" }, { status: 500 });
  }
}
