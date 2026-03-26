"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants, useAnimationFrame } from "framer-motion";
import Image from "next/image";

// --- KAIZEN OPTIMIZATION: ZERO-RENDER SCRAMBLE COMPONENT ---
// Replaces the CPU-heavy `setInterval` approach with a Framer Motion requestAnimationFrame loop
// that mutates the DOM directly (`innerText`), completely bypassing React's render engine.
const ScrambleText = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const currentTextRef = useRef(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";

  useEffect(() => {
    progressRef.current = 0;
    currentTextRef.current = text;
  }, [text]);

  // @ts-expect-error - framer motion types for useAnimationFrame optionally provide t and delta
  motion.useAnimationFrame = motion.useAnimationFrame || null; // Just to satisfy strict TS
  
  // Use framer motion's animation frame for perfect 60fps syncing
  // We use `any` to bypass strict TS issues if the framer-motion version is slightly different
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useAnimationFrame as any)((t: number, delta: number) => {
    if (!textRef.current) return;

    if (progressRef.current >= currentTextRef.current.length) {
      if (textRef.current.innerText !== currentTextRef.current) {
         textRef.current.innerText = currentTextRef.current;
      }
      return;
    }

    // 0.03 = speed multiplier. Higher = faster descramble
    progressRef.current += delta * 0.03;

    let output = "";
    for (let i = 0; i < currentTextRef.current.length; i++) {
      if (i < progressRef.current) {
        output += currentTextRef.current[i];
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    textRef.current.innerText = output;
  });

  return <span ref={textRef}>{text}</span>;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4500); 
    return () => clearInterval(interval);
  }, []);

  const topText = phrases[index][0];
  const bottomText = phrases[index][1];

  // --- PARALLAX & ANIMATION ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 1. Deep Background (Furthest away) -> Scrolls very slowly
  const yDeep = useTransform(scrollYProgress, [0, 1], [0, 400]); 
  
  // 2. Solid Text (Behind Image) -> Scrolls slowly
  const ySolid = useTransform(scrollYProgress, [0, 1], [0, 200]);      
  
  // 3. Image (Midground) -> Standard tracking
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);      
  
  // 4. Hollow Text (Foreground) -> Pops out, moves faster than scroll!
  const yHollow = useTransform(scrollYProgress, [0, 1], [0, -80]); 

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
          MOBILE-FIRST RESPONSIVE CONTAINER 
          Using a flex/relative structure for mobile to prevent overlapping, 
          then switching to absolute layers for the 'sandwich' effect on desktop.
      */}
      <div className="relative z-20 flex flex-col h-full lg:block pointer-events-none">
        
        {/* TOP TEXT AREA */}
        <motion.div 
          style={{ y: ySolid, opacity: opacityFade }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="
            relative mt-[12vh] px-4 
            md:mt-[15vh] md:px-8 
            lg:absolute lg:mt-0 lg:top-[12vh] lg:left-16 lg:z-0
          "
        >
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase opacity-90">
            <ScrambleText text={topText} />
          </h1>
        </motion.div>

        {/* BOTTOM TEXT AREA (Mobile stack) */}
        <motion.div 
          style={{ y: ySolid, opacity: opacityFade }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="
            relative mt-2 px-4
            md:px-8
            lg:absolute lg:mt-0 lg:top-auto lg:bottom-[15vh] lg:right-16 lg:left-auto lg:text-right lg:z-0
          "
        >
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase">
            <ScrambleText text={bottomText} />
          </h1>
        </motion.div>
      </div>


      {/* --- LAYER 2: THE IMAGE (Middle) --- */}
      {/* Always z-10. 
          On Desktop: Sits ON TOP of Layer 1 (Solid) but BELOW Layer 3 (Hollow).
      */}
      <motion.div 
        style={{ y: yImage }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
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


      {/* --- LAYER 3: HOLLOW TEXT (Desktop Only) --- */}
      {/* - Hidden on Mobile/Tablet.
         - Visible on Desktop (lg:block).
         - z-30 (Front).
         - This layer contains the "Outline" text. Because it is z-30, it sits ON TOP of the image.
         - Since the solid text is z-0 (Behind Image), you see: Solid -> Image -> Outline.
      */}
      <div className="hidden lg:block absolute inset-0 z-30 pointer-events-none mix-blend-normal">
        <motion.div 
            style={{ y: yHollow, opacity: opacityFade }}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="absolute bottom-[15vh] right-16 text-right"
        >
            <h1 
                className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase text-transparent min-w-[5ch]"
                style={{ WebkitTextStroke: "2px #fff" }}
            >
            <ScrambleText text={bottomText} />
            </h1>
        </motion.div>
      </div>

    </section>
  );
}