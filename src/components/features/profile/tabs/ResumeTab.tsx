"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Trash2, Plus } from "lucide-react";
import type { ProfileResume } from "@/types";
import { formatShortDate } from "@/lib/utils/format";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "./TabShared";

const MAX_RESUME_COUNT = 10;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ResumeTabProps {
  resumes: ProfileResume[];
}

export function ResumeTab({ resumes: initialResumes }: ResumeTabProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [resumes, setResumes] = useState<ProfileResume[]>(initialResumes);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingName, setUploadingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setError("");
    setIsUploading(true);
    setUploadingName(file.name);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/profile/resumes", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "업로드에 실패했습니다");
        return;
      }

      setResumes((prev) => [json.resume as ProfileResume, ...prev]);
      router.refresh();
    } finally {
      setIsUploading(false);
      setUploadingName("");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/profile/resumes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "삭제에 실패했습니다");
        return;
      }
      setResumes((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const canUpload = resumes.length < MAX_RESUME_COUNT && !isUploading;

  return (
    <div className="space-y-5">
      <div>
        <SectionHeader title={`이력서 (${resumes.length}/${MAX_RESUME_COUNT})`} />

        <ErrorMessage size="sm">{error}</ErrorMessage>

        {resumes.length === 0 && !isUploading ? (
          <EmptyState
            icon={FileText}
            title="등록된 이력서가 없습니다"
            description="PDF, DOC, DOCX, HWP 파일을 업로드할 수 있습니다"
          />
        ) : (
          <ul className="space-y-2.5">
            {/* 업로드 중인 항목 */}
            {isUploading && (
              <li className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 opacity-60">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground truncate">{uploadingName}</span>
                <span className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin shrink-0" />
              </li>
            )}
            {/* 업로드된 파일 목록 */}
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
              >
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{resume.fileName}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatFileSize(resume.fileSize)} · {formatShortDate(resume.createdAt)}
                  </p>
                </div>
                <a
                  href={`/api/profile/resumes/${resume.id}/download`}
                  download
                  className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="이력서 다운로드"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(resume.id)}
                  disabled={deletingId === resume.id}
                  className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40"
                  aria-label="이력서 삭제"
                >
                  {deletingId === resume.id ? (
                    <span className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin block" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 업로드 버튼 */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.hwp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-hwp,application/haansofthwp"
        className="hidden"
        onChange={handleFileChange}
        aria-label="이력서 파일 선택"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!canUpload}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3.5 text-sm font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        {resumes.length >= MAX_RESUME_COUNT ? `최대 ${MAX_RESUME_COUNT}개까지 업로드 가능` : "이력서 추가"}
      </button>
    </div>
  );
}
