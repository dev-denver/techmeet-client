import { createServerClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus } from "@/types";
import type { GetProjectsParams, GetProjectsResponse, GetProjectByIdResponse } from "@/types";

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  client_name: string;
  project_type: string;
  work_type: string;
  status: ProjectStatus;
  tech_stack: string[];
  budget_min: number;
  budget_max: number;
  budget_currency: string;
  duration_start_date: string;
  duration_end_date: string;
  deadline: string;
  headcount: number;
  location: string | null;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

function mapRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    clientName: row.client_name,
    projectType: row.project_type as Project["projectType"],
    workType: row.work_type as Project["workType"],
    status: row.status,
    techStack: row.tech_stack,
    budget: {
      min: row.budget_min,
      max: row.budget_max,
      currency: "KRW",
    },
    duration: {
      startDate: row.duration_start_date,
      endDate: row.duration_end_date,
    },
    deadline: row.deadline,
    headcount: row.headcount,
    location: row.location ?? undefined,
    requirements: row.requirements,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProjects(params?: GetProjectsParams): Promise<GetProjectsResponse> {
  const supabase = await createServerClient();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, count, error } = await query;

  if (error) {
    console.warn("[getProjects]", error);
    return { data: [], total: 0, page, pageSize };
  }

  return {
    data: (data as ProjectRow[]).map(mapRowToProject),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getProjectById(id: string): Promise<GetProjectByIdResponse | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return { data: mapRowToProject(data as ProjectRow) };
}
