import { createServerClient } from "@/lib/supabase/server";
import type { Notice } from "@/types";
import type { GetNoticesResponse } from "@/types";

interface NoticeRow {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
}

function mapRowToNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    isImportant: row.is_important,
    createdAt: row.created_at,
  };
}

export async function getNotices(): Promise<GetNoticesResponse> {
  const supabase = await createServerClient();

  const { data, count, error } = await supabase
    .from("notices")
    .select("*", { count: "exact" })
    .order("is_important", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[getNotices]", error);
    return { data: [], total: 0, page: 1, pageSize: 20 };
  }

  return {
    data: (data as NoticeRow[]).map(mapRowToNotice),
    total: count ?? 0,
    page: 1,
    pageSize: 20,
  };
}
