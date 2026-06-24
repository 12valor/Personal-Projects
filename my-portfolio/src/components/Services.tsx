"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const services = [
  {
    id: "01",
    number: "01",
    title: "Graphic Design",
    description:
      "Posters, pubmats, and social layouts shaped from first idea to final export, with focus on composition, hierarchy, and message clarity.",
    src: "/graphic.webp",
    skills: ["Branding", "Layout", "Social Media"],
  },
  {
    id: "02",
    number: "02",
    title: "Video Editing",
    description:
      "Short-form and long-form edits built around rhythm, pacing, sound timing, and clear visual storytelling.",
    src: "/vid.webp",
    skills: ["Reels", "Cuts", "Sound"],
  },
  {
    id: "03",
    number: "03",
    title: "Web Design",
    description:
      "Responsive websites designed and developed as real systems, with clean interfaces, thoughtful interactions, and production-ready structure.",
    src: "/web.webp",
    skills: ["Frontend", "Responsive", "UI/UX"],
  },
];

export default function Services() {
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0].id);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background px-4 py-20 md:px-10 md:py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
            Services built across design, motion, and code.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            I work across visuals, editing, and development so every output feels connected from idea to final build.
          </p>
        </div>

        {/* Services List */}
        <div className="flex flex-col border-t border-border/40">
          {services.map((service) => {
            const isActive = activeServiceId === service.id;

            return (
              <div
                key={service.id}
                className="group border-b border-border/40 transition-colors hover:bg-muted/20"
              >
                {/* Row Header */}
                <button
                  onClick={() => setActiveServiceId(isActive ? "" : service.id)}
                  className="w-full py-6 md:py-10 flex items-center text-left gap-4 md:gap-8 cursor-pointer focus:outline-none"
                  aria-expanded={isActive}
                >
                  {/* Left: Number */}
                  <div className="w-8 md:w-24 shrink-0 text-sm font-medium text-muted-foreground">
                    {service.number}
                  </div>

                  {/* Middle & Right Header */}
                  <div className="flex-1 flex justify-between items-center">
                    <h3
                      className={`text-3xl md:text-5xl font-medium tracking-tight transition-colors duration-300 ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <div
                      className={`text-muted-foreground transition-transform duration-500 ${
                        isActive ? "rotate-45 text-foreground" : "group-hover:rotate-90"
                      }`}
                    >
                      <Plus className="size-6 md:size-8 font-light" strokeWidth={1.5} />
                    </div>
                  </div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pb-12 flex flex-col lg:flex-row gap-8 lg:gap-16 pl-12 md:pl-32">
                        {/* Middle: Description & Tags */}
                        <div className="flex-1 flex flex-col gap-6 justify-center">
                          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-md">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-border/40 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          {/* CTA */}
                          <Link
                            href="#work"
                            className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-foreground mt-2 md:mt-4 w-fit group/cta transition-colors hover:text-muted-foreground"
                          >
                            <span>View projects</span>
                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                          </Link>
                        </div>

                        {/* Right: Image Preview */}
                        <div className="lg:w-80 shrink-0">
                          <div className="relative w-full aspect-video md:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 border border-border/20">
                            <Image
                              src={service.src}
                              alt={`${service.title} preview`}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 320px"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

