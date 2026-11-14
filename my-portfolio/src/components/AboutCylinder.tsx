"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { Project } from "./WorkGrid";
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

type Preview = { project: Project; x: number; y: number };

function TextWords({ indices, projects, onPreview, animated = false, duplicate = false }: { indices: number[]; projects: Project[]; onPreview: (preview: Preview | null) => void; animated?: boolean; duplicate?: boolean }) {
  return indices.map((index, position) => {
    const word = words[index];
    const project = word.text.startsWith("TalisayTourism.com")
      ? projects.find((item) => item.title.toLowerCase().includes("talisay tourism"))
      : word.text.startsWith("WebSystemBuilders.com")
        ? projects.find((item) => item.title.toLowerCase().includes("websystembuilders"))
        : undefined;
    return <span key={index}>{position > 0 && " "}{project && animated ? <button type="button" className={styles.website} onMouseMove={(event) => onPreview({ project, x: event.clientX, y: event.clientY })} onMouseLeave={() => onPreview(null)} onFocus={(event) => { const rect = event.currentTarget.getBoundingClientRect(); onPreview({ project, x: rect.left + rect.width / 2, y: rect.bottom }); }} onBlur={() => onPreview(null)} onClick={(event) => onPreview({ project, x: event.clientX || event.currentTarget.getBoundingClientRect().left, y: event.clientY || event.currentTarget.getBoundingClientRect().bottom })} onKeyDown={(event) => { if (event.key === "Escape") onPreview(null); }} aria-label={`Preview ${project.title}`}>{word.text}</button> : <span aria-hidden={duplicate || undefined}>{word.highlighted ? <strong className={word.text.includes(".com") ? styles.website : undefined}>{word.text}</strong> : word.text}</span>}</span>;
  });
}

function CylinderLine({ indices, index, count, radius, progress, projects, onPreview }: { indices: number[]; index: number; count: number; radius: number; progress: MotionValue<number>; projects: Project[]; onPreview: (preview: Preview | null) => void }) {
  const transform = useTransform(progress, (value) => {
    const angle = (value * (count - 1) - index) * 0.18;
    return `translateZ(${-radius}px) rotateX(${angle}rad) translateZ(${radius}px)`;
  });
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(value * (count - 1) - index);
    return Math.max(0, Math.min(1, (6 - distance) / 2));
  });
  return <motion.div className={`${styles.line} ${index === count - 1 ? styles.lastLine : ""}`} style={{ transform, opacity }}><TextWords indices={indices} projects={projects} onPreview={onPreview} animated duplicate /></motion.div>;
}

export default function AboutCylinder({ projects }: { projects: Project[] }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const section = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ lines: number[][]; lineHeight: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useLayoutEffect(() => {
    if (!preview || !inner.current || !card.current) return;
    const container = inner.current.getBoundingClientRect();
    const { width, height } = card.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(preview.x + 16, window.innerWidth - width - 8));
    const y = preview.y + 16 + height <= window.innerHeight - 8 ? preview.y + 16 : Math.max(8, preview.y - height - 16);
    card.current.style.left = `${x - container.left}px`;
    card.current.style.top = `${y - container.top}px`;
  }, [preview]);

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
        <div ref={inner} className={styles.inner}>
          <h2 className={styles.semantic}>About me</h2>
          <p className={animated ? styles.semantic : styles.staticText}><TextWords indices={words.map((_, index) => index)} projects={projects} onPreview={setPreview} animated={!animated} /></p>
          <div ref={measure} className={styles.measure} aria-hidden="true">
            {words.map((word, index) => <Fragment key={index}><span data-word>{word.highlighted ? <strong>{word.text}</strong> : word.text}</span>{index < words.length - 1 ? " " : ""}</Fragment>)}
          </div>
          {preview && <div ref={card} className={styles.preview} role="status">
            {preview.project.image_url && <Image src={preview.project.image_url} alt="" width={360} height={203} className={styles.previewImage} />}
            <div className={styles.previewDetails}><strong>{preview.project.title}</strong><span>{preview.project.category}</span></div>
          </div>}
          {animated && <div className={styles.viewport}>
            <div className={styles.cylinder}>
              {layout.lines.map((line, index) => <CylinderLine key={index} indices={line} index={index} count={layout.lines.length} radius={layout.lineHeight / 0.18} progress={scrollYProgress} projects={projects} onPreview={setPreview} />)}
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}

