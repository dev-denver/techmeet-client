import type { Project, ProjectFilterValue } from "./project";
import type { FreelancerProfile, AvailabilityStatus, ProfileResume, ContractType, ContractDocument } from "./user";
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
  encryptedPassword: string;
  email: string;
  name: string;
  birth_date: string;
  phone: string;
  kakaoId: string;
  agree_marketing: boolean;
  referrer_id: string | null;
}

export interface LoginRequest {
  email: string;
  encryptedPassword: string;
}

export type GetPublicKeyResponse = { publicKey: string };

export interface ChangePasswordRequest {
  encryptedCurrentPassword: string;
  encryptedNewPassword: string;
}

// ── Projects ──────────────────────────────────────────
export interface GetProjectsParams {
  status?: ProjectFilterValue;
  page?: number;
  pageSize?: number;
  search?: string;
}

export type GetProjectsResponse = PaginatedResponse<Project>;
export type GetProjectByIdResponse = { data: Project };

// ── Applications ──────────────────────────────────────
export interface CreateApplicationRequest {
  projectId: string;
  note: string;
  expectedRate: number;
}

export type GetApplicationsResponse = PaginatedResponse<Application>;
export type CreateApplicationResponse = { data: Application };

// ── Profile ───────────────────────────────────────────
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
  techStack?: string[];
  birthDate?: string | null;
  gender?: "male" | "female" | null;
  address?: string | null;
  contractType?: ContractType | null;
  businessName?: string | null;
  businessNumber?: string | null;
  businessAddress?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
}

export interface UpdateAvailabilityRequest {
  status: AvailabilityStatus;
  availableFromDate?: string | null;
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

export interface SaveEducationRequest {
  schoolName: string;
  degree?: string | null;
  major?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isGraduated: boolean;
}

export interface SaveCertificationRequest {
  name: string;
  acquiredDate?: string | null;
}

export interface SaveSkillInventoryRequest {
  projectName: string;
  startDate?: string | null;
  endDate?: string | null;
  client?: string | null;
  company?: string | null;
  industry?: string | null;
  application?: string | null;
  role?: string | null;
  hardwareType?: string | null;
  os?: string | null;
  languages: string[];
  dbms?: string | null;
  tools: string[];
  others?: string | null;
}

export type UploadResumeResponse = ApiSuccessResponse & { resume: ProfileResume };
export type UploadContractDocumentResponse = ApiSuccessResponse & { document: ContractDocument };

// ── Referrer ──────────────────────────────────────────
export interface SetReferrerRequest { referrerId: string; }
export type SetReferrerResponse = ApiSuccessResponse;
export interface ReferrerSearchResult { id: string; name: string; maskedPhone: string; }
export type SearchReferrerResponse = { data: ReferrerSearchResult[] };
export type LookupReferrerResponse = { data: ReferrerSearchResult };

// ── Notices ───────────────────────────────────────────
export interface GetNoticesParams {
  page?: number;
  pageSize?: number;
}

export type GetNoticesResponse = PaginatedResponse<Notice>;

// ── Notifications ─────────────────────────────────────
import type { AlimtalkLog } from "./notification";
export type GetAlimtalkLogsResponse = PaginatedResponse<AlimtalkLog>;

// ── Settings ──────────────────────────────────────────
export interface NotificationSettings {
  new_project: boolean;
  application_update: boolean;
  marketing: boolean;
}

export type GetNotificationSettingsResponse = { data: NotificationSettings };
export type UpdateNotificationSettingsRequest = Partial<NotificationSettings>;
