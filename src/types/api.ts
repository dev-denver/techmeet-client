import type { Project, ProjectFilterValue } from "./project";
import type { FreelancerProfile, AvailabilityStatus } from "./user";
import type { Application } from "./application";
import type { Notice } from "./notice";

// ── 공통 ────────────────────────────────────────────
export interface ApiSuccessResponse {
  success: true;
}

export interface ApiErrorResponse {
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Auth ──────────────────────────────────────────────
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  phone: string;
  kakaoId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Projects ──────────────────────────────────────────
export interface GetProjectsParams {
  status?: ProjectFilterValue;
  page?: number;
  pageSize?: number;
}

export type GetProjectsResponse = PaginatedResponse<Project>;
export type GetProjectByIdResponse = { data: Project };

// ── Applications ──────────────────────────────────────
export interface CreateApplicationRequest {
  projectId: string;
  coverLetter: string;
  expectedRate: number;
}

export type GetApplicationsResponse = PaginatedResponse<Application>;
export type CreateApplicationResponse = { data: Application };

// ── Profile ───────────────────────────────────────────
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  headline?: string;
  bio?: string;
  techStack?: string[];
  experienceYears?: number;
}

export interface UpdateAvailabilityRequest {
  status: AvailabilityStatus;
}

export interface AddCareerRequest {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  techStack: string[];
}

export type UpdateCareerRequest = Partial<AddCareerRequest>;
export type GetProfileResponse = { data: FreelancerProfile };

// ── Notices ───────────────────────────────────────────
export type GetNoticesResponse = PaginatedResponse<Notice>;

// ── Settings ──────────────────────────────────────────
export interface NotificationSettings {
  new_project: boolean;
  application_update: boolean;
  marketing: boolean;
}

export type GetNotificationSettingsResponse = { data: NotificationSettings };
export type UpdateNotificationSettingsRequest = Partial<NotificationSettings>;
