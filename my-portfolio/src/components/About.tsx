"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const timelineData = [
  {
    year: "2021",
    title: "GFX Artist",
    category: "Visuals",
    desc: "This is where it all started — making GFX edits and thumbnails for small communities. Mostly just experimenting and figuring out what looked cool.",
    img: "/2021.webp",
  },
  {
    year: "2022",
    title: "Video Editing",
    category: "Motion",
    desc: "Got into editing videos and immediately got hooked. Learned how to pace cuts, layer audio, and actually tell a story through footage.",
    img: "/2022.webp",
  },

  {
    year: "2024",
    title: "Programming",
    category: "Development",
    desc: "Picked up coding so I could actually build the things I design. Now I do both — I make it look good and I make it work.",
    img: "/2024.webp",
  },
];

export default function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="timeline" className="relative bg-background border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16 flex flex-col gap-3 md:mb-24"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-foreground">
            Timeline
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Creative evolution
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A chronological view of how my work moved from visual design into motion and web development.
          </p>
        </motion.div>

        <div className="flex flex-col border-t border-border">
          {timelineData.map((item, index) => (
            <div
              key={item.year}
              className="group flex cursor-pointer flex-col border-b border-border transition-colors hover:bg-muted/20"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex items-center justify-between py-8 sm:py-10">
                <div className="w-16 text-sm font-bold text-muted-foreground sm:w-24 sm:text-base">
                  {item.year}
                </div>
                <div className="flex-1 text-2xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {item.title}
                </div>
                <div className="hidden text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block sm:w-32">
                  {item.category}
                </div>
              </div>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-16 pr-4 sm:pl-24">
                      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {item.desc}
                      </p>
                      {/* Mobile image fallback */}
                      <div className="mt-6 aspect-[16/10] w-full overflow-hidden rounded-lg sm:hidden">
                        <Image
                          src={item.img}
                          alt={`${item.year} ${item.title}`}
                          width={600}
                          height={375}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hover Image (Desktop only) */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-lg border border-border shadow-2xl sm:block"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              x: 24,
              y: 24,
              width: "320px",
              height: "200px",
            }}
          >
            <Image
              src={timelineData[hoveredIndex].img}
              alt={timelineData[hoveredIndex].title}
              fill
              className="object-cover bg-card"
              sizes="320px"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
