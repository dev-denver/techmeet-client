import { apiFetch } from "./client";
import type { GetNoticesResponse } from "@/types";

export const noticesApi = {
  getList: () => apiFetch<GetNoticesResponse>("/api/notices"),
};
