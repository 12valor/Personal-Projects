"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { POP_EASING } from "./ScrollReveal";

export interface TechStackItem {
  id: number;
  name: string;
  kind: string;
  logo_url: string;
}

/* ── animation presets ────────────────────────────────────────────────────────── */
const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const groupVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: POP_EASING, staggerChildren: 0.05 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: POP_EASING },
  },
};

/* â”€â”€ component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function TechStack({ items }: { items: TechStackItem[] }) {
  if (items.length === 0) return null;

  const groupedItems = items.reduce<Record<string, TechStackItem[]>>((groups, item) => {
    const kind = item.kind || "Tools";
    (groups[kind] ??= []).push(item);
    return groups;
  }, {});

  const groups = Object.entries(groupedItems);

  return (
    <section
      id="tech-stack"
      className="border-b border-border bg-background px-4 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* â”€â”€ header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, ease: POP_EASING }}
          className="mb-10 flex flex-col gap-3 md:mb-14 md:max-w-2xl"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-foreground">
            Tech Stack
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Tools I use to build.
          </h2>
        </motion.div>

        {/* â”€â”€ categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-6%" }}
          className="flex flex-col gap-10 md:gap-12"
        >
          {groups.map(([kind, group]) => (
            <motion.div key={kind} variants={groupVariants} className="flex flex-col gap-4">
              {/* category label */}
              <div className="flex items-center gap-4">
                <h3 className="shrink-0 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  {kind}
                </h3>
                <Separator className="flex-1" />
              </div>

              {/* tech chips */}
              <div className="flex flex-wrap gap-3">
                {group.map((item) => (
                  <motion.div key={item.id} variants={chipVariants}>
                    <Badge
                      variant="outline"
                      className="group gap-3 rounded-full bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
                    >
                      <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={item.logo_url}
                          alt={`${item.name} logo`}
                          fill
                          className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                          sizes="28px"
                        />
                      </span>
                      {item.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
