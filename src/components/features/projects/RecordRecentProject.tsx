"use client";

import { useEffect } from "react";
import { addRecentProject } from "@/lib/utils/recent-projects";

interface RecordRecentProjectProps {
  id: string;
  title: string;
}

/** 프로젝트 상세 진입 시 최근 본 목록에 기록만 하는 사이드이펙트 컴포넌트 (렌더 없음) */
export function RecordRecentProject({ id, title }: RecordRecentProjectProps) {
  useEffect(() => {
    addRecentProject({ id, title });
  }, [id, title]);

  return null;
}
