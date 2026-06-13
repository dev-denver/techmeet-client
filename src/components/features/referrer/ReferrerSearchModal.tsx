"use client";

import { useState } from "react";
import { X, Search, Check } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { profileApi } from "@/lib/api/profile";
import { useSubmit } from "@/hooks/useSubmit";
import type { ReferrerSearchResult } from "@/types/api";

interface Props {
  onSelect: (referrer: ReferrerSearchResult) => void;
  onClose: () => void;
  hasBottomNav?: boolean;
}

export function ReferrerSearchModal({ onSelect, onClose, hasBottomNav = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReferrerSearchResult[]>([]);
  const [selected, setSelected] = useState<ReferrerSearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const { isLoading, error, setError, submit } = useSubmit();

  async function handleSearch() {
    const q = query.trim();
    if (q.length < 2) {
      setError("검색어는 2자 이상 입력해주세요");
      return;
    }
    setSearched(false);
    setSelected(null);
    await submit(() => profileApi.searchReferrer(q), {
      onSuccess: ({ data }) => {
        setResults(data);
        setSearched(true);
      },
    });
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
    }
  }

  return (
    <BottomSheet open onClose={onClose} hasBottomNav={hasBottomNav}>
      <div className="px-4 pb-5 pt-2 flex flex-col gap-3 min-h-[320px]">
        {/* 헤더 */}
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold">추천인 검색</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-2 shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleSearch(); } }}
            placeholder="이름 또는 010-XXXX-XXXX"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Search className="h-4 w-4" />
            검색
          </button>
        </div>

        {error && <p className="text-sm text-destructive shrink-0">{error}</p>}

        {/* 검색 결과 — flex-1로 남은 공간 채움 */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-1 px-1">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-6">검색 중...</p>
          )}
          {!isLoading && searched && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">검색 결과가 없습니다</p>
          )}
          {!isLoading && !searched && (
            <p className="text-sm text-muted-foreground text-center py-6">이름 또는 전화번호로 검색하세요</p>
          )}
          {!isLoading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors ${
                      selected?.id === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className={`text-xs mt-0.5 ${selected?.id === item.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {item.maskedPhone}
                      </p>
                    </div>
                    {selected?.id === item.id && <Check className="h-4 w-4 shrink-0 ml-2" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 선택 완료 버튼 */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full shrink-0 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          선택 완료
        </button>
      </div>
    </BottomSheet>
  );
}
