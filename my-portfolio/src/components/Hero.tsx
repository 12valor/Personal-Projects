"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useLoading } from "./LoadingProvider";

// --- KAIZEN OPTIMIZATION: SHARED MULTI-REF SCRAMBLE HOOK ---
// This hook manages scramble state for multiple DOM elements simultaneously.
// It mutates refs directly to ensure perfect 1:1 character sync between 
// different parallax layers (Solid vs Hollow) without React re-renders.
const useSyncScramble = (text: string, refs: React.RefObject<HTMLSpanElement | null>[], enabled: boolean) => {
  const progressRef = useRef(0);
  const currentTextRef = useRef(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";

  useEffect(() => {
    progressRef.current = 0;
    currentTextRef.current = text;
  }, [text]);

  // Framer Motion's high-perf loop
  (useAnimationFrame as any)((t: number, delta: number) => {
    if (!enabled) return;
    if (progressRef.current >= currentTextRef.current.length) {
      refs.forEach(ref => {
          if (ref.current && ref.current.innerText !== currentTextRef.current) {
              ref.current.innerText = currentTextRef.current;
          }
      });
      return;
    }

    progressRef.current += delta * 0.03;

    let output = "";
    for (let i = 0; i < currentTextRef.current.length; i++) {
      if (i < progressRef.current) {
        output += currentTextRef.current[i];
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    refs.forEach(ref => {
        if (ref.current) ref.current.innerText = output;
    });
  });
};

export default function Hero() {
  const containerRef = useRef(null);

  // --- TEXT CYCLING LOGIC ---
  const [index, setIndex] = useState(0);
  const phrases = [
    ["GRAPHIC", "DESIGNER"],
    ["VIDEO", "EDITOR"],
    ["WEB", "DEVELOPER"],
  ];

  const { isLoading } = useLoading();

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4500); 
    return () => clearInterval(interval);
  }, [isLoading]);

  const topText = phrases[index][0];
  const bottomText = phrases[index][1];

  // Sync Refs for all layers
  const topSolidRef = useRef<HTMLSpanElement>(null);
  const bottomSolidRef = useRef<HTMLSpanElement>(null);
  const bottomHollowRef = useRef<HTMLSpanElement>(null);

  // Unified animations - only enable after preloader
  useSyncScramble(topText, [topSolidRef], !isLoading);
  useSyncScramble(bottomText, [bottomSolidRef, bottomHollowRef], !isLoading);

  // --- PARALLAX & ANIMATION ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 1. Deep Background (Furthest away) -> Scrolls very slowly
  const yDeep = useTransform(scrollYProgress, [0, 1], [0, 400]); 
  
  // 2. Text Layers (Sandwich) -> Both Solid and Hollow move together for perfect sync
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);      
  
  // 3. Image (Midground) -> Standard tracking
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);      
  // Smooth opacity fade
  const opacityFade = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]); 

  const fadeInUp: Variants = { 
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-background border-b border-border"
    >
      {/* --- NOISE GRAIN OVERLAY (Bespoke Touch) --- */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* --- LAYER 0: DEEP BACKGROUND (New) --- */}
      <motion.div 
         style={{ y: yDeep, opacity: opacityFade }}
         className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-muted-foreground/[0.04] blur-3xl pointer-events-none z-0"
      />
      
      {/* 
          PORTRAIT IMAGE (Layer 2 - Midground) 
          Always z-10. Sits ON TOP of Layer 1 (Solid) but BELOW Layer 3 (Hollow).
      */}
      <motion.div 
        style={{ y: yImage }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={!isLoading ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none"
      >
        <div className="relative w-full h-[65%] md:h-[70%] lg:w-[45vw] lg:h-[90%]">
          <Image
            src="/hero2.png"
            alt="Portrait"
            fill
            className="object-contain object-bottom"
            priority
            draggable={false}
          />
        </div>
      </motion.div>

      {/* 
          TEXT LAYERS (Layer 1 & 3)
          We use separate absolute containers for the Top and Bottom text 
          to ensure precise control over the 'sandwich' per-area.
      */}
      
      {/* TOP TEXT (Mostly Solid, usually background) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ y: yText, opacity: opacityFade }}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
          variants={fadeInUp}
          className="absolute top-[15vh] left-4 md:top-[18vh] md:left-8 lg:top-[12vh] lg:left-16"
        >
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase opacity-90">
            <span ref={topSolidRef}>{topText}</span>
          </h1>
        </motion.div>
      </div>

      {/* BOTTOM TEXT (THE SANDWICH) */}
      {/* 
          We wrap BOTH the Solid and Hollow bottom text in the SAME coordinate space.
          Even though they have different Z-indexes, being in the same parent 
          with identical classes ensures 1:1 pixel alignment.
      */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Layer 1: Solid Background (z-0) */}
        <motion.div 
          style={{ y: yText, opacity: opacityFade }}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="absolute z-0 top-[24vh] left-4 md:top-[28vh] md:left-8 lg:top-auto lg:bottom-[15vh] lg:right-16 lg:left-auto lg:text-right"
        >
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase">
            <span ref={bottomSolidRef}>{bottomText}</span>
          </h1>
        </motion.div>

        {/* Layer 3: Hollow Foreground (z-30) - Only on Desktop */}
        <motion.div 
          style={{ y: yText, opacity: opacityFade }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="hidden lg:block absolute z-30 lg:bottom-[15vh] lg:right-16 lg:text-right"
        >
          <h1 
            className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase text-transparent"
            style={{ WebkitTextStroke: "2px #fff" }}
          >
            <span ref={bottomHollowRef}>{bottomText}</span>
          </h1>
        </motion.div>
      </div>

    </section>
  );
}