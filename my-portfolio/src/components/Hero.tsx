"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  // Animation: Staggered fade up
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <section className="relative w-full border-b border-border">
      {/* CHANGE 1: Changed md:grid-cols-12 to lg:grid-cols-12 
         This ensures the layout stays as a single column on tablets (iPads), 
         only splitting into two columns on desktop/laptops.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[90vh]">
        
        {/* LEFT COLUMN: Typography & CTA */}
        {/* CHANGE 2: Changed md:col-span-7 to lg:col-span-7
           Also added explicit 'col-span-1' for mobile/tablet default.
        */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 md:px-16 py-20 lg:border-r border-border bg-background z-10 text-center lg:text-left items-center lg:items-start">
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
              className="text-lg md:text-xl text-gray-500 max-w-md mb-12 leading-relaxed font-light mx-auto lg:mx-0"
            >
              Building visual clarity in a noisy world. I prioritize structure, typography, and negative space.
            </motion.p>

            {/* Minimal CTA */}
            <motion.div 
              custom={2} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp}
            >
              <a href="#work" className="group inline-flex items-center gap-2 text-foreground font-medium text-lg">
                <span className="relative">
                  View Selected Works
                  <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1 text-accent">
                  →
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: Portrait */}
        {/* CHANGE 3: Added 'hidden' (default) and 'lg:flex' (desktop only).
            This completely removes the image block on Mobile AND Tablets (iPad).
            It will only appear on screens wider than 1024px.
        */}
        <div className="hidden lg:flex lg:col-span-5 relative h-auto items-end justify-center overflow-hidden bg-background">
          <div className="absolute top-0 right-0 w-full h-full bg-accent/5 -z-10" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
            className="relative w-full h-[85%]"
          >
            <Image
              src="/portrait.png"
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