"use client";

import { useEffect, useRef, useState } from "react";

export function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;
    mainRef.current = mainEl as HTMLElement;

    const handleScroll = () => {
      setScrolled(mainEl.scrollTop > threshold);
    };

    mainEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
