import { createServerClient } from "@/lib/supabase/server";
import type { Education, Certification, SkillInventory } from "@/types";

/** "YYYY-MM" → "YYYY-MM-01" 변환. PostgreSQL date 컬럼은 "YYYY-MM-DD" 형식만 허용. */
function toDbDate(v: string | null | undefined): string | null {
  if (!v) return null;
  if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`;
  return v;
}

// ── Education ────────────────────────────────────────────────

interface EducationRow {
  id: string;
  school_name: string;
  degree: string | null;
  major: string | null;
  start_date: string | null;
  end_date: string | null;
  is_graduated: boolean;
}

export function mapRowToEducation(row: EducationRow): Education {
  return {
    id: row.id,
    schoolName: row.school_name,
    degree: row.degree,
    major: row.major,
    startDate: row.start_date,
    endDate: row.end_date,
    isGraduated: row.is_graduated,
  };
}

export async function getEducations(): Promise<Education[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("educations")
    .select("*")
    .eq("profile_id", user.id)
    .order("start_date", { ascending: false });

  if (error) { console.warn("[getEducations]", error); return []; }
  return (data as EducationRow[]).map(mapRowToEducation);
}

export async function addEducation(payload: {
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  isGraduated: boolean;
}): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase.from("educations").insert({
    profile_id: user.id,
    school_name: payload.schoolName,
    degree: payload.degree,
    major: payload.major,
    start_date: toDbDate(payload.startDate),
    end_date: toDbDate(payload.endDate),
    is_graduated: payload.isGraduated,
  });
  if (error) throw error;
}

export async function updateEducation(id: string, payload: {
  schoolName?: string;
  degree?: string | null;
  major?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isGraduated?: boolean;
}): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const update: Record<string, unknown> = {};
  if (payload.schoolName !== undefined) update.school_name = payload.schoolName;
  if (payload.degree !== undefined) update.degree = payload.degree;
  if (payload.major !== undefined) update.major = payload.major;
  if (payload.startDate !== undefined) update.start_date = toDbDate(payload.startDate);
  if (payload.endDate !== undefined) update.end_date = toDbDate(payload.endDate);
  if (payload.isGraduated !== undefined) update.is_graduated = payload.isGraduated;

  const { error } = await supabase
    .from("educations")
    .update(update)
    .eq("id", id)
    .eq("profile_id", user.id);
  if (error) throw error;
}

export async function deleteEducation(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);
  if (error) throw error;
}

// ── Certification ─────────────────────────────────────────────

interface CertificationRow {
  id: string;
  name: string;
  acquired_date: string | null;
}

export function mapRowToCertification(row: CertificationRow): Certification {
  return {
    id: row.id,
    name: row.name,
    acquiredDate: row.acquired_date,
  };
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("profile_id", user.id)
    .order("acquired_date", { ascending: false });

  if (error) { console.warn("[getCertifications]", error); return []; }
  return (data as CertificationRow[]).map(mapRowToCertification);
}

export async function addCertification(payload: {
  name: string;
  acquiredDate: string | null;
}): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase.from("certifications").insert({
    profile_id: user.id,
    name: payload.name,
    acquired_date: toDbDate(payload.acquiredDate),
  });
  if (error) throw error;
}

export async function deleteCertification(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);
  if (error) throw error;
}

// ── SkillInventory ────────────────────────────────────────────

interface SkillInventoryRow {
  id: string;
  project_name: string;
  start_date: string | null;
  end_date: string | null;
  client: string | null;
  company: string | null;
  industry: string | null;
  application: string | null;
  role: string | null;
  hardware_type: string | null;
  os: string | null;
  languages: string[];
  dbms: string | null;
  tools: string[];
  others: string | null;
  sort_order: number;
}

export function mapRowToSkillInventory(row: SkillInventoryRow): SkillInventory {
  return {
    id: row.id,
    projectName: row.project_name,
    startDate: row.start_date,
    endDate: row.end_date,
    client: row.client,
    company: row.company,
    industry: row.industry,
    application: row.application,
    role: row.role,
    hardwareType: row.hardware_type,
    os: row.os,
    languages: row.languages,
    dbms: row.dbms,
    tools: row.tools,
    others: row.others,
    sortOrder: row.sort_order,
  };
}

export async function getSkillInventories(): Promise<SkillInventory[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("skill_inventories")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) { console.warn("[getSkillInventories]", error); return []; }
  return (data as SkillInventoryRow[]).map(mapRowToSkillInventory);
}

export async function addSkillInventory(payload: Omit<SkillInventory, "id" | "sortOrder">): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase.from("skill_inventories").insert({
    profile_id: user.id,
    project_name: payload.projectName,
    start_date: toDbDate(payload.startDate),
    end_date: toDbDate(payload.endDate),
    client: payload.client,
    company: payload.company,
    industry: payload.industry,
    application: payload.application,
    role: payload.role,
    hardware_type: payload.hardwareType,
    os: payload.os,
    languages: payload.languages,
    dbms: payload.dbms,
    tools: payload.tools,
    others: payload.others,
  });
  if (error) throw error;
}

export async function updateSkillInventory(id: string, payload: Partial<Omit<SkillInventory, "id" | "sortOrder">>): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const update: Record<string, unknown> = {};
  if (payload.projectName !== undefined) update.project_name = payload.projectName;
  if (payload.startDate !== undefined) update.start_date = toDbDate(payload.startDate);
  if (payload.endDate !== undefined) update.end_date = toDbDate(payload.endDate);
  if (payload.client !== undefined) update.client = payload.client;
  if (payload.company !== undefined) update.company = payload.company;
  if (payload.industry !== undefined) update.industry = payload.industry;
  if (payload.application !== undefined) update.application = payload.application;
  if (payload.role !== undefined) update.role = payload.role;
  if (payload.hardwareType !== undefined) update.hardware_type = payload.hardwareType;
  if (payload.os !== undefined) update.os = payload.os;
  if (payload.languages !== undefined) update.languages = payload.languages;
  if (payload.dbms !== undefined) update.dbms = payload.dbms;
  if (payload.tools !== undefined) update.tools = payload.tools;
  if (payload.others !== undefined) update.others = payload.others;

  const { error } = await supabase
    .from("skill_inventories")
    .update(update)
    .eq("id", id)
    .eq("profile_id", user.id);
  if (error) throw error;
}

export async function deleteSkillInventory(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const { error } = await supabase
    .from("skill_inventories")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);
  if (error) throw error;
}
