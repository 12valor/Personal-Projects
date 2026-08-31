"use client";

import { useMemo, useRef } from "react";
import type { PortfolioClientRow } from "../lib/supabase";
import InfiniteSpiral, { type SpiralItem } from "./InfiniteSpiral";

const FALLBACK_CLIENTS: SpiralItem[] = [
  {
    id: "adrianos-coffee",
    src: "/clients/adrianos-coffee.svg",
    alt: "Adriano's Coffee",
  },
  {
    id: "roastbloxx",
    src: "/clients/roastbloxx.svg",
    alt: "RoastBloxx",
  },
  {
    id: "technowatch",
    src: "/clients/technowatch.svg",
    alt: "Technowatch",
  },
  {
    id: "sherack-dojillo",
    src: "/clients/sherack-dojillo.svg",
    alt: "Sherack Dojillo",
  },
];

interface ClientsProps {
  items: PortfolioClientRow[] | null;
}

export default function Clients({ items }: ClientsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const clientItems = useMemo<SpiralItem[]>(
    () =>
      items === null
        ? FALLBACK_CLIENTS
        : items.map((item) => ({
            id: item.id,
            src: item.logo_url,
            alt: `${item.name} logo`,
            label: item.name,
            href: item.website_url || undefined,
            target: item.website_url ? "_blank" : undefined,
          })),
    [items],
  );

  if (clientItems.length === 0) return null;

  const scrollHeight = 100 + Math.max(clientItems.length - 1, 0) * 65;

  return (
    <section
      ref={sectionRef}
      id="clients"
      aria-label="Clients and collaborators"
      className="relative bg-transparent motion-reduce:!h-auto"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-transparent motion-reduce:static">
        <InfiniteSpiral
          items={clientItems}
          animationMode="scroll"
          radius={280}
          cardWidth={200}
          cardHeight={120}
          verticalSpacing={140}
          perspective={1200}
          cardRadius={14}
          centerScale={1.12}
          edgeFade={0.15}
          edgeBlur={2}
          cardsPerTurn={Math.min(Math.max(clientItems.length, 4), 7)}
          imageFit="contain"
          scrollContainerRef={sectionRef}
          scrollProgressCards={clientItems.length - 1}
        />
      </div>
    </section>
  );
}
