export const AvailabilityStatus = {
  Available: "available",
  Partial: "partial",
  Unavailable: "unavailable",
} as const;
export type AvailabilityStatus = typeof AvailabilityStatus[keyof typeof AvailabilityStatus];

export const AccountStatus = {
  Active: "active",
  Withdrawn: "withdrawn",
} as const;
export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

export interface Career {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  techStack: string[];
}

export interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  headline: string;
  bio: string;
  techStack: string[];
  careers: Career[];
  availabilityStatus: AvailabilityStatus;
  experienceYears: number;
  kakaoId?: string;
  referrerId?: string;
  referrerName?: string;
  createdAt: string;
  updatedAt: string;
}
