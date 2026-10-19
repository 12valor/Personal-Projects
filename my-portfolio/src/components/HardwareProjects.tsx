"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
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

type LayoutPreset = "feature" | "landscape" | "portrait" | "compact";

function getEffectivePreset(project: SerializedProject, index: number): LayoutPreset {
  // If the admin has chosen an explicit preset in the case study, respect it
  const explicit = project.case_study?.layout_preset;
  if (explicit && ["feature", "landscape", "portrait", "compact"].includes(explicit)) {
    return explicit;
  }

  // Otherwise, distribute through an intentional editorial rhythm:
  // 0: Feature (hero build)
  // 1: Portrait (tall contrast)
  // 2: Compact (clean supporting)
  // 3: Landscape (wide panoramic)
  // 4: Portrait
  // 5: Feature
  const sequence: LayoutPreset[] = [
    "feature",
    "portrait",
    "compact",
    "landscape",
    "portrait",
    "compact",
    "feature",
  ];
  return sequence[index % sequence.length];
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
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:px-10 md:py-32 border-t border-border/40"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:gap-20">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
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

        {/* Asymmetric Editorial Collage Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-7 auto-rows-fr">
            {hardwareItems.map((project, index) => {
              const caseStudy = project.case_study;
              const preset = getEffectivePreset(project, index);
              const status = caseStudy?.status || "Working Prototype";
              const components = caseStudy?.hardware_components || [];
              const slugOrId = project.slug || project.id;
              const href = `/hardware/${slugOrId}`;

              // Grid Span Classes based on Layout Preset
              let gridSpanClasses = "";
              let minHeightClass = "";

              switch (preset) {
                case "feature":
                  // Dominant anchor: 8 cols out of 12 on desktop, tall aspect
                  gridSpanClasses = "col-span-1 sm:col-span-2 lg:col-span-8";
                  minHeightClass = "min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]";
                  break;
                case "portrait":
                  // Tall vertical showcase: 4 cols out of 12 on desktop
                  gridSpanClasses = "col-span-1 sm:col-span-1 lg:col-span-4";
                  minHeightClass = "min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]";
                  break;
                case "landscape":
                  // Wide cinematic showcase: 8 cols out of 12 on desktop
                  gridSpanClasses = "col-span-1 sm:col-span-2 lg:col-span-8";
                  minHeightClass = "min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]";
                  break;
                case "compact":
                default:
                  // Supporting balanced piece: 4 cols out of 12 on desktop
                  gridSpanClasses = "col-span-1 sm:col-span-1 lg:col-span-4";
                  minHeightClass = "min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]";
                  break;
              }

              const isFeature = preset === "feature";
              const isPortrait = preset === "portrait";

              return (
                <div
                  key={project.id}
                  className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 bg-muted/20 backdrop-blur-sm transition-all duration-500 hover:border-border hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 ${gridSpanClasses} ${minHeightClass}`}
                >
                  {/* Background Project Photography */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    {project.preview_video_url ? (
                      <video
                        src={project.preview_video_url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={project.image_url || undefined}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                    ) : project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/40 text-muted-foreground/30">
                        <Cpu className="w-20 h-20 stroke-1" />
                      </div>
                    )}

                    {/* Gradient Overlay: subtle gradient to keep images vibrant while ensuring high contrast for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/55" />
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-10 p-5 sm:p-6 md:p-7 flex items-start justify-between gap-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-white shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {project.category}
                    </span>

                    {status && (
                      <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-black/30 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-white/80">
                        {status}
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Content & Action */}
                  <div className="relative z-10 mt-auto p-5 sm:p-6 md:p-8 flex flex-col justify-end">
                    {/* Component Chips */}
                    {components.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {components.slice(0, isFeature ? 4 : isPortrait ? 2 : 3).map((comp, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-white/15 bg-white/10 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/90"
                          >
                            {comp.name}
                          </span>
                        ))}
                        {components.length > (isFeature ? 4 : isPortrait ? 2 : 3) && (
                          <span className="rounded border border-white/10 bg-black/30 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-mono text-white/60">
                            +{components.length - (isFeature ? 4 : isPortrait ? 2 : 3)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Project Title */}
                    <h3
                      className={`font-medium tracking-tight text-white leading-tight transition-colors duration-300 group-hover:text-accent-hover ${
                        isFeature
                          ? "text-2xl sm:text-3xl lg:text-4xl"
                          : isPortrait
                          ? "text-xl sm:text-2xl lg:text-3xl"
                          : "text-xl sm:text-2xl"
                      }`}
                    >
                      <Link href={href} className="focus:outline-none after:absolute after:inset-0">
                        {project.title}
                      </Link>
                    </h3>

                    {/* Short Description */}
                    {project.description && (
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-300 line-clamp-2 max-w-xl font-normal">
                        {project.description}
                      </p>
                    )}

                    {/* Editorial Action Footer */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15 pointer-events-none">
                      <span className="text-[11px] font-mono text-gray-400">
                        {project.year || (caseStudy?.duration ? caseStudy.duration : "Hardware Case Study")}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-white group-hover:text-accent-hover transition-colors">
                        <span>View case study</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
