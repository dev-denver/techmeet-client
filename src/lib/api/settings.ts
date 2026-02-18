import { apiFetch } from "./client";
import type {
  GetNotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
} from "@/types";

export const settingsApi = {
  getNotifications: () =>
    apiFetch<GetNotificationSettingsResponse>("/api/settings/notifications"),

  updateNotifications: (data: UpdateNotificationSettingsRequest) =>
    apiFetch<{ success: true }>("/api/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
