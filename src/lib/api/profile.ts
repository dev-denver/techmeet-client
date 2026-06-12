import { apiFetch } from "./client";
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateAvailabilityRequest,
  AddCareerRequest,
  UpdateCareerRequest,
  SaveEducationRequest,
  SaveCertificationRequest,
  SaveSkillInventoryRequest,
  SearchReferrerResponse,
  LookupReferrerResponse,
  SetReferrerRequest,
  SetReferrerResponse,
  UploadResumeResponse,
} from "@/types";

export const profileApi = {
  get: () => apiFetch<GetProfileResponse>("/api/profile"),

  update: (data: UpdateProfileRequest) =>
    apiFetch<{ success: true }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateAvailability: (data: UpdateAvailabilityRequest) =>
    apiFetch<{ success: true }>("/api/profile/availability", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  addCareer: (data: AddCareerRequest) =>
    apiFetch<{ success: true }>("/api/profile/careers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCareer: (id: string, data: UpdateCareerRequest) =>
    apiFetch<{ success: true }>(`/api/profile/careers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCareer: (id: string) =>
    apiFetch<{ success: true }>(`/api/profile/careers/${id}`, { method: "DELETE" }),

  addEducation: (data: SaveEducationRequest) =>
    apiFetch<{ success: true }>("/api/profile/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEducation: (id: string, data: SaveEducationRequest) =>
    apiFetch<{ success: true }>(`/api/profile/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEducation: (id: string) =>
    apiFetch<{ success: true }>(`/api/profile/education/${id}`, { method: "DELETE" }),

  addCertification: (data: SaveCertificationRequest) =>
    apiFetch<{ success: true }>("/api/profile/certifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteCertification: (id: string) =>
    apiFetch<{ success: true }>(`/api/profile/certifications/${id}`, { method: "DELETE" }),

  addSkillInventory: (data: SaveSkillInventoryRequest) =>
    apiFetch<{ success: true }>("/api/profile/skill-inventories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkillInventory: (id: string, data: SaveSkillInventoryRequest) =>
    apiFetch<{ success: true }>(`/api/profile/skill-inventories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkillInventory: (id: string) =>
    apiFetch<{ success: true }>(`/api/profile/skill-inventories/${id}`, { method: "DELETE" }),

  searchReferrer: (q: string) =>
    apiFetch<SearchReferrerResponse>(`/api/profile/referrer/search?q=${encodeURIComponent(q)}`),

  lookupReferrer: (id: string) =>
    apiFetch<LookupReferrerResponse>(`/api/profile/referrer/lookup?id=${encodeURIComponent(id)}`),

  setReferrer: (data: SetReferrerRequest) =>
    apiFetch<SetReferrerResponse>("/api/profile/referrer", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<UploadResumeResponse>("/api/profile/resumes", {
      method: "POST",
      body: formData,
    });
  },

  deleteResume: (id: string) =>
    apiFetch<{ success: true }>(`/api/profile/resumes/${id}`, { method: "DELETE" }),
};
