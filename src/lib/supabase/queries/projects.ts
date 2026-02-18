import type { GetProjectsParams, GetProjectsResponse, GetProjectByIdResponse } from "@/types";

export async function getProjects(params?: GetProjectsParams): Promise<GetProjectsResponse> {
  // TODO: const supabase = createClient();
  // const query = supabase.from("projects").select("*", { count: "exact" });
  // if (params?.status && params.status !== "all") query.eq("status", params.status);
  // const { data, count } = await query.range(...).order("created_at", { ascending: false });
  console.log("getProjects called with params:", params);
  return { data: [], total: 0, page: params?.page ?? 1, pageSize: params?.pageSize ?? 20 };
}

export async function getProjectById(id: string): Promise<GetProjectByIdResponse | null> {
  // TODO: const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  console.log("getProjectById called with id:", id);
  return null;
}
