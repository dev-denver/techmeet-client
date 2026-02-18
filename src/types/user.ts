export type AvailabilityStatus = "available" | "partial" | "unavailable";

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
  avatarUrl?: string;
  headline: string;
  bio: string;
  techStack: string[];
  careers: Career[];
  availabilityStatus: AvailabilityStatus;
  experienceYears: number;
  kakaoId?: string;
  createdAt: string;
  updatedAt: string;
}
