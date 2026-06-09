import { createServerClient } from "@/lib/supabase/server";
import type { Notice, NoticeAttachment } from "@/types";
import type { GetNoticesParams, GetNoticesResponse } from "@/types";

interface NoticeRow {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
  attachments: NoticeAttachment[];
}

function mapRowToNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    isImportant: row.is_important,
    createdAt: row.created_at,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
  };
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToNotice(data as NoticeRow);
}

export async function getNotices(params?: GetNoticesParams): Promise<GetNoticesResponse> {
  const supabase = await createServerClient();

  let query = supabase
    .from("notices")
    .select("*", { count: "exact" })
    .order("is_important", { ascending: false })
    .order("created_at", { ascending: false });

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize;

  if (pageSize) {
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
  }

  const { data, count, error } = await query;

  if (error) {
    console.warn("[getNotices]", error);
    return { data: [], total: 0, page, pageSize: pageSize ?? 20 };
  }

  return {
    data: (data as NoticeRow[]).map(mapRowToNotice),
    total: count ?? 0,
    page,
    pageSize: pageSize ?? 20,
  };
}
