"use client";

import React from "react";
import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "framer-motion";

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

// Premium project card scroll-reveal cubic-bezier easing curve
export const PROJECT_CARD_EASING = [0.22, 1, 0.36, 1] as const;

export const projectCardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay,
      ease: PROJECT_CARD_EASING,
    },
  }),
};

export interface ProjectCardRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  index?: number;
  staggerIndex?: number;
  staggerGroupSize?: number;
  delay?: number;
}

/**
 * ProjectCardReveal
 * One consistent, premium scroll-reveal animation across all portfolio project cards.
 * - Initial state: opacity 0, translateY(40px), scale(0.96)
 * - Visible state: opacity 1, translateY(0), scale(1)
 * - Duration: 0.7s
 * - Stagger: 0.1s between cards in each visible group
 * - Easing: cubic-bezier(0.22, 1, 0.36, 1)
 * - Replays in either direction (resets when leaving viewport, re-animates upon re-entering)
 * - Uses hysteresis margins (-40px) to prevent boundary flickering
 * - Respects prefers-reduced-motion
 */
export function ProjectCardReveal({
  children,
  className = "",
  index = 0,
  staggerIndex,
  staggerGroupSize = 2,
  delay,
  ...props
}: ProjectCardRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveIndex = staggerIndex !== undefined ? staggerIndex : index;
  const computedDelay =
    delay !== undefined
      ? delay
      : (effectiveIndex % Math.max(1, staggerGroupSize)) * 0.1;

  if (shouldReduceMotion) {
    return (
      <div className={className} {...(props as any)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={projectCardRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15, margin: "-40px 0px -40px 0px" }}
      custom={computedDelay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * useProjectCardReveal
 * Reusable hook providing Motion props for project card scroll reveal.
 */
export function useProjectCardReveal(
  index = 0,
  staggerGroupSize = 2,
  customDelay?: number
) {
  const shouldReduceMotion = useReducedMotion();
  const delay =
    customDelay !== undefined
      ? customDelay
      : (index % Math.max(1, staggerGroupSize)) * 0.1;

  return {
    variants: projectCardRevealVariants,
    initial: shouldReduceMotion ? false : "hidden",
    whileInView: shouldReduceMotion ? undefined : "visible",
    viewport: { once: false, amount: 0.15, margin: "-40px 0px -40px 0px" },
    custom: delay,
  };
}
