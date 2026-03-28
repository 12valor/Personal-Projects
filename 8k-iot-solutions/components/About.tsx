"use client";
import React, { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, Variants, useScroll, useTransform, useSpring } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0, 
      delayChildren: 0,   
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 35,
    scale: 0.98,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const About = memo(function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  
  // Safe mobile detection for parallax opt-out
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Refined Parallax Spring configuration for butter-smooth movement
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const desktopImageY = useTransform(smoothY, [0, 1], ["-12%", "12%"]);

  // Conditionally disable the parallax y-transform on mobile devices to prevent layout shift & ensure performance
  const imageY = isMobile ? "0%" : desktopImageY;

  const images = [
    "/co-founders.jpg",
    "/about-img-2.jpg", 
    "/about-img-3.jpg"  
  ];

  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);

  return (
    <section 
      ref={containerRef} 
      id="about" 
      className="relative py-20 lg:py-32 bg-zinc-50 z-0 isolate overflow-hidden"
    >
      {/* Enhanced Background Grid Pattern (Unmasked, full-section) */}
      <div 
        className="absolute inset-0 z-[-1] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)', 
          backgroundSize: '64px 64px', 
          opacity: 0.6
        }} 
      />

      {/* Main Grid Wrapper */}
      <motion.div 
        className="relative z-10 w-full max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15, margin: "0px 0px -10% 0px" }}
        variants={containerVariants}
      >
        {/* Native Staggered Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-0 lg:items-center relative isolate">
          
          {/* ----- LEFT COLUMN: Massive White Anchor Text Container (Cols 1-9) ----- */}
          {/* Assigned to cols 1-9. Z-index 0. Solid background */}
          <motion.div 
            className="lg:col-start-1 lg:col-span-9 lg:row-start-1 order-2 lg:order-1 z-0 relative flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="bg-white rounded-3xl lg:rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-zinc-100 p-8 sm:p-12 lg:p-16 xl:p-24 relative overflow-hidden group/card lg:pr-[25%] xl:pr-[30%]">
              
              {/* Minimal Section Subhead */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="h-px w-8 bg-brand-600" />
                <h3 className="text-[11px] font-bold text-brand-900 uppercase tracking-[0.25em] font-sans">
                  The Studio
                </h3>
              </div>

              {/* Pure Sans-Serif Typography Contrast */}
              <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] font-sans font-extrabold text-zinc-900 mb-8 leading-[1.05] tracking-tighter relative z-10">
                Hardware <br className="hidden md:block" />precision meets <br/>
                <span className="font-normal text-zinc-400 block mt-2 md:mt-1 tracking-tight">software intelligence.</span>
              </h2>

              {/* Wide-line-height Scannable Text Blocks */}
              <div className="flex flex-col gap-6 max-w-[540px] text-zinc-600 text-[17px] lg:text-lg font-sans leading-relaxed mb-16 relative z-10 selection:bg-brand-100">
                <p>
                  As dedicated freelance IoT specialists based in Talisay City, Negros Occidental, we partner with visionaries and businesses to architect custom solutions from the ground up.
                </p>
                <p>
                  From designing custom microcontroller circuits to deploying responsive cloud dashboards, our student-centered approach focuses on building robust ecosystems that seamlessly connect the physical world to actionable digital insights.
                </p>
              </div>

              {/* Clean Inline Counters inside the Text Card */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 mb-12 relative z-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-sans tracking-tighter">10+</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-sans leading-tight">Projects<br/>Completed</span>
                </div>
                
                {/* Thin dividing line visible only on larger screens where they run side-by-side */}
                <div className="w-[1px] h-10 bg-zinc-200 hidden sm:block" />
                
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-sans tracking-tighter">2+</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-sans leading-tight">Years<br/>Experience</span>
                </div>
              </div>

              {/* CTA Pill */}
              <div className="relative z-10">
                <a 
                  href="#contact" 
                  className="group inline-flex items-center gap-4 bg-zinc-900 text-white pl-6 pr-2 py-2 rounded-full font-sans font-medium text-[15px] transition-all duration-500 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                >
                  <span className="tracking-wide">Let's Collaborate</span>
                  <span className="flex items-center justify-center w-[38px] h-[38px] bg-white/10 rounded-full transition-all duration-500 group-hover:bg-white group-hover:scale-105">
                    <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors duration-500 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" strokeWidth={2} />
                  </span>
                </a>
              </div>

            </div>
          </motion.div>

          {/* ----- RIGHT COLUMN: Cinematic Parallax Image Frame (Cols 8-12) ----- */}
          {/* Hidden entirely on mobile, visible only on lg screens and up. Z-index 10. */}
          <motion.div 
            className="hidden lg:block lg:col-start-8 lg:col-span-5 lg:row-start-1 xl:col-start-9 xl:col-span-4 relative z-10 lg:-ml-8 xl:-ml-12 self-center mt-12 lg:mt-0"
            style={{ y: imageY }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] xl:aspect-[3/4] w-full rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-white/50 group/carousel bg-zinc-100">
              
              {images.map((src, idx) => (
                <Image 
                  key={src}
                  src={src} 
                  alt={`8K IoT Solutions Preview ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={`object-cover transition-transform transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}
                  priority={idx === 0}
                />
              ))}

              {/* Sophisticated Hover Navigation Pill */}
              <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60 z-30 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 translate-y-4 group-hover/carousel:translate-y-0">
                <button 
                  onClick={prevImage}
                  className="p-2 sm:p-2.5 rounded-full bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 -ml-0.5" strokeWidth={1.5} />
                </button>
                <div className="w-[1px] h-4 bg-zinc-200" />
                <button 
                  onClick={nextImage}
                  className="p-2 sm:p-2.5 rounded-full bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 -mr-0.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
});

export default About;