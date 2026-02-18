import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateAvailabilityRequest,
  AddCareerRequest,
  UpdateCareerRequest,
} from "@/types";

export async function getProfile(): Promise<GetProfileResponse | null> {
  // TODO: const supabase = createClient();
  // const { data } = await supabase.from("profiles").select("*, careers(*)").single();
  return null;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<void> {
  // TODO: await supabase.from("profiles").update({ ... }).eq("id", userId);
  console.log("updateProfile called with data:", data);
  throw new Error("Supabase not yet configured");
}

export async function updateAvailability(data: UpdateAvailabilityRequest): Promise<void> {
  // TODO: await supabase.from("profiles").update({ availability_status: data.status }).eq("id", userId);
  console.log("updateAvailability called with status:", data.status);
  throw new Error("Supabase not yet configured");
}

export async function addCareer(data: AddCareerRequest): Promise<void> {
  // TODO: await supabase.from("careers").insert({ ... });
  console.log("addCareer called with data:", data);
  throw new Error("Supabase not yet configured");
}

export async function updateCareer(id: string, data: UpdateCareerRequest): Promise<void> {
  // TODO: await supabase.from("careers").update({ ... }).eq("id", id);
  console.log("updateCareer called with id:", id, "data:", data);
  throw new Error("Supabase not yet configured");
}

export async function deleteCareer(id: string): Promise<void> {
  // TODO: await supabase.from("careers").delete().eq("id", id);
  console.log("deleteCareer called with id:", id);
  throw new Error("Supabase not yet configured");
}
