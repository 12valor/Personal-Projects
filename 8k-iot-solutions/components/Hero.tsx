"use client";
import Image from 'next/image';
import { useEffect, useState, useRef, memo } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

const Hero = memo(function Hero({ heroImages = [] }: { heroImages?: any[] }) {
  const [mounted, setMounted] = useState(false);
  
  const safeHeroImages = Array.isArray(heroImages) ? heroImages : [];
  
  const imagePool = safeHeroImages.length > 0 
    ? safeHeroImages.map(img => img.url)
    : [];

  const getDistributedSource = (index: number) => {
    const total = imagePool.length;
    if (total === 0) return '/client.jpg';
    return imagePool[index % total];
  };

  const getDistributedAlt = (index: number) => {
    const total = safeHeroImages.length;
    if (total === 0) return "Work Showcase";
    return safeHeroImages[index % total].alt || "Work Showcase";
  };

  const mobileUrl1 = getDistributedSource(0);
  const mobileUrl2 = getDistributedSource(1);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const timer = setTimeout(() => setMounted(true), 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 20]);

  // Define 4 uniquely distributed static grid images
  const gridImages = [
    { id: '1', src: getDistributedSource(0), alt: getDistributedAlt(0) },
    { id: '2', src: getDistributedSource(1), alt: getDistributedAlt(1) },
    { id: '3', src: getDistributedSource(2), alt: getDistributedAlt(2) },
    { id: '4', src: getDistributedSource(3), alt: getDistributedAlt(3) },
  ];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
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
        className="w-full max-w-[1728px] mx-auto px-4 sm:px-6 lg:pl-10 lg:pr-16 xl:pl-16 xl:pr-24 relative z-10 lg:pt-0 pt-4"
      >
        <div 
          suppressHydrationWarning
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center"
        >
          {/* Left Column: Typography */}
          <motion.div 
            style={{ y: textY }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left max-w-[600px] relative z-20"
          >
            <h1 className="font-boldonse text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] tracking-tight leading-[1.2] mb-6 sm:mb-8 flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
              <span className="text-slate-900">Building</span>
              <motion.span 
                suppressHydrationWarning
                className="text-brand-900 font-extrabold"
                initial={{ opacity: 0, y: 15 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Ideas
              </motion.span>
              <span className="text-slate-900">Into</span>
              <motion.span 
                suppressHydrationWarning
                className="text-brand-900 font-extrabold"
                initial={{ opacity: 0, y: 10 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Reality
              </motion.span>
            </h1>
            
            <motion.p 
              variants={itemVariants}
              className="font-poppins font-normal text-slate-700 text-[16px] sm:text-[18px] leading-relaxed max-w-[58ch] mb-8"
            >
              We offer hardware and software services, including device prototyping and web-based solutions, tailored to help students and innovators bring their ideas to life.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
                className="group relative inline-flex w-full sm:w-auto overflow-hidden rounded-[8px]"
              >
                <a 
                  href="#contact" 
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-neutral-100 lg:bg-brand-900 text-neutral-900 lg:text-white text-[16px] font-semibold font-poppins shadow-[0_2px_10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_15px_30px_-5px_rgba(30,58,138,0.3)] transition-all duration-300"
                >
                  <span>Start a Project</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
                className="group relative inline-flex w-full sm:w-auto rounded-[8px]"
              >
                <a 
                  href="#services" 
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border-2 border-slate-200 bg-white text-slate-800 text-[16px] font-semibold font-poppins shadow-sm hover:border-brand-600 hover:text-brand-600 group-hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <span>Explore Services</span>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: Clean Orthogonal 2x2 Grid */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 w-full justify-self-end mt-12 lg:mt-0 relative z-10">
            {/* The Strict 20px gap grid without any fading gradients */}
            <div className="grid grid-cols-2 gap-[20px] h-[500px] xl:h-[600px] w-full max-w-[650px] ml-auto">
              {gridImages.map((img, idx) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: 0.3 + idx * 0.15
                  }}
                  className="relative w-full h-full rounded-2xl overflow-hidden group shadow-[0_4px_25px_rgb(0,0,0,0.05)] bg-slate-50 border border-slate-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 1200px) 25vw, 20vw"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
