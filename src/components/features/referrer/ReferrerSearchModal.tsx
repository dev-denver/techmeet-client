"use client";

import { useState } from "react";
import { X, Search, Check } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    const q = query.trim();
    if (q.length < 2) {
      setError("검색어는 2자 이상 입력해주세요");
      return;
    }
    setError("");
    setIsLoading(true);
    setSearched(false);
    setSelected(null);
    try {
      const res = await fetch(`/api/profile/referrer/search?q=${encodeURIComponent(q)}`);
      const data = await res.json() as { data?: ReferrerSearchResult[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "검색 중 오류가 발생했습니다");
        return;
      }
      setResults(data.data ?? []);
      setSearched(true);
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
    }
  }

  return (
    <BottomSheet open onClose={onClose} hasBottomNav={hasBottomNav}>
      <div className="p-4 pb-8 flex flex-col gap-4 max-h-[80vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천인 검색</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleSearch(); } }}
            placeholder="이름 또는 010-XXXX-XXXX"
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Search className="h-4 w-4" />
            검색
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-zinc-400 text-center py-6">검색 중...</p>
          )}
          {!isLoading && searched && results.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-6">검색 결과가 없습니다</p>
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
                        ? "bg-zinc-900 text-white"
                        : "hover:bg-zinc-50 text-zinc-800"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className={`text-xs mt-0.5 ${selected?.id === item.id ? "text-zinc-300" : "text-zinc-400"}`}>
                        {item.maskedPhone}
                      </p>
                    </div>
                    {selected?.id === item.id && <Check className="h-4 w-4 shrink-0" />}
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
          className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          선택 완료
        </button>
      </div>
    </BottomSheet>
  );
}
