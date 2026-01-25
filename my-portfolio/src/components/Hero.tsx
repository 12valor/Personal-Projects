"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  // Animation: Staggered fade up (0.05s - 0.1s stagger)
  // "Fade + slight Y-translate on page load (no dramatic motion)"
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1, // Starts after 0.2s, staggers by 0.1s
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1], // Editorial "soft" ease (no bounce)
      },
    }),
  };

  return (
    <section className="relative w-full border-b border-border">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[90vh]">
        
        {/* LEFT COLUMN: Typography & CTA */}
        <div className="md:col-span-7 flex flex-col justify-center px-6 md:px-16 py-20 border-r border-border bg-background z-10">
          <div className="max-w-2xl">
            {/* Headline */}
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-foreground mb-8 leading-[1.05]"
            >
              I’m a Graphic <br />
              <span className="text-accent italic">Designer</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl text-gray-500 max-w-md mb-12 leading-relaxed font-light"
            >
              Building visual clarity in a noisy world. I prioritize structure, typography, and negative space.
            </motion.p>

            {/* Minimal CTA - No button explosion */}
            <motion.div 
              custom={2} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp}
            >
              <a href="#work" className="group inline-flex items-center gap-2 text-foreground font-medium text-lg">
                <span className="relative">
                  View Selected Works
                  {/* Underline slides in from left on hover */}
                  <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
                {/* Arrow moves slightly */}
                <span className="transform transition-transform duration-300 group-hover:translate-x-1 text-accent">
                  →
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: Portrait */}
        <div className="md:col-span-5 relative h-[50vh] md:h-auto flex items-end justify-center overflow-hidden bg-background">
          {/* Subtle green accent background shape (optional, adds depth) */}
          <div className="absolute top-0 right-0 w-full h-full bg-accent/5 -z-10" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
            className="relative w-full h-[90%] md:h-[85%] translate-x-4 md:translate-x-0"
          >
            {/* IMPORTANT: 
               1. Replace '/portrait.png' with your actual file in public/ folder.
               2. Use a transparent PNG for the best effect.
            */}
            <Image
              src="/portrait.png" // Put your image in public folder
              alt="Designer Portrait"
              fill
              className="object-contain object-bottom grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
              priority
              draggable={false}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}