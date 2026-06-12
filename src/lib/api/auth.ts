import { apiFetch } from "./client";
import type { SignupRequest, LoginRequest, ApiSuccessResponse, GetPublicKeyResponse } from "@/types";

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

  logout: () => apiFetch<ApiSuccessResponse>("/api/auth/logout", { method: "POST" }),

  withdraw: () => apiFetch<ApiSuccessResponse>("/api/auth/withdraw", { method: "POST" }),

  getPublicKey: () => apiFetch<GetPublicKeyResponse>("/api/auth/public-key"),
};
