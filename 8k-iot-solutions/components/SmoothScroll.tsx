"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();

  useEffect(() => {
    let scrollTimeout: number | null = null;

    const markScrolling = () => {
      document.documentElement.classList.add("is-scrolling");

      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
        scrollTimeout = null;
      }, 140);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (
        anchor && 
        anchor.hash && 
        anchor.origin === window.location.origin &&
        (anchor.pathname === window.location.pathname || anchor.pathname === '/')
      ) {
        e.preventDefault();
        const targetId = anchor.hash.replace("#", "");
        const element = document.getElementById(targetId);

        if (element) {
          const navbarOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navbarOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          window.location.hash = anchor.hash;
        }
      }
    };

    window.addEventListener("click", handleAnchorClick);
    window.addEventListener("scroll", markScrolling, { passive: true });

    return () => {
      window.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", markScrolling);
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return <>{children}</>;
}
