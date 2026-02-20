function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }
  return date;
}

export function formatDate(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function formatBudget(min: number, max: number): string {
  return `월 ${min.toLocaleString()}만원 ~ ${max.toLocaleString()}만원`;
}

export function getDeadlineDays(deadline: string): number | null {
  const deadlineDate = parseDate(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  return diffDays;
}

export function formatDeadlineDays(deadline: string): string {
  const days = getDeadlineDays(deadline);
  if (days === null) return "마감";
  if (days === 0) return "오늘 마감";
  if (days === 1) return "내일 마감";
  return `${days}일 후 마감`;
}

export function formatMonthYear(dateString: string): string {
  const [year, month] = dateString.split("-");
  return `${year}년 ${month}월`;
}

import { WorkType } from "@/types";

export function formatWorkType(workType: WorkType): string {
  if (workType === WorkType.Remote) return "원격";
  if (workType === WorkType.Onsite) return "현장";
  return "하이브리드";
}
