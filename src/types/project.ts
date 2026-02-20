export const ProjectStatus = {
  Recruiting: "recruiting",
  InProgress: "in_progress",
  Completed: "completed",
  Cancelled: "cancelled",
} as const;
export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectType = {
  Web: "web",
  Mobile: "mobile",
  Backend: "backend",
  Fullstack: "fullstack",
  Data: "data",
  Design: "design",
  Other: "other",
} as const;
export type ProjectType = typeof ProjectType[keyof typeof ProjectType];

export const WorkType = {
  Remote: "remote",
  Onsite: "onsite",
  Hybrid: "hybrid",
} as const;
export type WorkType = typeof WorkType[keyof typeof WorkType];

export type ProjectFilterValue = "all" | ProjectStatus;

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  projectType: ProjectType;
  workType: WorkType;
  status: ProjectStatus;
  techStack: string[];
  budget: {
    min: number;
    max: number;
    currency: "KRW";
  };
  duration: {
    startDate: string;
    endDate: string;
  };
  deadline: string;
  headcount: number;
  location?: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}
