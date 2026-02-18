import { createServerClient } from "@/lib/supabase/server";
import type { FreelancerProfile, Career, AvailabilityStatus } from "@/types";
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateAvailabilityRequest,
  AddCareerRequest,
  UpdateCareerRequest,
} from "@/types";

interface CareerRow {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  tech_stack: string[];
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  headline: string;
  bio: string;
  tech_stack: string[];
  availability_status: AvailabilityStatus;
  experience_years: number;
  kakao_id: string | null;
  created_at: string;
  updated_at: string;
  careers: CareerRow[];
}

function mapRowToCareer(row: CareerRow): Career {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    isCurrent: row.is_current,
    description: row.description,
    techStack: row.tech_stack,
  };
}

function mapRowToProfile(row: ProfileRow): FreelancerProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    headline: row.headline,
    bio: row.bio,
    techStack: row.tech_stack,
    careers: row.careers.map(mapRowToCareer),
    availabilityStatus: row.availability_status,
    experienceYears: row.experience_years,
    kakaoId: row.kakao_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(): Promise<GetProfileResponse | null> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*, careers(*)")
    .eq("id", user.id)
    .single();

  if (error) {
    console.warn("[getProfile]", error);
    return null;
  }

  return { data: mapRowToProfile(data as ProfileRow) };
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const updateData: Record<string, unknown> = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.headline !== undefined) updateData.headline = payload.headline;
  if (payload.bio !== undefined) updateData.bio = payload.bio;
  if (payload.techStack !== undefined) updateData.tech_stack = payload.techStack;
  if (payload.experienceYears !== undefined) updateData.experience_years = payload.experienceYears;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) throw error;
}

export async function updateAvailability(payload: UpdateAvailabilityRequest): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("profiles")
    .update({ availability_status: payload.status })
    .eq("id", user.id);

  if (error) throw error;
}

export async function addCareer(payload: AddCareerRequest): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase.from("careers").insert({
    profile_id: user.id,
    company: payload.company,
    role: payload.role,
    start_date: payload.startDate,
    end_date: payload.endDate ?? null,
    is_current: payload.isCurrent,
    description: payload.description,
    tech_stack: payload.techStack,
  });

  if (error) throw error;
}

export async function updateCareer(id: string, payload: UpdateCareerRequest): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const updateData: Record<string, unknown> = {};
  if (payload.company !== undefined) updateData.company = payload.company;
  if (payload.role !== undefined) updateData.role = payload.role;
  if (payload.startDate !== undefined) updateData.start_date = payload.startDate;
  if (payload.endDate !== undefined) updateData.end_date = payload.endDate;
  if (payload.isCurrent !== undefined) updateData.is_current = payload.isCurrent;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.techStack !== undefined) updateData.tech_stack = payload.techStack;

  const { error } = await supabase
    .from("careers")
    .update(updateData)
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) throw error;
}

export async function deleteCareer(id: string): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("careers")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) throw error;
}
