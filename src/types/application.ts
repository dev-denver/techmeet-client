export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "interview"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  status: ApplicationStatus;
  coverLetter: string;
  expectedRate: number;
  appliedAt: string;
  updatedAt: string;
}
