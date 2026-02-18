import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { NotificationSettings, UpdateNotificationSettingsRequest } from "@/types";

const defaultSettings: NotificationSettings = {
  new_project: true,
  application_update: true,
  marketing: false,
};

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: defaultSettings });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("notification_new_project, notification_application_update, notification_marketing")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: defaultSettings });
    }

    const settings: NotificationSettings = {
      new_project: (data as { notification_new_project: boolean }).notification_new_project ?? true,
      application_update: (data as { notification_application_update: boolean }).notification_application_update ?? true,
      marketing: (data as { notification_marketing: boolean }).notification_marketing ?? false,
    };

    return NextResponse.json({ data: settings });
  } catch {
    return NextResponse.json({ error: "알림 설정을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateNotificationSettingsRequest;
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const updateData: Record<string, boolean> = {};
    if (body.new_project !== undefined) updateData.notification_new_project = body.new_project;
    if (body.application_update !== undefined) updateData.notification_application_update = body.application_update;
    if (body.marketing !== undefined) updateData.notification_marketing = body.marketing;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "알림 설정 저장에 실패했습니다" }, { status: 500 });
  }
}
