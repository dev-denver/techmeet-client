import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { ApplicationStatus } from "@/types";
import type { Application } from "@/types";
import type {
  GetApplicationsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from "@/types";

interface ApplicationRow {
  id: string;
  project_id: string;
  freelancer_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  expected_rate: number | null;
  applied_at: string;
  updated_at: string;
  projects: { title: string } | null;
}

/** 중복 지원(unique 제약 위반) 시 throw — API route에서 409로 매핑 */
export class DuplicateApplicationError extends Error {
  constructor() {
    super("이미 지원한 프로젝트입니다");
    this.name = "DuplicateApplicationError";
  }
}

function mapRowToApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: row.projects?.title ?? "",
    freelancerId: row.freelancer_id,
    status: row.status,
    coverLetter: row.cover_letter,
    expectedRate: row.expected_rate,
    appliedAt: row.applied_at,
    updatedAt: row.updated_at,
  };
}

const statusOrder: string[] = [
  ApplicationStatus.Interview,
  ApplicationStatus.Reviewing,
  ApplicationStatus.Pending,
  ApplicationStatus.Accepted,
  ApplicationStatus.Rejected,
  ApplicationStatus.Withdrawn,
];

export async function getApplications(): Promise<GetApplicationsResponse> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], total: 0, page: 1, pageSize: 20 };

  const { data, count, error } = await supabase
    .from("applications")
    .select("*, projects(title)", { count: "exact" })
    .eq("freelancer_id", user.id)
    .order("applied_at", { ascending: false });

  if (error) {
    console.warn("[getApplications]", error);
    return { data: [], total: 0, page: 1, pageSize: 20 };
  }

  const applications = (data as ApplicationRow[]).map(mapRowToApplication);
  applications.sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  return {
    data: applications,
    total: count ?? 0,
    page: 1,
    pageSize: 20,
  };
}

/** 현재 사용자의 특정 프로젝트 지원 내역 단건 조회 (없으면 null) */
export async function getApplicationForProject(
  projectId: string
): Promise<Application | null> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("applications")
    .select("*, projects(title)")
    .eq("freelancer_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToApplication(data as ApplicationRow);
}

export async function createApplication(
  payload: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { data: existing } = await supabase
    .from("applications")
    .select("id, status")
    .eq("project_id", payload.projectId)
    .eq("freelancer_id", user.id)
    .maybeSingle();

  // 취소(withdrawn)했던 지원 내역이 있으면 재지원으로 간주해 기존 행을 재활성화한다.
  // RLS의 applications_update_own 정책은 pending → withdrawn 전환만 허용하므로,
  // withdrawn → pending 재활성화는 admin client로 처리한다.
  if (existing?.status === ApplicationStatus.Withdrawn) {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("applications")
      .update({
        status: ApplicationStatus.Pending,
        cover_letter: payload.coverLetter,
        expected_rate: payload.expectedRate,
        applied_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*, projects(title)")
      .single();

    if (error) throw error;
    return { data: mapRowToApplication(data as ApplicationRow) };
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      project_id: payload.projectId,
      freelancer_id: user.id,
      cover_letter: payload.coverLetter,
      expected_rate: payload.expectedRate,
    })
    .select("*, projects(title)")
    .single();

  if (error) {
    // unique (project_id, freelancer_id) 위반 → 이미 지원한 프로젝트
    if (error.code === "23505") throw new DuplicateApplicationError();
    throw error;
  }

  return { data: mapRowToApplication(data as ApplicationRow) };
}

export async function withdrawApplication(id: string): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("applications")
    .update({ status: ApplicationStatus.Withdrawn })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw error;
}
