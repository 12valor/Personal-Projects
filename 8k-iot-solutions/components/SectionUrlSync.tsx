'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SectionUrlSync() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const initialScrollHandled = useRef(false);

  // 1. Handle initial load scrolling
  useEffect(() => {
    if (initialScrollHandled.current) return;
    
    // We only care if we loaded distinctly at a known section path 
    const isSectionPath = ['/about', '/services', '/contact'].includes(pathname);
    
    if (isSectionPath) {
      initialScrollHandled.current = true;
      const targetId = pathname.slice(1); // removes the '/'
      
      // Wait for DOM to finish hydration before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const navbarOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navbarOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth' // or 'instant' if immediate jump is preferred
          });
        }
      }, 500);
    } else {
      initialScrollHandled.current = true;
    }
  }, [pathname]);

  // 2. Handle scroll observing
  useEffect(() => {
    // Only run on the root/home base view
    if (pathname.startsWith('/admin') || pathname.startsWith('/projects/')) return;

    const sections = ['home', 'about', 'services', 'contact'];
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the most prominent intersecting entry
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Find the entry that has the largest intersection ratio
        const bestEntry = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        
        const currentHash = window.location.pathname;
        const targetPath = bestEntry.target.id === 'home' ? '/' : `/${bestEntry.target.id}`;

        // Only update if it actually changed and we aren't rapidly scrolling
        if (currentHash !== targetPath) {
           window.history.replaceState(null, '', targetPath);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -40% 0px', // Triggers when section is roughly in the middle 60% of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1], // Provide multiple thresholds for better detection
    });

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  return null;
}
