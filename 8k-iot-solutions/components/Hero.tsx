"use client";
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { motion, useTransform, useScroll, Variants } from 'framer-motion';

// Version 1.0.2 - Design Sync Restoration
export default function Hero({ heroImages = [] }: { heroImages?: any[] }) {
  const [mounted, setMounted] = useState(false);
  
  // Safe array access
  const safeHeroImages = Array.isArray(heroImages) ? heroImages : [];
  
  // 1. Build a unified pool of available images (DB ONLY)
  const imagePool = safeHeroImages.length > 0 
    ? safeHeroImages.map(img => img.url)
    : [];

  // 2. Deterministic distribution to avoid side-by-side duplicates
  // Uses a diagonal/checkerboard offset pattern: (row + col) % total
  const getDistributedSource = (row: number, col: number) => {
    const total = imagePool.length;
    if (total === 0) return '/client.jpg'; // Basic fallback if no DB images exist
    
    const index = (row + col) % total;
    return imagePool[index];
  };

  const getDistributedAlt = (row: number, col: number) => {
    const total = safeHeroImages.length;
    if (total === 0) return "Work Showcase";
    
    const index = (row + col) % total;
    return safeHeroImages[index].alt || "Work Showcase";
  };

  // Helper for background/mobile images (legacy support for single-slot access)
  const getImageSource = (index: number) => getDistributedSource(index, 0);
  const getAltText = (index: number) => getDistributedAlt(index, 0);

  const mobileUrl1 = getImageSource(0);
  const mobileUrl2 = getImageSource(1);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // Small delay to ensure smooth entrance
    const timer = setTimeout(() => setMounted(true), 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 800], [0, 100]);

  const cardsData = [
    [
      { id: '1', src: getDistributedSource(0, 0), alt: getDistributedAlt(0, 0), depth: 40, duration: 4.5, delay: 0 },
      { id: '2', src: getDistributedSource(1, 0), alt: getDistributedAlt(1, 0), depth: 15, duration: 5.2, delay: 0.7 },
      { id: '3', src: getDistributedSource(2, 0), alt: getDistributedAlt(2, 0), depth: 25, duration: 4.8, delay: 0.3 },
      { id: '4', src: getDistributedSource(3, 0), alt: getDistributedAlt(3, 0), depth: 10, duration: 6.1, delay: 1.2 },
    ],
    [
      { id: '5', src: getDistributedSource(0, 1), alt: getDistributedAlt(0, 1), depth: 20, duration: 5.8, delay: 0.5 },
      { id: '6', src: getDistributedSource(1, 1), alt: getDistributedAlt(1, 1), depth: 35, duration: 4.2, delay: 0.2 },
      { id: '7', src: getDistributedSource(2, 1), alt: getDistributedAlt(2, 1), depth: 10, duration: 6.5, delay: 0.9 },
      { id: '8', src: getDistributedSource(3, 1), alt: getDistributedAlt(3, 1), depth: 30, duration: 4.6, delay: 0.6 },
    ]
  ];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center pt-24 pb-8 overflow-hidden z-0 bg-transparent"
    >
      <div className="absolute inset-0 z-[1] lg:hidden" aria-hidden="true">
        <Image
          src={mobileUrl1}
          alt={safeHeroImages[0]?.alt || ""}
          fill
          className="object-cover hero-crossfade-img"
          sizes="100vw"
          priority
        />
        <Image
          src={mobileUrl2}
          alt={safeHeroImages[1]?.alt || safeHeroImages[0]?.alt || ""}
          fill
          className="object-cover hero-crossfade-img-delayed"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div 
        suppressHydrationWarning
        className="w-full max-w-[1728px] mx-auto px-4 sm:px-6 lg:pl-10 lg:pr-16 xl:pl-16 xl:pr-24 justify-between relative z-10"
      >
        <div 
          suppressHydrationWarning
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 xl:gap-32 items-start"
        >
          <motion.div 
            style={{ y: textY }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left pt-6 lg:pt-14 max-w-[500px]"
          >
            <h1 className="font-boldonse text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.1] mb-4 sm:mb-6 flex flex-col relative">
              <motion.div 
                variants={itemVariants} 
                className="flex items-baseline gap-x-3 sm:gap-x-4"
              >
                <span className="text-slate-900 leading-none inline-block">
                  Building
                </span>
                <motion.span 
                  suppressHydrationWarning
                  className="text-[1.7em] sm:text-[2.2em] text-brand-900 lg:text-brand-900 leading-none inline-block -ml-1 normal-case"
                  initial={{ opacity: 0, y: 15 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Ideas
                </motion.span>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="mt-10 sm:mt-14 flex items-baseline gap-x-3 sm:gap-x-4"
              >
                <span className="text-slate-900">Into</span>
                <motion.span 
                  suppressHydrationWarning
                  className="text-[1.7em] sm:text-[2.2em] text-brand-900 lg:text-brand-900 normal-case tracking-tight inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    delay: 0.9, 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  style={{ 
                    marginTop: "-0.05em" 
                  }}
                >
                  Reality
                </motion.span>
              </motion.div>
            </h1>
            
            <motion.p 
              variants={itemVariants}
              className="font-poppins font-normal text-neutral-800 lg:text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-[58ch] mb-6"
            >
              We offer hardware and software services, including device prototyping and web-based solutions, tailored to help students and innovators bring their ideas to life.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA Wrapper */}
              <motion.div
                animate={{ 
                  y: [0, isMobile ? -4 : -6, 0],
                }}
                whileHover={{ 
                  scale: 1.04,
                  y: 0,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ 
                  y: {
                    repeat: Infinity, 
                    duration: 3, 
                    ease: "easeInOut" 
                  },
                  scale: {
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25
                  }
                }}
                className="group relative inline-flex w-full sm:w-auto overflow-visible"
                style={{ willChange: "transform" }}
              >
                <a 
                  href="#contact" 
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-neutral-100 lg:bg-brand-900 text-neutral-900 lg:text-white text-[15px] font-semibold font-poppins rounded-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_15px_30px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 transform-gpu"
                >
                  <span>Start a Project</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </motion.div>
              
              {/* Secondary CTA Wrapper */}
              <motion.div
                animate={{ 
                  y: [0, isMobile ? -4 : -6, 0],
                }}
                whileHover={{ 
                  scale: 1.04,
                  y: 0,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ 
                  y: {
                    repeat: Infinity, 
                    duration: 3, 
                    ease: "easeInOut",
                    delay: 0.6
                  },
                  scale: {
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25
                  }
                }}
                className="group relative inline-flex w-full sm:w-auto overflow-visible"
                style={{ willChange: "transform" }}
              >
                <a 
                  href="#services" 
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border-2 border-white/30 lg:border-gray-200 bg-white/90 lg:bg-white text-gray-900 text-[15px] font-semibold font-poppins rounded-[6px] shadow-sm hover:border-brand-600 hover:text-brand-600 group-hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 transform-gpu"
                >
                  <span>Explore Services</span>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Interactive Showcase Grid */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 relative h-[550px] sm:h-[650px] w-full max-w-[680px] justify-self-end rounded-3xl overflow-hidden mt-12 lg:mt-0 [perspective:1200px]">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            <div 
              className="grid grid-cols-2 gap-4 h-full scale-[1.15] rotate-0 pl-4 pr-2"
            >
              {cardsData.map((col, colIdx) => (
                <div 
                  key={`col-${colIdx}`} 
                  className={`relative h-full overflow-visible flex flex-col gap-5 ${colIdx === 1 ? 'mt-10' : '-mt-10'}`}
                >
                  {col.map((card, idx) => (
                    <HeroCard 
                      key={card.id} 
                      card={card} 
                      idx={idx} 
                      colIdx={colIdx} 
                      mounted={mounted} 
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component to safely call framer-motion Hooks per card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeroCard({ card, idx, colIdx, mounted }: any) {
  return (
    <motion.div
      className="w-full aspect-[4/5] flex-shrink-0 z-10"
      initial={{ opacity: 0, y: 60 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut", 
        delay: 0.6 + idx * 0.15 + colIdx * 0.2 
      }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ 
          duration: card.duration, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: card.delay 
        }}
        className="w-full h-full"
      >
        <motion.div 
          whileHover={{ scale: 1.03, y: -6 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.06)] bg-white cursor-pointer group"
        >
          <Image 
            src={card.src} 
            alt={card.alt || "Showcase"} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            sizes="(max-width: 768px) 50vw, 33vw" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
