"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const timelineData = [
  {
    year: "2021",
    title: "GFX Artist",
    category: "Visuals",
    desc: "This is where it all started â€” making GFX edits and thumbnails for small communities. Mostly just experimenting and figuring out what looked cool.",
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
    year: "2023",
    title: "Graphic Design",
    category: "Branding",
    desc: "Started taking design more seriously â€” logos, layouts, brand stuff. Learned a lot about typography and making things look intentional instead of random.",
    img: "/2023.webp",
  },
  {
    year: "2024",
    title: "Programming",
    category: "Development",
    desc: "Picked up coding so I could actually build the things I design. Now I do both â€” I make it look good and I make it work.",
    img: "/2024.webp",
  },
];

export default function About() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const xScroll = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" ref={targetRef} className="relative bg-background border-t border-border lg:h-[260vh]">
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-9 px-4 py-14 md:px-10 md:py-16 lg:px-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex flex-col gap-3 md:max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-foreground">
              Timeline
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Creative evolution
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              A chronological view of how my work moved from visual design into motion and web development.
            </p>
          </motion.div>

          <div className="lg:hidden">
            <div className="flex flex-col gap-5">
              {timelineData.map((item, index) => (
                <motion.article
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="relative aspect-[16/10]">
                    <Image src={item.img} alt={`${item.year} ${item.title}`} fill className="object-cover" sizes="100vw" />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-4xl font-bold text-foreground">{item.year}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">{item.category}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="hidden flex-1 items-center lg:flex">
            <motion.div style={{ x: xScroll }} className="flex w-max items-stretch gap-8 pr-[38vw]">
              {timelineData.map((item, index) => (
                <motion.article
                  key={item.year}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="group grid w-[520px] grid-rows-[260px_1fr] overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.img}
                      alt={`${item.year} ${item.title}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="520px"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-5 left-5 text-6xl font-bold tracking-tight text-white">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-foreground">
                      {item.category}
                    </span>
                    <h3 className="text-3xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          <div className="hidden h-[2px] w-full overflow-hidden rounded-full bg-border lg:block">
            <motion.div style={{ width: progressWidth }} className="h-full bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
