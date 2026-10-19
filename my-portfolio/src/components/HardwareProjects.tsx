"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Cpu, Layers } from "lucide-react";
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

interface CollageRowConfig {
  rowType: "pair" | "triplet" | "hero";
  pairVariant?: "wide-first" | "wide-second";
  heightClass: string;
  items: SerializedProject[];
}

function partitionIntoEditorialRows(items: SerializedProject[]): CollageRowConfig[] {
  const n = items.length;
  if (n === 0) return [];

  // Rhythmic editorial cycle of row compositions:
  // Row 0: 2 items (wide-first asymmetric pair: 7 / 5)
  // Row 1: 3 items (modular triad: 4 / 4 / 4)
  // Row 2: 2 items (wide-second asymmetric pair: 5 / 7)
  // Row 3: 1 item (cinematic hero anchor: 12)
  // Row 4: 3 items (modular triad: 4 / 4 / 4)
  const targetCycle: Array<"pair" | "triplet" | "hero"> = [
    "pair",
    "triplet",
    "pair",
    "hero",
    "triplet",
  ];

  const rows: CollageRowConfig[] = [];
  let i = 0;
  let cycleIdx = 0;
  let pairCount = 0;

  while (i < n) {
    const remaining = n - i;
    const preferredType = targetCycle[cycleIdx % targetCycle.length];
    let chosenType: "pair" | "triplet" | "hero" = preferredType;

    // Harmonize remaining items to avoid any awkward gaps or orphaned slots
    if (remaining === 1) {
      chosenType = "hero";
    } else if (remaining === 2) {
      chosenType = "pair";
    } else if (remaining === 3) {
      chosenType = "triplet";
    } else if (remaining === 4) {
      chosenType = preferredType === "hero" ? "hero" : "pair";
    } else if (remaining === 5) {
      chosenType = preferredType === "triplet" ? "triplet" : "pair";
    }

    let take = 1;
    let heightClass = "h-[380px] sm:h-[440px] lg:h-[520px]";
    let pairVariant: "wide-first" | "wide-second" | undefined;

    if (chosenType === "pair") {
      take = 2;
      heightClass = "h-[360px] sm:h-[420px] lg:h-[480px]";
      pairVariant = pairCount % 2 === 0 ? "wide-first" : "wide-second";
      pairCount++;
    } else if (chosenType === "triplet") {
      take = 3;
      heightClass = "h-[320px] sm:h-[360px] lg:h-[400px]";
    } else {
      take = 1;
      heightClass = "h-[380px] sm:h-[440px] lg:h-[520px]";
    }

    const chunk = items.slice(i, i + take);
    rows.push({
      rowType: chosenType,
      pairVariant,
      heightClass,
      items: chunk,
    });
    i += take;
    cycleIdx++;
  }

  return rows;
}

export default function HardwareProjects({ projects }: HardwareProjectsProps) {
  // Only display published hardware projects sorted by display_index
  const hardwareItems = useMemo(() => {
    return projects
      .filter((p) => p.is_published !== false && isHardwareProject(p))
      .sort((a, b) => a.display_index - b.display_index);
  }, [projects]);

  const rows = useMemo(() => {
    return partitionIntoEditorialRows(hardwareItems);
  }, [hardwareItems]);

  return (
    <section
      id="hardware"
      aria-label="Hardware Projects"
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

        {/* Asymmetric Editorial Collage */}
        {hardwareItems.length === 0 ? (
          <ScrollReveal className="mx-auto w-full max-w-2xl rounded-2xl border border-dashed border-border/80 bg-muted/10 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No Hardware Projects Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New physical computing builds and hardware photography will be displayed here soon.
            </p>
          </ScrollReveal>
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6 lg:gap-7">
            {rows.map((row, rowIdx) => (
              <div
                key={`row-${rowIdx}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-stretch"
              >
                {row.items.map((project, itemIdx) => {
                  let colSpanClass = "";
                  let titleSizeClass = "";

                  if (row.rowType === "hero") {
                    colSpanClass = "col-span-1 sm:col-span-2 lg:col-span-12";
                    titleSizeClass = "text-2xl sm:text-3xl lg:text-4xl max-w-2xl";
                  } else if (row.rowType === "pair") {
                    const isWideFirst = row.pairVariant === "wide-first";
                    const isFirst = itemIdx === 0;
                    const isWide = isWideFirst ? isFirst : !isFirst;

                    colSpanClass = isWide
                      ? "col-span-1 sm:col-span-1 lg:col-span-7"
                      : "col-span-1 sm:col-span-1 lg:col-span-5";

                    titleSizeClass = isWide
                      ? "text-xl sm:text-2xl lg:text-3xl max-w-xl"
                      : "text-lg sm:text-xl lg:text-2xl max-w-md";
                  } else {
                    // Triplet: 3 items across on desktop
                    // On tablet: item 0 and 1 take sm:col-span-1, item 2 spans full sm:col-span-2 for seamless balance
                    colSpanClass =
                      itemIdx === 2
                        ? "col-span-1 sm:col-span-2 lg:col-span-4"
                        : "col-span-1 sm:col-span-1 lg:col-span-4";

                    titleSizeClass = "text-lg sm:text-xl lg:text-2xl";
                  }

                  return (
                    <div
                      key={project.id}
                      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 bg-muted/20 backdrop-blur-sm transition-all duration-500 hover:border-border hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 ${colSpanClass} ${row.heightClass}`}
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
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 58vw, 66vw"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/40 text-muted-foreground/30">
                            <Cpu className="w-20 h-20 stroke-1" />
                          </div>
                        )}

                        {/* High-contrast gradient overlay ensuring typography readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/92 group-hover:via-black/40" />
                      </div>

                      {/* Bottom Text Overlay: Project Name */}
                      <div className="relative z-10 p-6 sm:p-7 lg:p-8">
                        <h3
                          className={`font-medium tracking-tight text-white leading-tight drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none ${titleSizeClass}`}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
