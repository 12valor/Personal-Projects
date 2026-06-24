"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const services = [
  {
    number: "01",
    category: "Graphic Design",
    title: "Graphic Design",
    description:
      "Posters, pubmats, and social layouts shaped from first idea to final export, with focus on composition, hierarchy, and message clarity.",
    src: "/graphic.webp",
    skills: ["Branding", "Layout", "Social Media"],
  },
  {
    number: "02",
    category: "Video Editing",
    title: "Video Editing",
    description:
      "Short-form and long-form edits built around rhythm, pacing, sound timing, and clear visual storytelling.",
    src: "/vid.webp",
    skills: ["Reels", "Cuts", "Sound"],
  },
  {
    number: "03",
    category: "Web Design",
    title: "Web Design",
    description:
      "Responsive websites designed and developed as real systems, with clean interfaces, thoughtful interactions, and production-ready structure.",
    src: "/web.webp",
    skills: ["Frontend", "Responsive", "UI/UX"],
  },
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.35], [24, -8]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative overflow-hidden bg-background px-4 py-16 md:px-10 md:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-16 md:gap-24">
        {/* Header */}
        <motion.div
          style={{ y: headerY }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
            Services built across design, motion, and code.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            I work across visuals, editing, and development so every output feels connected from idea to final build.
          </p>
        </motion.div>

        {/* Services List */}
        <div className="flex flex-col">
          <div className="border-t border-border/40">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href="#work"
                  className="group flex flex-col md:flex-row gap-6 md:gap-8 border-b border-border/40 py-8 md:py-10 transition-colors hover:border-foreground/30"
                >
                  {/* Left: Number / Category */}
                  <div className="md:w-32 shrink-0 pt-1 md:pt-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {service.number}
                    </span>
                  </div>

                  {/* Middle: Title, Description, Tags */}
                  <div className="flex flex-col gap-4 flex-1">
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground max-w-md">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-4">
                      {service.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-foreground/30 group-hover:text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Image Preview & CTA */}
                  <div className="flex flex-col gap-6 md:w-56 shrink-0 md:items-end justify-between mt-4 md:mt-0">
                    <div className="relative w-full aspect-video md:aspect-[4/3] md:w-56 md:h-36 overflow-hidden rounded-lg bg-muted border border-border/10">
                      <Image
                        src={service.src}
                        alt={`${service.title} preview`}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 250px"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground w-full md:justify-end">
                      <span className="transition-colors group-hover:text-muted-foreground">
                        View projects
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

