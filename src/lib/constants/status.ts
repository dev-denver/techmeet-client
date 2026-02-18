import type { ProjectStatus, ApplicationStatus, AvailabilityStatus } from "@/types";

interface StatusConfig {
  label: string;
  className: string;
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  recruiting: {
    label: "모집중",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  in_progress: {
    label: "진행중",
    className: "bg-status-info/10 text-status-info border-status-info/20",
  },
  completed: {
    label: "완료",
    className: "bg-status-neutral/10 text-status-neutral border-status-neutral/20",
  },
  cancelled: {
    label: "취소",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
  },
};

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  pending: {
    label: "검토 대기",
    className: "bg-status-neutral/10 text-status-neutral border-status-neutral/20",
  },
  reviewing: {
    label: "검토중",
    className: "bg-status-info/10 text-status-info border-status-info/20",
  },
  interview: {
    label: "면접 예정",
    className: "bg-status-purple/10 text-status-purple border-status-purple/20",
  },
  accepted: {
    label: "합격",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  rejected: {
    label: "불합격",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
  },
  withdrawn: {
    label: "취소",
    className: "bg-status-neutral/10 text-status-neutral/80 border-status-neutral/20",
  },
};

export const AVAILABILITY_STATUS_CONFIG: Record<AvailabilityStatus, StatusConfig> = {
  available: {
    label: "투입 가능",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  partial: {
    label: "일부 가능",
    className: "bg-status-warning/10 text-status-warning border-status-warning/20",
  },
  unavailable: {
    label: "투입 불가",
    className: "bg-status-danger/10 text-status-danger border-status-danger/20",
  },
};

export const AVAILABILITY_TOGGLE_CONFIG: Record<AvailabilityStatus, StatusConfig> = {
  available: {
    label: "투입 가능",
    className: "bg-status-success text-white",
  },
  partial: {
    label: "일부 가능",
    className: "bg-status-warning text-yellow-900",
  },
  unavailable: {
    label: "투입 불가",
    className: "bg-status-danger text-white",
  },
};
