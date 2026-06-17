import Image from "next/image";

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
    groups[kind] = groups[kind] ? [...groups[kind], item] : [item];
    return groups;
  }, {});

  return (
    <section className="border-b border-border bg-background px-4 py-12 md:px-10 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-3 md:max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            Tech Stack
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Tools I use to build.
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {Object.entries(groupedItems).map(([kind, group]) => (
            <div key={kind} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                {kind}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {group.map((item) => (
                  <div
                    key={item.id}
                    className="group flex min-h-32 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-md"
                  >
                    <div className="relative size-12 overflow-hidden rounded-md bg-muted p-2">
                      <Image
                        src={item.logo_url}
                        alt={`${item.name} logo`}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
