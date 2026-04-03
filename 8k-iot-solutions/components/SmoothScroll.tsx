"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Detect mobile to disable/reduce smoothing
    const isMobile = window.innerWidth < 1024;

    const lenis = new Lenis({
      duration: isMobile ? 0 : 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1, // Increase sensitivity slightly for better response
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

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
      lenisRef.current = null;
      window.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 5. Reset scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
