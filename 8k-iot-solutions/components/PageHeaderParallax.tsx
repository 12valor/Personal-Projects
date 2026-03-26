"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PageHeaderParallaxProps {
  children: React.ReactNode;
  fadeEndOffset?: number; // How far to scroll before opacity hits 0 (e.g. 0.7 = 70% of viewport)
}

export default function PageHeaderParallax({ 
  children, 
  fadeEndOffset = 0.8 
}: PageHeaderParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Since this is typically at the top of the page, we use "start start" 
  // and "end start" (header bottom hits viewport top).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, fadeEndOffset], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}
