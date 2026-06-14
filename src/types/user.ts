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

export const Gender = {
  Male: "male",
  Female: "female",
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const ContractType = {
  Business: "business",
  Individual: "individual",
} as const;
export type ContractType = typeof ContractType[keyof typeof ContractType];

export interface ContractDocument {
  fileName: string;
  filePath: string;
}

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

export interface Education {
  id: string;
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  isGraduated: boolean;
}

export interface Certification {
  id: string;
  name: string;
  acquiredDate: string | null;
}

export interface SkillInventory {
  id: string;
  projectName: string;
  startDate: string | null;
  endDate: string | null;
  client: string | null;
  company: string | null;
  industry: string | null;
  application: string | null;
  role: string | null;
  hardwareType: string | null;
  os: string | null;
  languages: string[];
  dbms: string | null;
  tools: string[];
  others: string | null;
  sortOrder: number;
}

export interface ProfileResume {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio: string | null;
  techStack: string[];
  careers: Career[];
  educations: Education[];
  certifications: Certification[];
  skillInventories: SkillInventory[];
  resumes: ProfileResume[];
  availabilityStatus: AvailabilityStatus | null;
  experienceYears: number | null;
  experienceMonths: number;
  birthDate: string | null;
  gender: Gender | null;
  joiningDate: string | null;
  affiliation: string | null;
  department: string | null;
  positionTitle: string | null;
  militaryService: string | null;
  address: string | null;
  availableFromDate: string | null;
  contractType: ContractType | null;
  businessName: string | null;
  businessNumber: string | null;
  businessAddress: string | null;
  businessRegistrationFile: ContractDocument | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountImage: ContractDocument | null;
  kakaoId?: string;
  referrerId?: string;
  referrerName?: string;
  createdAt: string;
  updatedAt: string;
}
