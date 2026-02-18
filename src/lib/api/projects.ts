import { apiFetch } from "./client";
import type { GetProjectsParams, GetProjectsResponse, GetProjectByIdResponse } from "@/types";

function buildProjectsQuery(params?: GetProjectsParams): string {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const projectsApi = {
  getList: (params?: GetProjectsParams) =>
    apiFetch<GetProjectsResponse>(`/api/projects${buildProjectsQuery(params)}`),

  getById: (id: string) =>
    apiFetch<GetProjectByIdResponse>(`/api/projects/${id}`),
};
