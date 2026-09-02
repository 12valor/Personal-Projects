import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./vertical-logo-scroller.module.css";

export type VerticalLogoItem = {
  id: string | number;
  name: string;
  src?: string;
  href?: string;
};

interface VerticalLogoScrollerProps {
  logos: (string | VerticalLogoItem)[];
  speed?: string;
  direction?: "up" | "down";
  className?: string;
}

type ScrollerStyle = CSSProperties & {
  "--scroll-duration": string;
};

export default function VerticalLogoScroller({
  logos,
  speed = "40s",
  direction = "up",
  className = "",
}: VerticalLogoScrollerProps) {
  if (!logos.length) return null;

  const normalizedLogos: VerticalLogoItem[] = logos.map((logo, index) =>
    typeof logo === "string"
      ? { id: `${logo}-${index}`, name: logo }
      : logo,
  );
  const loopLogos = Array.from(
    { length: Math.max(normalizedLogos.length, 6) },
    (_, index) => ({
      logo: normalizedLogos[index % normalizedLogos.length],
      repeated: index >= normalizedLogos.length,
      loopIndex: index,
    }),
  );
  const trackStyle: ScrollerStyle = { "--scroll-duration": speed };

  const renderSet = (duplicate = false) => (
    <ul
      className={`${styles.set} ${duplicate ? styles.duplicate : ""}`.trim()}
      aria-hidden={duplicate || undefined}
    >
      {loopLogos.map(({ logo, repeated, loopIndex }) => {
        const hiddenCopy = duplicate || repeated;
        const content = logo.src ? (
          <Image
            src={logo.src}
            alt={hiddenCopy ? "" : `${logo.name} logo`}
            fill
            sizes="(max-width: 640px) 28vw, 260px"
            className="object-contain p-4 sm:p-6"
            draggable={false}
            unoptimized={logo.src.toLowerCase().endsWith(".svg")}
          />
        ) : (
          <span className="px-3 text-center text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {logo.name}
          </span>
        );

        return (
          <li
            key={`${logo.id}-${loopIndex}`}
            aria-hidden={hiddenCopy || undefined}
            className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-foreground/25 hover:shadow-md sm:h-28"
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={hiddenCopy ? -1 : undefined}
                className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                aria-label={hiddenCopy ? undefined : `Visit ${logo.name}`}
              >
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <div
        className={`${styles.track} ${direction === "down" ? styles.reverse : ""}`.trim()}
        style={trackStyle}
      >
        {renderSet()}
        {renderSet(true)}
      </div>
    </div>
  );
}
