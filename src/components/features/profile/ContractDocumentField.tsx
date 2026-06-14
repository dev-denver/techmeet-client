"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Trash2, Plus } from "lucide-react";
import type { ContractDocument } from "@/types";
import { ErrorMessage } from "@/components/ui/error-message";
import { profileApi } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import type { ContractDocumentType } from "@/lib/constants/contractDocuments";

interface ContractDocumentFieldProps {
  documentType: ContractDocumentType;
  label: string;
  accept: string;
  initialDocument: ContractDocument | null;
}

export function ContractDocumentField({ documentType, label, accept, initialDocument }: ContractDocumentFieldProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentDocument, setCurrentDocument] = useState<ContractDocument | null>(initialDocument);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setError("");
    setIsUploading(true);
    try {
      const { document } = await profileApi.uploadContractDocument(documentType, file);
      setCurrentDocument(document);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete() {
    setError("");
    setIsDeleting(true);
    try {
      await profileApi.deleteContractDocument(documentType);
      setCurrentDocument(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <ErrorMessage size="xs">{error}</ErrorMessage>
      {currentDocument ? (
        <div className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2.5">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 min-w-0 text-sm text-foreground truncate">{currentDocument.fileName}</span>
          <a
            href={`/api/profile/contract-documents/${documentType}/download`}
            download
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`${label} 다운로드`}
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40"
            aria-label={`${label} 삭제`}
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin block" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            aria-label={`${label} 파일 선택`}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40"
          >
            {isUploading ? (
              <span className="w-3.5 h-3.5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            {isUploading ? "업로드 중..." : `${label} 첨부`}
          </button>
        </>
      )}
    </div>
  );
}
