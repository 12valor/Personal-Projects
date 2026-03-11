import { useEffect, useState, RefObject } from 'react';

// --- Shared Constants ---
export const ANIMATION_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const ANIMATION_DURATION_MS = 800;

export const STAGGER_BASE_MS = 100;
export const STAGGER_INCREMENT_MS = 100;

// --- Shared Intersection Observer Hook ---
export function useInView(options = { threshold: 0.15 }) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        // Only trigger once for entrance animations
        observer.disconnect();
      }
    }, options);
    
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView] as const;
}

// --- Universal Animation Generators ---

/**
 * Returns the Tailwind classes required to animate an element fading up.
 */
export function getFadeUpClasses(inView: boolean, yOffsetClass = 'translate-y-12'): string {
  if (inView) {
    return 'opacity-100 translate-y-0';
  }
  return `opacity-0 ${yOffsetClass}`;
}

/**
 * Returns a React style object with the centralized duration and stagger delay applied.
 * 
 * @param index - The index of the item to stagger (e.g. 0, 1, 2)
 * @param extraDelayMs - Any absolute delay offset to add before staggering begins
 */
export function getStaggerStyle(inView: boolean, index: number, extraDelayMs = 0): React.CSSProperties {
  // If not in view, we lock it at 0ms delay so it resets instantly (or we just maintain consistency)
  const delay = inView ? extraDelayMs + (index * STAGGER_INCREMENT_MS) : 0;
  
  return {
    transitionProperty: 'all',
    transitionTimingFunction: ANIMATION_EASING,
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionDelay: `${delay}ms`,
  };
}
