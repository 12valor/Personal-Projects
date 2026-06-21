"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Code2, Film, Palette } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";

const services = [
  {
    number: "01",
    title: "Graphic Design",
    eyebrow: "Print & Digital",
    description:
      "Posters, pubmats, and social layouts shaped from first idea to final export. The goal is always the same: make the message clear and impossible to scroll past.",
    src: "/graphic.webp",
    icon: Palette,
    skills: ["Pubmats", "GFX", "Layouts"],
  },
  {
    number: "02",
    title: "Video Editing",
    eyebrow: "Short & Long Form",
    description:
      "Reels, promos, and longer edits built around rhythm, clarity, and the right moment. I shape the footage, sound, and pacing into one coherent story.",
    src: "/vid.webp",
    icon: Film,
    skills: ["Reels", "Cuts", "Sound"],
  },
  {
    number: "03",
    title: "Web Design",
    eyebrow: "Sites & Apps",
    description:
      "Responsive websites designed and developed as one system. Clean interfaces, thoughtful interactions, and production-ready code—not just a static mockup.",
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
            Design, motion, and code—built as one.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            I work across visual design, editing, and development so every
            detail feels connected from the first frame to the final build.
          </p>
        </motion.div>

        <div className="flex flex-col">
          {services.map((service, index) => {
            const Icon = service.icon;
            const reverse = index % 2 === 1;

            return (
              <div key={service.title}>
                {index > 0 && <Separator />}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="py-8 md:py-10"
                >
                  <Card className="group overflow-hidden rounded-2xl border-border/80 bg-card/70 shadow-none transition-colors hover:border-foreground/20">
                    <div
                      className={`grid min-h-[360px] lg:grid-cols-12 ${
                        reverse ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      <div className="relative min-h-[260px] overflow-hidden bg-muted lg:col-span-5 lg:min-h-full">
                        <Image
                          src={service.src}
                          alt={`${service.title} work preview`}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <span className="absolute bottom-5 left-5 font-mono text-sm text-white/80">
                          {service.number} / 03
                        </span>
                      </div>

                      <div className="flex flex-col justify-between lg:col-span-7">
                        <CardHeader className="gap-5 p-6 md:p-9">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background">
                                <Icon aria-hidden="true" />
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                {service.eyebrow}
                              </span>
                            </div>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
                            />
                          </div>
                          <CardTitle className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="max-w-xl text-base leading-relaxed md:text-lg">
                            {service.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-2 md:px-9">
                          <div className="flex flex-wrap gap-2">
                            {service.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="rounded-full px-3 py-1 font-medium"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="justify-between gap-4 p-6 md:p-9">
                          <span className="text-sm text-muted-foreground">
                            Selected work and case studies
                          </span>
                          <Link
                            href="#work"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                          >
                            View projects
                            <ArrowUpRight aria-hidden="true" />
                          </Link>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
