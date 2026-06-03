"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
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

    return () => {
      window.removeEventListener("click", handleAnchorClick);
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
