"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/src/components/ui/badge";

const services = [
  {
    number: "01",
    category: "Graphic Design",
    title: "Graphic Design",
    description:
      "Posters, pubmats, and social layouts shaped from first idea to final export. I focus on clean composition, readable hierarchy, and visuals that fit the message.",
    src: "/graphic.webp",
    skills: ["Branding", "Layout", "Social Media"],
  },
  {
    number: "02",
    category: "Video Editing",
    title: "Video Editing",
    description:
      "Short-form and long-form edits built around rhythm, pacing, and clarity — from cuts and sound timing to final export.",
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
      className="relative overflow-hidden border-t border-border bg-background px-4 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:gap-16">
        <motion.div
          style={{ y: headerY }}
          className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end"
        >
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl">
            Design, motion, and code — built as one.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            I work across visual design, editing, and development so every detail feels connected from first idea to final build.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const isFirst = index === 0;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className={isFirst ? "md:col-span-2" : "col-span-1"}
              >
                <Link
                  href="#work"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-colors hover:border-foreground/20"
                >
                  <div
                    className={`flex flex-col h-full ${
                      isFirst ? "md:flex-row" : "flex-col"
                    }`}
                  >
                    {/* Image Area */}
                    <div
                      className={`relative overflow-hidden bg-muted ${
                        isFirst
                          ? "min-h-[300px] md:min-h-full md:w-1/2 lg:w-[55%]"
                          : "min-h-[260px] w-full"
                      }`}
                    >
                      <Image
                        src={service.src}
                        alt={`${service.title} preview`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        sizes={isFirst ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, 50vw"}
                      />
                    </div>

                    {/* Content Area */}
                    <div
                      className={`flex flex-1 flex-col justify-between p-6 md:p-8 ${
                        isFirst ? "md:w-1/2 lg:w-[45%]" : "w-full"
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            {service.category}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <h3 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                            {service.title}
                          </h3>
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {service.description}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {service.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-5">
                        <span className="text-sm font-semibold text-foreground transition-colors">
                          View projects
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
