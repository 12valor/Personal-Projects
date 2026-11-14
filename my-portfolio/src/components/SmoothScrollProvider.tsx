"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

const SmoothScrollContext = createContext<Lenis | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointerOnly = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    // Native touch momentum scrolling is hardware-accelerated on mobile; skip Lenis rAF loop there.
    if (prefersReducedMotion || isCoarsePointerOnly) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    let rafId = 0;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  // Update Lenis scroll boundaries on route changes
  useEffect(() => {
    if (!lenis) return;
    lenis.resize();
  }, [pathname, lenis]);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollContext.Provider value={lenis}>
        {children}
      </SmoothScrollContext.Provider>
    </MotionConfig>
  );
}
