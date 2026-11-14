"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import styles from "./ScrollReveal.module.css";

type RevealProps = ComponentPropsWithoutRef<"div"> & { delay?: number };

export function ScrollReveal({ children, className = "", delay = 0, style, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.reveal = entry.isIntersecting ? "visible" : "hidden";
    }, { rootMargin: "80px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`${styles.reveal} ${className}`} style={{ ...style, "--reveal-delay": `${delay}s` } as CSSProperties} {...props}>{children}</div>;
}

export function ScrollStagger({ children, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props}>{children}</div>;
}

export function ScrollStaggerItem(props: RevealProps) {
  return <ScrollReveal {...props} className={`${styles.staggerItem} ${props.className ?? ""}`} />;
}

export function ProjectCardReveal({ index = 0, staggerIndex, staggerGroupSize = 2, delay, ...props }: RevealProps & { index?: number; staggerIndex?: number; staggerGroupSize?: number }) {
  return <ScrollReveal {...props} delay={delay ?? ((staggerIndex ?? index) % Math.max(1, staggerGroupSize)) * 0.12} />;
}
