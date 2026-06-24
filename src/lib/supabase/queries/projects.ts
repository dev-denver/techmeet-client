import { createServerClient } from "@/lib/supabase/server";
import { ProjectStatus } from "@/types";
import type { Project } from "@/types";
import type { GetProjectsParams, GetProjectsResponse, GetProjectByIdResponse } from "@/types";

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  client_name: string | null;
  project_type: string | null;
  work_type: string | null;
  status: ProjectStatus;
  tech_stack: string[];
  duration_start_date: string | null;
  duration_end_date: string | null;
  deadline: string | null;
  headcount: number | null;
  location: string | null;
  requirements: string[] | null;
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

  // 주의: ProjectRow 인터페이스에 컬럼을 추가하면 아래 select 목록도 함께 갱신할 것
  let query = supabase
    .from("projects")
    .select(
      "id, title, description, client_name, project_type, work_type, status, tech_stack, duration_start_date, duration_end_date, deadline, headcount, location, requirements, created_at, updated_at",
      { count: "exact" }
    )
    // RLS는 인증된 사용자에게 전체 행을 허용하므로, soft delete/노출 여부는 앱 레이어에서 필터링
    .is("deleted_at", null)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params?.status === ProjectStatus.Recruiting) {
    // 모집중 상태라도 지원 마감일이 지난 프로젝트는 제외
    const today = new Date().toISOString().slice(0, 10);
    query = query.or(`deadline.is.null,deadline.gte.${today}`);
  }
  if (params?.search) {
    // 제목 + 소개 동시 검색. `.or()` DSL을 깨뜨릴 수 있는 문자는 공백으로 치환
    const term = params.search.replace(/[,()]/g, " ").trim();
    if (term) {
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }
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
    .is("deleted_at", null)
    .eq("is_visible", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return { data: mapRowToProject(data as ProjectRow) };
}
