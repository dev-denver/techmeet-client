import { createServerClient } from "@/lib/supabase/server";
import type { AlimtalkLog, AlimtalkServiceType } from "@/types";
import type { GetAlimtalkLogsResponse } from "@/types/api";

interface AlimtalkLogRow {
  id: string;
  template_name: string;
  service_type: string;
  is_success: boolean | null;
  sent_at: string | null;
  created_at: string;
}

export async function getAlimtalkLogs(page = 1, pageSize = 20): Promise<GetAlimtalkLogsResponse> {
  const supabase = await createServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("alimtalk_logs")
    .select("id, template_name, service_type, is_success, sent_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.warn("[getAlimtalkLogs]", error);
    return { data: [], total: 0, page, pageSize };
  }

  return {
    data: (data as AlimtalkLogRow[]).map((row): AlimtalkLog => ({
      id: row.id,
      templateName: row.template_name,
      serviceType: row.service_type as AlimtalkServiceType,
      isSuccess: row.is_success,
      sentAt: row.sent_at,
      createdAt: row.created_at,
    })),
    total: count ?? 0,
    page,
    pageSize,
  };
}
