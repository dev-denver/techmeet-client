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
  /** 지원한 프로젝트가 삭제(soft delete)되었거나 비공개로 전환된 경우 true */
  isProjectDeleted: boolean;
  freelancerId: string;
  status: ApplicationStatus;
  note: string | null;
  expectedRate: number | null;
  appliedAt: string;
  updatedAt: string;
}
