import { apiFetch } from "./client";
import type { GetNoticesParams, GetNoticesResponse } from "@/types";

function buildNoticesQuery(params?: GetNoticesParams): string {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const noticesApi = {
  getList: (params?: GetNoticesParams) =>
    apiFetch<GetNoticesResponse>(`/api/notices${buildNoticesQuery(params)}`),
};
