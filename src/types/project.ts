export type ProjectStatus = "recruiting" | "in_progress" | "completed" | "cancelled";

export type ProjectType = "web" | "mobile" | "backend" | "fullstack" | "data" | "design" | "other";

export type WorkType = "remote" | "onsite" | "hybrid";

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
