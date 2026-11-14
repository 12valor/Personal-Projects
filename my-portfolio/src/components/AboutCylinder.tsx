"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import styles from "./AboutCylinder.module.css";

const biography = "I'm AG Evangelista, a UI/UX designer, full-stack developer, and founder currently studying at the Technological University of the Philippines Visayas. My work spans web design and development, graphic design, and video editing, combining creativity with technical problem-solving to bring ideas to life. One of my proudest accomplishments is building TalisayTourism.com, and I'm also developing WebSystemBuilders.com, a startup I envision becoming a marketplace for ready-made and custom web systems for students, capstone projects, and businesses. Alongside my studies, I work with clients to deliver thoughtful, functional, and visually engaging digital experiences. I'm constantly exploring new ideas, refining my skills, and building things that make a difference.";
const highlights = /AG Evangelista|UI\/UX designer|full-stack developer|founder|TalisayTourism\.com|WebSystemBuilders\.com|Technological University of the Philippines Visayas/g;
const matches = [...biography.matchAll(highlights)];
let offset = 0;
const words = biography.split(" ").map((text) => {
  const highlighted = matches.some((match) => offset < match.index + match[0].length && offset + text.length > match.index);
  offset += text.length + 1;
  return { text, highlighted };
});

function TextWords({ indices }: { indices: number[] }) {
  return indices.map((index, position) => (
    <span key={index}>{position > 0 && " "}{words[index].highlighted ? <strong className={words[index].text.includes(".com") ? styles.website : undefined}>{words[index].text}</strong> : words[index].text}</span>
  ));
}

function CylinderLine({ indices, index, count, radius, progress }: { indices: number[]; index: number; count: number; radius: number; progress: MotionValue<number> }) {
  const transform = useTransform(progress, (value) => {
    const angle = (value * (count - 1) - index) * 0.18;
    return `translateZ(${-radius}px) rotateX(${angle}rad) translateZ(${radius}px)`;
  });
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(value * (count - 1) - index);
    return Math.max(0, Math.min(1, (6 - distance) / 2));
  });
  return <motion.div className={styles.line} style={{ transform, opacity }}><TextWords indices={indices} /></motion.div>;
}

export default function AboutCylinder() {
  const section = useRef<HTMLElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ lines: number[][]; lineHeight: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    const element = measure.current;
    if (!element) return;
    let active = true;
    const update = () => {
      if (!active) return;
      const lines: number[][] = [];
      let previousTop = -1;
      element.querySelectorAll<HTMLElement>("[data-word]").forEach((span, index) => {
        const top = span.offsetTop;
        if (top !== previousTop) {
          lines.push([index]);
          previousTop = top;
        } else {
          lines[lines.length - 1].push(index);
        }
      });
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      if (lines.length && Number.isFinite(lineHeight)) setLayout({ lines, lineHeight });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    document.fonts.ready.then(update);
    update();
    return () => { active = false; observer.disconnect(); };
  }, []);

  const animated = !!layout && !reducedMotion;
  return (
    <section ref={section} id="about" className={styles.section} style={animated ? { minHeight: `calc(100svh + ${Math.max(0, layout.lines.length - 1) * layout.lineHeight * 2}px)` } : undefined}>
      <div className={styles.sticky}>
        <div className={styles.inner}>
          <div className={styles.heading}>
            <span>About me</span>
            <h2>Designing with purpose.<br />Building what matters.</h2>
          </div>
          <p className={animated ? styles.semantic : styles.staticText}><TextWords indices={words.map((_, index) => index)} /></p>
          <div ref={measure} className={styles.measure} aria-hidden="true">
            {words.map((word, index) => <Fragment key={index}><span data-word>{word.highlighted ? <strong>{word.text}</strong> : word.text}</span>{index < words.length - 1 ? " " : ""}</Fragment>)}
          </div>
          {animated && <div className={styles.viewport} aria-hidden="true">
            <div className={styles.cylinder}>
              {layout.lines.map((line, index) => <CylinderLine key={index} indices={line} index={index} count={layout.lines.length} radius={layout.lineHeight / 0.18} progress={scrollYProgress} />)}
            </div>
          </div>}
          {animated && <span className={styles.hint} aria-hidden="true">Scroll to explore <span>↓</span></span>}
        </div>
      </div>
    </section>
  );
}

