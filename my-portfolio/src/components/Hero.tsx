"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
            // If we've passed this index, show the real letter
            if (index < iteration) {
              return targetText[index];
            }
            // Otherwise show a random character
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      // Speed of resolution (higher denominator = slower)
      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2; // Reveals 1 character every 2 frames
    }, 30); // 30ms per frame

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
    }, 4500); // Change words every 4.5 seconds
    return () => clearInterval(interval);
  }, []);

  // Apply the shuffle hook to current words
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
      
      {/* --- LAYER 1: SOLID TEXT (Behind Image) --- */}
      
      {/* TOP TEXT (Shuffles: GRAPHIC -> VIDEO -> WEB) */}
      <motion.div 
        style={{ y: yBackground, opacity: opacityFade }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="absolute top-[12vh] left-6 md:left-16 z-0 pointer-events-none"
      >
        <h1 className="text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase opacity-90 min-w-[5ch]">
          {topText}
        </h1>
      </motion.div>

      {/* BOTTOM TEXT - Solid Base (Shuffles: DESIGNER -> EDITOR -> DEVELOPER) */}
      <motion.div 
        style={{ y: yBackground }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="absolute bottom-[15vh] right-6 md:right-16 z-0 pointer-events-none text-right"
      >
        <h1 className="text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase min-w-[5ch]">
          {bottomText}
        </h1>
      </motion.div>


      {/* --- LAYER 2: THE IMAGE (Middle) --- */}
      <motion.div 
        style={{ y: yImage }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-10 hidden lg:flex items-end justify-center pointer-events-none"
      >
        <div className="relative w-[45vw] h-[90%]">
          <Image
            src="/hero.png" 
            alt="Designer Portrait"
            fill
            className="object-contain object-bottom"
            priority
            draggable={false}
          />
        </div>
      </motion.div>


      {/* --- LAYER 3: HOLLOW TEXT (Front Overlay) --- */}
      {/* ONLY "BOTTOM TEXT" exists here (Sandwich Effect) */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-normal">
        
        <motion.div 
            style={{ y: yBackground }}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="absolute bottom-[15vh] right-6 md:right-16 text-right"
        >
            <h1 
                className="text-[16vw] lg:text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase text-transparent min-w-[5ch]"
                style={{ WebkitTextStroke: "2px #fff" }} // Visible only over the image
            >
            {bottomText}
            </h1>
        </motion.div>
      </div>

    </section>
  );
}