"use client";

import React from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

// Crisp, intentional cubic-bezier curve (no-ai-slop standard: mechanical & responsive, avoiding generic floaty 300ms ease)
export const POP_EASING = [0.16, 1, 0.3, 1] as const;

export const popUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: POP_EASING,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  scale?: number;
  duration?: number;
}

/**
 * ScrollReveal
 * Wraps any section or element with a subtle lift & scale reveal on scroll.
 * Triggers once by default with a -8% viewport margin for natural timing.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  yOffset = 20,
  scale = 0.97,
  duration = 0.55,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        duration,
        delay,
        ease: POP_EASING,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

/**
 * ScrollStagger
 * Orchestrates staggered entrance animations for child elements.
 */
export function ScrollStagger({
  children,
  className = "",
  staggerDelay = 0.07,
  delayChildren = 0.05,
  ...props
}: ScrollStaggerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  scale?: number;
}

/**
 * ScrollStaggerItem
 * Individual child inside a ScrollStagger container.
 */
export function ScrollStaggerItem({
  children,
  className = "",
  yOffset = 20,
  scale = 0.97,
  ...props
}: ScrollStaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset, scale },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: POP_EASING,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
