export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function formatBudget(min: number, max: number): string {
  return `월 ${min.toLocaleString()}만원 ~ ${max.toLocaleString()}만원`;
}

export function formatDeadlineDays(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "마감";
  if (diffDays === 0) return "오늘 마감";
  if (diffDays === 1) return "내일 마감";
  return `${diffDays}일 후 마감`;
}

export function formatMonthYear(dateString: string): string {
  const [year, month] = dateString.split("-");
  return `${year}년 ${month}월`;
}
