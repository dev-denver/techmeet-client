import { NextRequest, NextResponse } from "next/server";
import type { NotificationSettings, UpdateNotificationSettingsRequest } from "@/types";

// TODO: Supabase 연동 시 실제 조회/저장으로 교체
const defaultSettings: NotificationSettings = {
  new_project: true,
  application_update: true,
  marketing: false,
};

export async function GET() {
  try {
    // TODO: const { data } = await supabase.from("notification_settings").select("*").single();
    return NextResponse.json({ data: defaultSettings });
  } catch {
    return NextResponse.json({ error: "알림 설정을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateNotificationSettingsRequest;
    // TODO: await supabase.from("notification_settings").upsert({ ...body });
    console.log("notification settings update:", body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "알림 설정 저장에 실패했습니다" }, { status: 500 });
  }
}
