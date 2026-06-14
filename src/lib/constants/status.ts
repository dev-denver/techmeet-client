import { ProjectStatus, ApplicationStatus, AvailabilityStatus, ContractType } from "@/types";

interface StatusConfig {
  label: string;
  className: string;
  borderLeft?: string;
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  [ProjectStatus.Recruiting]: {
    label: "모집중",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  [ProjectStatus.Completed]: {
    label: "완료",
    className: "bg-status-neutral/10 text-status-neutral border-status-neutral/20",
  },
  [ProjectStatus.Cancelled]: {
    label: "취소",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
  },
};

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  [ApplicationStatus.Pending]: {
    label: "검토 대기",
    className: "bg-status-neutral/10 text-status-neutral border-status-neutral/20",
    borderLeft: "border-l-status-neutral/50",
  },
  [ApplicationStatus.Reviewing]: {
    label: "검토중",
    className: "bg-status-info/10 text-status-info border-status-info/20",
    borderLeft: "border-l-status-info",
  },
  [ApplicationStatus.Interview]: {
    label: "면접 예정",
    className: "bg-status-purple/10 text-status-purple border-status-purple/20",
    borderLeft: "border-l-status-purple",
  },
  [ApplicationStatus.Accepted]: {
    label: "합격",
    className: "bg-status-success/10 text-status-success border-status-success/20",
    borderLeft: "border-l-status-success",
  },
  [ApplicationStatus.Rejected]: {
    label: "불합격",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
    borderLeft: "border-l-status-danger",
  },
  [ApplicationStatus.Withdrawn]: {
    label: "취소",
    className: "bg-status-neutral/10 text-status-neutral/80 border-status-neutral/20",
    borderLeft: "border-l-status-neutral/30",
  },
};

export const AVAILABILITY_STATUS_CONFIG: Record<AvailabilityStatus, StatusConfig> = {
  [AvailabilityStatus.Available]: {
    label: "투입 가능",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  [AvailabilityStatus.Partial]: {
    label: "투입 가능 예정",
    className: "bg-status-info/10 text-status-info border-status-info/20",
  },
  [AvailabilityStatus.Unavailable]: {
    label: "투입 불가",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
  },
};

export const AVAILABILITY_TOGGLE_CONFIG: Record<AvailabilityStatus, StatusConfig> = {
  [AvailabilityStatus.Available]: {
    label: "투입 가능",
    className: "bg-status-success text-white",
  },
  [AvailabilityStatus.Partial]: {
    label: "투입 가능 예정",
    className: "bg-status-info text-white",
  },
  [AvailabilityStatus.Unavailable]: {
    label: "투입 불가",
    className: "bg-status-danger text-white",
  },
};

export const CONTRACT_TYPE_CONFIG: Record<ContractType, StatusConfig> = {
  [ContractType.Business]: {
    label: "사업자",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  [ContractType.Individual]: {
    label: "3.3%",
    className: "bg-primary/10 text-primary border-primary/20",
  },
};
