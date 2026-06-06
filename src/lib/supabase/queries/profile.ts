import { createServerClient } from "@/lib/supabase/server";
import type { FreelancerProfile, Career, AvailabilityStatus, Gender, ProfileResume } from "@/types";

/** "YYYY-MM" → "YYYY-MM-01" 변환. PostgreSQL date 컬럼은 "YYYY-MM-DD" 형식만 허용. */
function toDbDate(v: string | null | undefined): string | null {
  if (!v) return null;
  if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`;
  return v;
}
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateAvailabilityRequest,
  AddCareerRequest,
  UpdateCareerRequest,
} from "@/types";
import {
  getEducations,
  getCertifications,
  getSkillInventories,
} from "./resume";

interface ProfileResumeRow {
  id: string;
  profile_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

function mapRowToResume(row: ProfileResumeRow): ProfileResume {
  return {
    id: row.id,
    fileName: row.file_name,
    filePath: row.file_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  };
}

export async function getProfileResumes(userId: string): Promise<ProfileResume[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profile_resumes")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[getProfileResumes]", error);
    return [];
  }
  return (data as ProfileResumeRow[]).map(mapRowToResume);
}

export async function addProfileResume(payload: {
  profileId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}): Promise<ProfileResume> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profile_resumes")
    .insert({
      profile_id: payload.profileId,
      file_name: payload.fileName,
      file_path: payload.filePath,
      file_size: payload.fileSize,
      mime_type: payload.mimeType,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRowToResume(data as ProfileResumeRow);
}

export async function deleteProfileResume(id: string, userId: string): Promise<string> {
  const supabase = await createServerClient();

  const { data: row, error: fetchError } = await supabase
    .from("profile_resumes")
    .select("file_path")
    .eq("id", id)
    .eq("profile_id", userId)
    .single();

  if (fetchError || !row) throw new Error("이력서를 찾을 수 없습니다");

  const { error } = await supabase
    .from("profile_resumes")
    .delete()
    .eq("id", id)
    .eq("profile_id", userId);

  if (error) throw error;
  return (row as { file_path: string }).file_path;
}

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
  bio: string | null;
  tech_stack: string[];
  availability_status: AvailabilityStatus | null;
  available_from_date: string | null;
  experience_years: number | null;
  experience_months: number;
  birth_date: string | null;
  gender: Gender | null;
  joining_date: string | null;
  affiliation: string | null;
  department: string | null;
  position_title: string | null;
  military_service: string | null;
  address: string | null;
  kakao_id: string | null;
  referrer_id: string | null;
  referrer: { name: string } | null;
  created_at: string;
  updated_at: string;
  careers: CareerRow[];
}

// DB의 snake_case 컬럼명을 TypeScript camelCase 인터페이스로 변환하는 매퍼들.
// Supabase가 자동 변환을 지원하지 않아 명시적으로 매핑한다.
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

function mapRowToProfile(row: ProfileRow, profile: Partial<FreelancerProfile> = {}): FreelancerProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    bio: row.bio,
    techStack: row.tech_stack,
    careers: row.careers.map(mapRowToCareer),
    educations: profile.educations ?? [],
    certifications: profile.certifications ?? [],
    skillInventories: profile.skillInventories ?? [],
    resumes: profile.resumes ?? [],
    availabilityStatus: row.availability_status,
    availableFromDate: row.available_from_date,
    experienceYears: row.experience_years,
    experienceMonths: row.experience_months,
    birthDate: row.birth_date,
    gender: row.gender,
    joiningDate: row.joining_date,
    affiliation: row.affiliation,
    department: row.department,
    positionTitle: row.position_title,
    militaryService: row.military_service,
    address: row.address,
    kakaoId: row.kakao_id ?? undefined,
    referrerId: row.referrer_id ?? undefined,
    referrerName: row.referrer?.name ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(): Promise<GetProfileResponse | null> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileResult, educations, certifications, skillInventories, resumes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, careers(*)")
      .eq("id", user.id)
      .single(),
    getEducations(),
    getCertifications(),
    getSkillInventories(),
    getProfileResumes(user.id),
  ]);

  if (profileResult.error) {
    console.warn("[getProfile]", profileResult.error);
    return null;
  }

  const row = profileResult.data as ProfileRow;

  let referrerName: string | undefined;
  if (row.referrer_id) {
    const { data: referrer } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", row.referrer_id)
      .single();
    referrerName = referrer?.name ?? undefined;
  }

  return {
    data: mapRowToProfile(
      { ...row, referrer: referrerName ? { name: referrerName } : null },
      { educations, certifications, skillInventories, resumes }
    ),
  };
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<void> {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const updateData: Record<string, unknown> = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.bio !== undefined) updateData.bio = payload.bio;
  if (payload.techStack !== undefined) updateData.tech_stack = payload.techStack;
  if (payload.experienceYears !== undefined) updateData.experience_years = payload.experienceYears;
  if (payload.experienceMonths !== undefined) updateData.experience_months = payload.experienceMonths;
  if ("birthDate" in payload) updateData.birth_date = (payload as Record<string, unknown>).birthDate;
  if ("gender" in payload) updateData.gender = (payload as Record<string, unknown>).gender;
  if ("joiningDate" in payload) updateData.joining_date = (payload as Record<string, unknown>).joiningDate;
  if ("affiliation" in payload) updateData.affiliation = (payload as Record<string, unknown>).affiliation;
  if ("department" in payload) updateData.department = (payload as Record<string, unknown>).department;
  if ("positionTitle" in payload) updateData.position_title = (payload as Record<string, unknown>).positionTitle;
  if ("militaryService" in payload) updateData.military_service = (payload as Record<string, unknown>).militaryService;
  if ("address" in payload) updateData.address = (payload as Record<string, unknown>).address;

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

  const updateData: Record<string, unknown> = { availability_status: payload.status };
  if ("availableFromDate" in payload) {
    updateData.available_from_date = payload.availableFromDate ?? null;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
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
    start_date: toDbDate(payload.startDate),
    end_date: toDbDate(payload.endDate) ?? null,
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
  if (payload.startDate !== undefined) updateData.start_date = toDbDate(payload.startDate);
  if (payload.endDate !== undefined) updateData.end_date = toDbDate(payload.endDate);
  if (payload.isCurrent !== undefined) updateData.is_current = payload.isCurrent;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.techStack !== undefined) updateData.tech_stack = payload.techStack;

  const { error } = await supabase
    .from("careers")
    .update(updateData)
    // profile_id 이중 검증: RLS가 있더라도 API 레이어에서 소유권을 명시적으로 확인
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
    // profile_id 이중 검증: 타인의 경력을 삭제하지 못하도록 소유권 확인
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) throw error;
}
