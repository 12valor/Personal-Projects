import InfiniteSpiral, { type SpiralItem } from "./InfiniteSpiral";

// Replace these local wordmarks with official client artwork as it becomes available.
const CLIENTS: SpiralItem[] = [
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

export default function Clients() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="relative overflow-hidden border-y border-border bg-muted/20 px-4 py-16 md:px-10 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,hsl(var(--foreground)/0.055),transparent_68%)] lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="max-w-xl py-4 lg:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Clients &amp; collaborators
          </p>
          <h2
            id="clients-heading"
            className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl"
          >
            Good work is built together.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            A selection of people, teams, and brands I&apos;ve supported across
            design, editing, and development.
          </p>

          <div className="mt-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-10 bg-border" />
            Scroll or drag to explore
          </div>
        </div>

        <div className="relative h-[420px] min-w-0 overflow-hidden rounded-3xl border border-border/70 bg-background/70 md:h-[500px]">
          <InfiniteSpiral
            items={CLIENTS}
            animationMode="all"
            speed={0.32}
            radius={178}
            cardWidth={164}
            cardHeight={104}
            verticalSpacing={108}
            perspective={1100}
            cardRadius={14}
            centerScale={1.08}
            edgeFade={0.2}
            edgeBlur={3}
            cardsPerTurn={5}
            pauseOnHover
            imageFit="contain"
          />
        </div>
      </div>
    </section>
  );
}
