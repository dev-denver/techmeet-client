"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";

declare global {
  interface Window {
    daum?: {
      Postcode: new (config: {
        oncomplete: (data: KakaoPostcodeResult) => void;
        onclose?: () => void;
        width?: string | number;
        height?: string | number;
      }) => {
        embed: (el: HTMLElement, opts?: { autoClose?: boolean }) => void;
      };
    };
  }
}

interface KakaoPostcodeResult {
  roadAddress: string;
  address: string;
  userSelectedType: "R" | "J";
  zonecode: string;
}

async function loadScript(): Promise<void> {
  if (window.daum?.Postcode) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("카카오 주소 검색 스크립트 로드 실패"));
    document.head.appendChild(script);
  });
}

interface KakaoAddressInputProps {
  value: string;
  onChange: (address: string) => void;
}

export function KakaoAddressInput({ value, onChange }: KakaoAddressInputProps) {
  const [base, setBase] = useState("");
  const [detail, setDetail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // 최초 1회 - 외부 value(fetch 완료 후)로 base 동기화
  useEffect(() => {
    if (!initialized.current && value) {
      setBase(value);
      initialized.current = true;
    }
  }, [value]);

  // 카카오 검색창 열릴 때 스크립트 로드 & embed
  useEffect(() => {
    if (!isOpen || !embedRef.current) return;
    let stale = false;

    loadScript()
      .then(() => {
        if (stale || !embedRef.current || !window.daum?.Postcode) return;
        new window.daum.Postcode({
          oncomplete: (data) => {
            const selected = data.roadAddress || data.address;
            setBase(selected);
            setDetail("");
            onChange(selected);
            setIsOpen(false);
          },
          onclose: () => setIsOpen(false),
          width: "100%",
          height: "100%",
        }).embed(embedRef.current, { autoClose: false });
      })
      .catch(console.error);

    return () => { stale = true; };
  }, [isOpen, onChange]);

  function handleDetailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setDetail(v);
    onChange(v.trim() ? `${base} ${v.trim()}` : base);
  }

  return (
    <>
      <div className="space-y-2">
        {/* 기본 주소 (Kakao 검색 결과) */}
        <div className="flex gap-2">
          <input
            type="text"
            value={base}
            readOnly
            placeholder="주소 찾기 버튼을 눌러 검색하세요"
            onClick={() => setIsOpen(true)}
            className="flex-1 h-11 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-800 placeholder:text-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 shrink-0 h-11 px-3 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <MapPin className="h-3.5 w-3.5" />
            주소 찾기
          </button>
        </div>

        {/* 상세 주소 - 기본 주소 선택 후 표시 */}
        {base && (
          <input
            type="text"
            value={detail}
            onChange={handleDetailChange}
            placeholder="상세 주소 입력 (동/호수 등, 선택)"
            className="w-full h-11 px-3 rounded-lg border border-zinc-200 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900"
          />
        )}
      </div>

      {/* 카카오 주소 검색 전체화면 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white">
          <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-200 shrink-0">
            <h3 className="text-base font-semibold">주소 검색</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div ref={embedRef} className="flex-1 w-full" />
        </div>
      )}
    </>
  );
}
