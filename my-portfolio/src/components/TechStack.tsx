"use client";

import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

export interface TechStackItem {
  id: number;
  name: string;
  kind: string;
  logo_url: string;
}

export default function TechStack({ items }: { items: TechStackItem[] }) {
  if (items.length === 0) return null;

  const groupedItems = items.reduce<Record<string, TechStackItem[]>>((groups, item) => {
    const kind = item.kind || "Tools";
    (groups[kind] ??= []).push(item);
    return groups;
  }, {});

  return (
    <section id="tech-stack" className="border-b border-border bg-background px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <ScrollReveal className="mb-10 flex max-w-2xl flex-col gap-3 md:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Tech Stack</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">Tools I use to build.</h2>
        </ScrollReveal>
        <div className="border-t border-border">
          {Object.entries(groupedItems).map(([kind, group], categoryIndex) => (
            <div key={kind} className="grid gap-5 border-b border-border py-6 sm:py-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
              <ScrollReveal delay={(categoryIndex % 3) * 0.12}>
                <h3 className="pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{kind}</h3>
              </ScrollReveal>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
                {group.map((item, index) => (
                  <ScrollReveal key={item.id} delay={(index % 4) * 0.12}>
                    <div className="group flex min-h-14 items-center gap-3 border border-transparent px-2 py-2 transition-colors duration-200 hover:border-border motion-reduce:transition-none">
                      <span className="relative size-9 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                        <Image src={item.logo_url} alt="" fill className="object-contain p-1" sizes="36px" />
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground">{item.name}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
