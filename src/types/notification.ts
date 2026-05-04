export const AlimtalkServiceType = {
  Project: "project",
  Notice: "notice",
  Individual: "individual",
} as const;
export type AlimtalkServiceType = typeof AlimtalkServiceType[keyof typeof AlimtalkServiceType];

export interface AlimtalkLog {
  id: string;
  templateName: string;
  serviceType: AlimtalkServiceType;
  isSuccess: boolean | null;
  sentAt: string | null;
  createdAt: string;
}
