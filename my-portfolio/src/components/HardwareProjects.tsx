"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "./ScrollReveal";
import { Magnetic } from "./ui/Magnetic";
import type { SerializedProject } from "../lib/project-mappers";

interface HardwareProjectsProps {
  projects: SerializedProject[];
}

export const HARDWARE_CATEGORIES = [
  "Hardware",
  "Embedded Systems",
  "IoT",
  "Arduino",
  "Electronics",
  "Robotics",
  "Firmware",
];

export function isHardwareProject(project: { category?: string | null }): boolean {
  if (!project.category) return false;
  const cat = project.category.toLowerCase().trim();
  return HARDWARE_CATEGORIES.some((c) => cat.includes(c.toLowerCase()));
}

export default function HardwareProjects({ projects }: HardwareProjectsProps) {
  // Only display published hardware projects sorted by display_index
  const hardwareItems = useMemo(() => {
    return projects
      .filter((p) => p.is_published !== false && isHardwareProject(p))
      .sort((a, b) => a.display_index - b.display_index);
  }, [projects]);

  return (
    <section
      id="hardware"
      aria-label="Hardware Projects & Case Studies"
      className="relative overflow-hidden bg-background px-4 py-20 md:px-10 md:py-32 border-t border-border/40"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Cpu className="w-3.5 h-3.5" />
            <span>Systems &amp; Circuits</span>
          </div>

          <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
            Hardware Projects
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            From circuits to working prototypes, explore the hardware projects I&apos;ve designed, built, and tested.
          </p>
        </ScrollReveal>

        {/* Content / Grid */}
        {hardwareItems.length === 0 ? (
          <ScrollReveal className="mx-auto w-full max-w-2xl rounded-2xl border border-dashed border-border/80 bg-muted/10 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No Hardware Projects Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New physical computing builds, firmware architectures, and PCB case studies will be published here soon.
            </p>
          </ScrollReveal>
        ) : (
          <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {hardwareItems.map((project) => {
              const caseStudy = project.case_study;
              const status = caseStudy?.status || "Prototype";
              const components = caseStudy?.hardware_components || [];
              const tools = caseStudy?.software_tools || [];
              const slugOrId = project.slug || project.id;
              const href = `/hardware/${slugOrId}`;

              return (
                <ScrollStaggerItem key={project.id}>
                  <article className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
                    {/* Media Container */}
                    <Link
                      href={href}
                      className="relative block w-full aspect-[16/10] overflow-hidden bg-muted/40"
                    >
                      {project.preview_video_url ? (
                        <video
                          src={project.preview_video_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={project.image_url || undefined}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/30">
                          <Cpu className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      )}

                      {/* Status & Category Overlay Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="rounded-full border border-border/80 bg-background/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium tracking-wide text-foreground shadow-sm">
                          {project.category}
                        </span>

                        {status && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-background/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {status}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground transition-colors group-hover:text-accent-hover">
                          <Link href={href} className="focus:outline-none">
                            {project.title}
                          </Link>
                        </h3>

                        {project.description && (
                          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                        )}

                        {/* Hardware Components / Tech Chips */}
                        {(components.length > 0 || tools.length > 0) && (
                          <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                            {components.slice(0, 4).map((comp, idx) => (
                              <span
                                key={`comp-${idx}`}
                                className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                              >
                                {comp.name}
                              </span>
                            ))}
                            {tools.slice(0, 2).map((tool, idx) => (
                              <span
                                key={`tool-${idx}`}
                                className="rounded-md border border-border/70 bg-background px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                              >
                                {tool}
                              </span>
                            ))}
                            {components.length > 4 && (
                              <span className="rounded-md border border-border/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70">
                                +{components.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Action */}
                      <div className="mt-8 flex items-center justify-between pt-4 border-t border-border/40">
                        <span className="text-xs font-mono text-muted-foreground/70">
                          {project.year || (caseStudy?.duration ? caseStudy.duration : "Hardware Case Study")}
                        </span>

                        <Magnetic strength={0.3}>
                          <Link
                            href={href}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent-hover hover:underline"
                          >
                            <span>View case study</span>
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </Magnetic>
                      </div>
                    </div>
                  </article>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStagger>
        )}
      </div>
    </section>
  );
}
