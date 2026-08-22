import { apiFetch } from "./client";

export const pushApi = {
  register: (data: { platform: "ios" | "android"; token: string }) =>
    apiFetch<{ success: true }>("/api/push/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
