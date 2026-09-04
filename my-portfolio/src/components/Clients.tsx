import type { PortfolioClientRow } from "../lib/supabase";
import VerticalLogoScroller, {
  type VerticalLogoItem,
} from "./ui/vertical-logo-scroller";
import { ScrollReveal } from "./ScrollReveal";

const FALLBACK_CLIENTS: VerticalLogoItem[] = [
  {
    id: "adrianos-coffee",
    name: "Adriano's Coffee",
    src: "/clients/adrianos-coffee.svg",
  },
  {
    id: "roastbloxx",
    name: "RoastBloxx",
    src: "/clients/roastbloxx.svg",
  },
  {
    id: "technowatch",
    name: "Technowatch",
    src: "/clients/technowatch.svg",
  },
  {
    id: "sherack-dojillo",
    name: "Sherack Dojillo",
    src: "/clients/sherack-dojillo.svg",
  },
];

interface ClientsProps {
  items: PortfolioClientRow[] | null;
}

export default function Clients({ items }: ClientsProps) {
  const clientItems: VerticalLogoItem[] =
    items === null
      ? FALLBACK_CLIENTS
      : items.map((item) => ({
          id: item.id,
          name: item.name,
          src: item.logo_url,
          href: item.website_url || undefined,
        }));

  if (clientItems.length === 0) return null;

  return (
    <section
      id="clients"
      aria-label="Clients and collaborators"
      className="relative overflow-hidden bg-transparent py-20 sm:py-24 md:py-28"
    >
      <ScrollReveal className="mx-auto mb-10 max-w-5xl px-4 text-center sm:mb-14 sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:text-sm">
          Trusted by clients &amp; collaborators
        </h2>
      </ScrollReveal>

      <ScrollReveal
        delay={0.1}
        className="mx-auto h-[32rem] w-full max-w-xs px-3 sm:h-[38rem] sm:max-w-sm sm:px-6"
      >
        <VerticalLogoScroller
          logos={clientItems}
          speed="30s"
          direction="up"
        />
      </ScrollReveal>
    </section>
  );
}
