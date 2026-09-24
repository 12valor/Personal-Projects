"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

function subscribeToHoverCapable(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getHoverCapableSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
}

function getServerHoverCapableSnapshot() {
  return false;
}

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useSyncExternalStore(
    subscribeToHoverCapable,
    getHoverCapableSnapshot,
    getServerHoverCapableSnapshot
  );

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const pullX = (e.clientX - centerX) * strength;
    const pullY = (e.clientY - centerY) * strength;
    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!canHover) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
