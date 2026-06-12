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
};
