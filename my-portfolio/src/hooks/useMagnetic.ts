"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";

interface UseMagneticOptions {
  strength?: number;
  active?: boolean;
}

function subscribeToFinePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
}

function getServerFinePointerSnapshot() {
  return false;
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  options: UseMagneticOptions = {}
) {
  const { strength = 0.3, active = true } = options;
  const ref = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isFinePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getServerFinePointerSnapshot
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!active || !isFinePointer || !ref.current) return;

      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;

      setPosition({ x: distanceX, y: distanceY });
    },
    [active, isFinePointer, strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave,
    isFinePointer,
  };
}
