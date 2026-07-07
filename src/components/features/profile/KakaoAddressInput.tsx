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

// Daum Postcode 스크립트를 동적으로 로드 (이미 로드된 경우 재사용).
// 주소 검색창을 열 때까지 스크립트 로드를 지연시켜 초기 번들 크기를 줄인다.
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

    // cleanup: isOpen이 false로 바뀌거나 컴포넌트가 언마운트될 때
    // stale 플래그로 비동기 콜백이 이미 해제된 DOM에 접근하지 않도록 방어
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
            className="flex-1 h-11 px-3 rounded-lg border border-input bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 shrink-0 h-11 px-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            className="w-full h-11 px-3 rounded-lg border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-2 focus-visible:ring-ring bg-background"
          />
        )}
      </div>

      {/* 카카오 주소 검색 오버레이 - 앱 프레임과 동일한 최대 폭으로 고정 */}
      {isOpen && (
        <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-[70] flex flex-col bg-background">
          <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
            <h3 className="text-base font-semibold">주소 검색</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
