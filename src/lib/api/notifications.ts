import { apiFetch } from "./client";
import type { GetAlimtalkLogsResponse } from "@/types";

export const notificationsApi = {
  getAlimtalkLogs: (page = 1, pageSize = 20) =>
    apiFetch<GetAlimtalkLogsResponse>(
      `/api/notifications?page=${page}&pageSize=${pageSize}`
    ),
};
