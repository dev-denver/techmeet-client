import { apiFetch } from "./client";
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateAvailabilityRequest,
  AddCareerRequest,
  UpdateCareerRequest,
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
};
