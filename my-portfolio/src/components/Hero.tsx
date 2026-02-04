"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";

// --- CUSTOM HOOK FOR SHUFFLE EFFECT ---
const useScrambleText = (targetText: string) => {
  const [displayText, setDisplayText] = useState(targetText);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setDisplayText((prev) =>
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2; 
    }, 30); 

    return () => clearInterval(interval);
  }, [targetText]);

  return displayText;
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

  const topText = useScrambleText(phrases[index][0]);
  const bottomText = useScrambleText(phrases[index][1]);

  // --- PARALLAX & ANIMATION ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 300]); 
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);      
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]); 

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
      
      {/* --- LAYER 1: SOLID TEXT --- */}
      {/* Z-INDEX LOGIC:
          - Mobile/Tablet (default): z-20. Keeps text clear/above.
          - Desktop (lg): z-0. Puts solid text BEHIND the image for the sandwich effect.
      */}
      
      {/* TOP TEXT */}
      <motion.div 
        style={{ y: yBackground, opacity: opacityFade }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="absolute top-[8vh] left-4 md:top-[10vh] md:left-8 lg:top-[12vh] lg:left-16 z-20 lg:z-0 pointer-events-none"
      >
        <h1 className="text-[18vw] md:text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase opacity-90 min-w-[5ch]">
          {topText}
        </h1>
      </motion.div>

      {/* BOTTOM TEXT */}
      <motion.div 
        style={{ y: yBackground }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        // MOBILE & TABLET: Stacked Left
        // DESKTOP: Bottom Right
        className="
          absolute 
          top-[16vh] left-4 text-left 
          md:top-[20vh] md:left-8 
          lg:top-auto lg:bottom-[15vh] lg:right-16 lg:left-auto lg:text-right 
          z-20 lg:z-0 pointer-events-none"
      >
        <h1 className="text-[18vw] md:text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase min-w-[5ch]">
          {bottomText}
        </h1>
      </motion.div>


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
            style={{ y: yBackground }}
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
            {bottomText}
            </h1>
        </motion.div>
      </div>

    </section>
  );
}