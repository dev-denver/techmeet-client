export const ApplicationStatus = {
  Pending: "pending",
  Reviewing: "reviewing",
  Interview: "interview",
  Accepted: "accepted",
  Rejected: "rejected",
  Withdrawn: "withdrawn",
} as const;
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

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
