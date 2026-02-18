import { apiFetch } from "./client";
import type { SignupRequest, LoginRequest, ApiSuccessResponse } from "@/types";

export const authApi = {
  signup: (data: SignupRequest) =>
    apiFetch<ApiSuccessResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    apiFetch<ApiSuccessResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
