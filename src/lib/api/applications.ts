import { apiFetch } from "./client";
import type {
  GetApplicationsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from "@/types";

export const applicationsApi = {
  getList: () => apiFetch<GetApplicationsResponse>("/api/applications"),

  create: (data: CreateApplicationRequest) =>
    apiFetch<CreateApplicationResponse>("/api/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  withdraw: (id: string) =>
    apiFetch<{ success: true }>(`/api/applications/${id}`, { method: "DELETE" }),
};
