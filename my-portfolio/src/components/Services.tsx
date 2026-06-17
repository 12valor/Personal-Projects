"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Film, Palette } from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/src/components/ui/badge";
import TiltedCard from "./TiltedCard";

const services = [
  {
    title: "Graphic Design",
    eyebrow: "Visual Systems",
    description: "Static visuals with stronger hierarchy, cleaner composition, and brand-aware direction.",
    src: "/graphic.webp",
    icon: Palette,
    skills: ["Pubmats", "GFX", "Layouts"],
  },
  {
    title: "Video Editing",
    eyebrow: "Motion Stories",
    description: "Short and long-form edits shaped through pacing, sound, rhythm, and narrative clarity.",
    src: "/vid.webp",
    icon: Film,
    skills: ["Reels", "Cuts", "Sound"],
  },
  {
    title: "Web Design",
    eyebrow: "Interactive Builds",
    description: "Modern web interfaces that connect visual taste with usable, responsive experiences.",
    src: "/web.webp",
    icon: Code2,
    skills: ["UI", "Frontend", "Responsive"],
  },
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.4], [32, -10]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative overflow-hidden border-t border-border bg-muted/30 px-4 py-20 md:px-10 md:py-28"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 select-none text-[22vw] font-black tracking-tighter text-foreground/[0.025]"
      >
        SERVICES
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12">
        <motion.div
          style={{ y: headerY }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              What I Do
            </span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Design, motion, and web work in one flow.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            I move from idea to polished output across graphics, videos, and front-end experiences.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <TiltedCard
                    imageSrc={service.src}
                    altText={service.title}
                    captionText={service.title}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={10}
                    scaleOnHover={1.04}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent
                    overlayContent={
                      <div className="flex h-full w-full items-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                              {service.eyebrow}
                            </p>
                            <h3 className="text-2xl font-semibold">{service.title}</h3>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>

                <div className="flex min-h-[220px] flex-col justify-between gap-8 p-5">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
