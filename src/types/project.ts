export const ProjectStatus = {
  Recruiting: "recruiting",
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
  clientName: string | null;
  projectType: ProjectType | null;
  workType: WorkType | null;
  status: ProjectStatus;
  techStack: string[];
  duration: {
    startDate: string | null;
    endDate: string | null;
  };
  deadline: string | null;
  headcount: number | null;
  location?: string;
  requirements: string[] | null;
  createdAt: string;
  updatedAt: string;
}
