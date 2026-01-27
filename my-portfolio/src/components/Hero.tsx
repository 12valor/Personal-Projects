"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef(null);

  // 1. Track Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 2. Parallax Hooks (Elements move at different speeds)
  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 300]); // Text moves fast
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);      // Image moves slow (depth)
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]); // Fade out on scroll

  // 3. Entrance Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-background border-b border-border"
    >
      
      {/* --- LAYER 1: BACKGROUND TITLE (Behind Image) --- */}
      {/* Position: Top Left */}
      <motion.div 
        style={{ y: yBackground, opacity: opacityFade }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="absolute top-[12vh] left-6 md:left-16 z-0 pointer-events-none"
      >
        <h1 className="text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase opacity-90">
          Graphic
        </h1>
      </motion.div>

      {/* --- LAYER 2: PORTRAIT IMAGE (Middle) --- */}
      {/* Hidden on Mobile/iPad (lg:flex), Centered, Parallax applied */}
      <motion.div 
        style={{ y: yImage }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-10 hidden lg:flex items-end justify-center pointer-events-none"
      >
        {/* Container constraints to keep image realistic size */}
        <div className="relative w-[45vw] h-[90%]">
          <Image
            src="/hero.png" // Make sure this is a Transparent PNG for best effect
            alt="Designer Portrait"
            fill
            className="object-contain object-bottom"
            priority
            draggable={false}
          />
        </div>
      </motion.div>

      {/* --- LAYER 3: FOREGROUND TITLE (In Front of Image) --- */}
      {/* Position: Bottom Right */}
      <motion.div 
        style={{ y: yBackground }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="absolute bottom-[15vh] right-6 md:right-16 z-20 pointer-events-none text-right"
      >
        <h1 className="text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase">
          Designer
        </h1>
      </motion.div>


      {/* --- LAYER 4: UI DETAILS (Fixed Overlay) --- */}
      {/* Sidebar & Bottom Text */}
      <div className="absolute inset-0 z-30 pointer-events-none px-6 md:px-16 pb-12 flex flex-col justify-end">
        
        <div className="flex justify-between items-end w-full">
            {/* Bottom Left: Description */}
            <div className="max-w-xs pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    
                    {/* Bouncing Scroll Arrow */}
                    <motion.a 
                        href="#work"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="text-3xl text-accent inline-block cursor-pointer hover:text-foreground transition-colors"
                    >
                        ↓
                    </motion.a>
                </motion.div>
            </div>

            {/* Vertical Sidebar (Left Side) - Visual Decor */}
            <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6 opacity-40">
                <span className="text-xs tracking-[0.3em] font-medium [writing-mode:vertical-lr] rotate-180">2K24</span>
                <div className="w-[1px] h-24 bg-foreground"></div>
                <span className="text-xs tracking-[0.3em] font-medium [writing-mode:vertical-lr] rotate-180 text-accent">.PORTFOLIO</span>
            </div>
        </div>
      </div>

    </section>
  );
}