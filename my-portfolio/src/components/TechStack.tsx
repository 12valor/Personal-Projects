"use client";
import LogoLoop from "./LogoLoop";

// Define logos using 'src' instead of 'node'
const techLogos = [
  { 
    src: "/logos/nextjs.png", 
    alt: "Next.js", 
    href: "https://nextjs.org" 
  },
  { 
    src: "/logos/react.png", 
    alt: "React", 
    href: "https://react.dev" 
  },
  { 
    src: "/logos/typescript.png", 
    alt: "TypeScript", 
    href: "https://www.typescriptlang.org" 
  },
  { 
    src: "/logos/tailwind.png", 
    alt: "Tailwind CSS", 
    href: "https://tailwindcss.com" 
  },
  { 
    src: "/logos/supabase.png", 
    alt: "Supabase", 
    href: "https://supabase.com" 
  },
  { 
    src: "/logos/framer.png", 
    alt: "Framer Motion", 
    href: "https://www.framer.com/motion/" 
  },
];

export default function TechStack() {
  return (
    <section className="py-12 border-b border-border bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-gray-400">
          Powered By
        </p>
      </div>

      <div className="w-full h-16 relative">
          <LogoLoop
            logos={techLogos}
            speed={100} 
            direction="left"
            logoHeight={40} // This controls the height of your images
            gap={80} 
            pauseOnHover={true}
            scaleOnHover={true}
            fadeOut={true}
            fadeOutColor="hsl(var(--background))" 
            ariaLabel="Technology stack"
          />
      </div>
    </section>
  );
}