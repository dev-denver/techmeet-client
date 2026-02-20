import { createServerClient } from "@/lib/supabase/server";
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
  cover_letter: string;
  expected_rate: number;
  applied_at: string;
  updated_at: string;
  projects: { title: string } | null;
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

export async function createApplication(
  payload: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

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

  if (error) throw error;

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
