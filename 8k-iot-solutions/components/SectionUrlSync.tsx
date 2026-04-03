'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SectionUrlSync() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const initialScrollHandled = useRef(false);

  // 1. Handle initial load scrolling AND client-side cross-page routing
  useEffect(() => {
    // Check if we arrived here from another page clicking a nav link
    const pendingScroll = sessionStorage.getItem('pendingSectionScroll');
    
    if (pendingScroll) {
      sessionStorage.removeItem('pendingSectionScroll');
      
      // We wait just an instant for the layout to finish mounting
      setTimeout(() => {
        const element = document.getElementById(pendingScroll);
        if (element) {
          const navbarOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navbarOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      
      return; // Skip normal initial load logic if we handled a pending scroll
    }

    if (initialScrollHandled.current) return;
    
    // We only care if we loaded distinctly at a known section path (direct link visit)
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
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the most prominent intersecting entry
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        const bestEntry = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        
        const targetPath = bestEntry.target.id === 'home' ? '/' : `/${bestEntry.target.id}`;

        if (window.location.pathname !== targetPath) {
           clearTimeout(scrollTimeout);
           scrollTimeout = setTimeout(() => {
             window.history.replaceState(null, '', targetPath);
           }, 300); // Increased debounce to prevent friction during deceleration stop
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -40% 0px', 
      threshold: [0.5], 
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
