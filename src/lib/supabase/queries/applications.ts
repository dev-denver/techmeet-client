import type {
  GetApplicationsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from "@/types";

export async function getApplications(): Promise<GetApplicationsResponse> {
  // TODO: const supabase = createClient();
  // const { data, count } = await supabase.from("applications").select("*, projects(title)", { count: "exact" });
  return { data: [], total: 0, page: 1, pageSize: 20 };
}

export async function createApplication(
  data: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  // TODO: const { data: inserted } = await supabase.from("applications").insert({ ... }).select().single();
  console.log("createApplication called with data:", data);
  throw new Error("Supabase not yet configured");
}

export async function withdrawApplication(id: string): Promise<void> {
  // TODO: await supabase.from("applications").update({ status: "withdrawn" }).eq("id", id);
  console.log("withdrawApplication called with id:", id);
  throw new Error("Supabase not yet configured");
}
