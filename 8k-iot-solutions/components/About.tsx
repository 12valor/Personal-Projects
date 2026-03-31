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
    "/about-project-1.jpg",
    "/about-project-2.jpg"
  ];

  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);

  return (
    <section 
      ref={containerRef} 
      id="about" 
      className="relative pt-10 lg:pt-14 pb-10 lg:pb-16 bg-transparent z-0 isolate overflow-hidden"
    >

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
            <div className="bg-white rounded-3xl lg:rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-zinc-100 p-6 sm:p-10 lg:p-14 xl:p-20 relative overflow-hidden group/card lg:pr-[30%] xl:pr-[35%]">
              

              {/* Pure Sans-Serif Typography Contrast */}
              <h2 className="text-[2.25rem] leading-[1.1] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-poppins font-bold text-zinc-900 mb-6 md:mb-8 sm:leading-[1.05] tracking-tight relative z-10">
                Hardware <br className="hidden md:block" />precision meets <br className="hidden md:block"/>
                <span className="font-poppins font-medium text-zinc-400 block mt-1 tracking-tight italic">software intelligence.</span>
              </h2>

              {/* Wide-line-height Scannable Text Blocks */}
              <div className="flex flex-col gap-6 max-w-[480px] text-zinc-600 text-[16px] lg:text-[17px] font-poppins leading-relaxed mb-12 relative z-10 selection:bg-brand-100">
                <p className="font-medium">
                  We are a freelance software and hardware team based in Talisay City, dedicated to helping students and local businesses build custom tech solutions. We don&apos;t just build for schools; we partner with anyone who has a vision, providing the technical expertise needed to bring complex projects to life.
                </p>
                <p>
                  From designing custom circuits to deploying easy-to-use software, we focus on creating &quot;smart&quot; systems that connect the real world to digital insights. We pride ourselves on being tech-proficient and hands-on, ensuring that every project we deliver is robust, reliable, and ready to go.
                </p>
              </div>

              {/* Clean Inline Counters inside the Text Card */}
              <div className="grid grid-cols-2 sm:flex items-center gap-4 sm:gap-10 mb-8 md:mb-12 relative z-10 w-full overflow-visible">
                <div className="flex flex-col xl:flex-row xl:items-baseline gap-1 xl:gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-poppins tracking-tighter">10+</span>
                  <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-poppins leading-tight">Projects<br className="block sm:hidden xl:block"/>Completed</span>
                </div>
                
                {/* Thin dividing line visible only on larger screens where they run side-by-side */}
                <div className="w-[1px] h-10 bg-zinc-200 hidden sm:block" />
                
                <div className="flex flex-col xl:flex-row xl:items-baseline gap-1 xl:gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-poppins tracking-tighter">2+</span>
                  <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-poppins leading-tight">Years<br className="block sm:hidden xl:block"/>Experience</span>
                </div>
              </div>

              {/* CTA Pill */}
              <div className="relative z-10 mt-2 md:mt-0">
                <a 
                  href="#contact" 
                  className="group inline-flex items-center justify-between w-auto gap-4 sm:gap-3 bg-zinc-900 text-white pl-5 sm:pl-6 pr-1.5 py-1.5 sm:py-2 rounded-full font-sans font-medium text-[14px] sm:text-[16px] transition-all duration-500 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                >
                  <span className="tracking-wide">Let's Collaborate</span>
                  <span className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] sm:min-w-[38px] sm:w-[38px] sm:h-[38px] bg-white rounded-full transition-all duration-500 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900 transition-transform duration-500 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" strokeWidth={2} />
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