"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // 1. Detect mobile to disable/reduce smoothing
    const isMobile = window.innerWidth < 1024;

    const lenis = new Lenis({
      duration: isMobile ? 0 : 0.8, // Disable on mobile for native feel/perf
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId: number;

    // 2. Setup the RequestAnimationFrame loop
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // 3. Handle anchor links smoothly
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        e.preventDefault();
        lenis.scrollTo(anchor.hash, {
          offset: -80, // Offset for sticky navbar
          duration: 1.5,
        });
      }
    };

    window.addEventListener("click", handleAnchorClick);

    // 4. Clean up on unmount
    return () => {
      lenis.destroy();
      window.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
