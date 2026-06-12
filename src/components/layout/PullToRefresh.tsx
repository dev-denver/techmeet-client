"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowDown } from "lucide-react";

const THRESHOLD = 70; // 이 거리 이상 당기면 새로고침
const MAX_PULL = 110; // 최대 당김 거리
const RESISTANCE = 0.5; // 당김 저항 (실제 이동의 절반만 반영)

/**
 * 모바일 당겨서 새로고침. 라이브러리 없이 main 스크롤 컨테이너의 터치 이벤트로 구현.
 * scrollTop이 0일 때만 동작하며, 임계값을 넘기면 router.refresh()로 서버 컴포넌트를 재요청한다.
 */
export function PullToRefresh() {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // 리스너를 한 번만 부착하기 위해 최신 값을 ref로 보관
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const startYRef = useRef<number | null>(null);

  const updatePull = (v: number) => {
    pullRef.current = v;
    setPull(v);
  };
  const updateRefreshing = (v: boolean) => {
    refreshingRef.current = v;
    setRefreshing(v);
  };

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    // 클로저 안에서도 null 아님이 유지되도록 지역 상수에 바인딩 (non-null 단언 제거)
    const el = main;

    function onTouchStart(e: TouchEvent) {
      if (!refreshingRef.current && el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
      } else {
        startYRef.current = null;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (startYRef.current === null || refreshingRef.current) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy > 0 && el.scrollTop <= 0) {
        const dist = Math.min(MAX_PULL, dy * RESISTANCE);
        updatePull(dist);
        if (dist > 4) e.preventDefault(); // 당기는 동안 네이티브 오버스크롤 방지
      } else if (pullRef.current !== 0) {
        updatePull(0);
      }
    }

    function onTouchEnd() {
      if (startYRef.current === null) return;
      startYRef.current = null;
      if (pullRef.current >= THRESHOLD && !refreshingRef.current) {
        updateRefreshing(true);
        updatePull(THRESHOLD);
        router.refresh();
        // router.refresh()는 완료 신호가 없어 짧은 지연 후 인디케이터를 닫는다
        window.setTimeout(() => {
          updateRefreshing(false);
          updatePull(0);
        }, 600);
      } else {
        updatePull(0);
      }
    }

    main.addEventListener("touchstart", onTouchStart, { passive: true });
    main.addEventListener("touchmove", onTouchMove, { passive: false });
    main.addEventListener("touchend", onTouchEnd, { passive: true });
    main.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      main.removeEventListener("touchstart", onTouchStart);
      main.removeEventListener("touchmove", onTouchMove);
      main.removeEventListener("touchend", onTouchEnd);
      main.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [router]);

  const visible = pull > 0 || refreshing;
  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <div
      aria-hidden={!refreshing}
      className="pointer-events-none absolute left-1/2 top-16 z-40 flex -translate-x-1/2 items-center justify-center transition-opacity"
      style={{ transform: `translate(-50%, ${pull}px)`, opacity: visible ? 1 : 0 }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-md">
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className="h-4 w-4 text-muted-foreground transition-transform"
            style={{ transform: `rotate(${progress >= 1 ? 180 : 0}deg)`, opacity: 0.3 + progress * 0.7 }}
          />
        )}
      </div>
    </div>
  );
}
