import type { GetNoticesResponse } from "@/types";

export async function getNotices(): Promise<GetNoticesResponse> {
  // TODO: const supabase = createClient();
  // const { data, count } = await supabase.from("notices").select("*", { count: "exact" }).order("created_at", { ascending: false });
  return { data: [], total: 0, page: 1, pageSize: 20 };
}
