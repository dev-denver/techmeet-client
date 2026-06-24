import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/server";
import type { NotificationSettings, UpdateNotificationSettingsRequest } from "@/types";

const defaultSettings: NotificationSettings = {
  privacy_consent: false,
  sms_consent: false,
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
      .select("privacy_consent, sms_consent")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: defaultSettings });
    }

    const row = data as {
      privacy_consent: boolean | null;
      sms_consent: boolean | null;
    };

    const settings: NotificationSettings = {
      privacy_consent: row.privacy_consent ?? false,
      sms_consent: row.sms_consent ?? false,
    };

    return NextResponse.json({ data: settings });
  } catch {
    return NextResponse.json({ error: "알림 설정을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateNotificationSettingsRequest;
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    // requireAuth()는 인증 확인만 담당하므로, profiles 업데이트에 별도 클라이언트 생성
    const supabase = await createServerClient();

    const updateData: Record<string, boolean> = {};
    if (body.privacy_consent !== undefined) updateData.privacy_consent = body.privacy_consent;
    if (body.sms_consent !== undefined) updateData.sms_consent = body.sms_consent;

    // sms 수신 동의는 개인정보 수집 이용 동의가 선행되어야 함
    if (updateData.privacy_consent === false) {
      updateData.sms_consent = false;
    }
    if (updateData.sms_consent === true && body.privacy_consent === undefined) {
      const { data: current } = await supabase
        .from("profiles")
        .select("privacy_consent")
        .eq("id", user.id)
        .single();
      if (!current?.privacy_consent) {
        return NextResponse.json(
          { error: "개인정보 수집 이용 동의가 필요합니다" },
          { status: 400 }
        );
      }
    }

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
