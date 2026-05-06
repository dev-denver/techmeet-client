function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }
  return date;
} 

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = parseDate(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = parseDate(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function getDeadlineDays(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const deadlineDate = parseDate(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  return diffDays;
}

export function formatDeadlineDays(deadline: string | null | undefined): string {
  const days = getDeadlineDays(deadline);
  if (days === null) return "마감";
  if (days === 0) return "오늘 마감";
  if (days === 1) return "내일 마감";
  return `${days}일 후 마감`;
}

export function formatExperience(years: number | null, months: number): string {
  const y = years ?? 0;
  if (y === 0 && months === 0) return "경력 없음";
  if (months === 0) return `${y}년`;
  if (y === 0) return `${months}개월`;
  return `${y}년 ${months}개월`;
}

export function formatMonthYear(dateString: string): string {
  const [year, month] = dateString.split("-");
  return `${year}년 ${month}월`;
}

import { WorkType, ProjectType } from "@/types";

export function formatWorkType(workType: WorkType | null | undefined): string {
  if (workType === WorkType.Remote) return "원격";
  if (workType === WorkType.Onsite) return "현장";
  if (workType === WorkType.Hybrid) return "하이브리드";
  return "-";
}

export function formatProjectType(projectType: ProjectType | null | undefined): string {
  if (projectType === ProjectType.Web) return "웹개발";
  if (projectType === ProjectType.Mobile) return "모바일";
  if (projectType === ProjectType.Backend) return "백엔드";
  if (projectType === ProjectType.Fullstack) return "풀스택";
  if (projectType === ProjectType.Data) return "데이터";
  if (projectType === ProjectType.Design) return "디자인";
  if (projectType === ProjectType.Other) return "기타";
  return "-";
}

export function formatProjectPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string | null {
  if (!startDate && !endDate) return null;
  const fmt = (d: string) => {
    const [year, month] = d.split("-");
    return `${year}.${month.padStart(2, "0")}`;
  };
  if (startDate && endDate) return `${fmt(startDate)} ~ ${fmt(endDate)}`;
  if (startDate) return `${fmt(startDate)} 시작`;
  return `~ ${fmt(endDate!)}`;
}
