"use client";

import React, { useRef, memo } from 'react';
import Image from 'next/image';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const SchoolLogos = memo(function SchoolLogos({ logos = [] }: { logos?: any[] }) {
  if (!logos || logos.length === 0) return null;

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const logoRowY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      style={{ opacity: sectionOpacity }} 
      ref={containerRef} 
      className="relative py-12 md:py-20 bg-transparent z-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Centered Typography */}
        <motion.div 
          variants={headerVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
           <span className="text-brand-900/60 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs font-poppins">
             trusted by clients from
           </span>
        </motion.div>

        {/* Logo Section - Clean Centered Grid */}
        <motion.div 
          style={{ y: logoRowY }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
          className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center items-center gap-8 md:gap-12 lg:gap-16 w-full"
        >
          {logos.map((logo, idx) => {
            const imgUrl = typeof logo.image === 'string' ? logo.image : logo.image?.src || '';
            const logoContent = (
              <div className="relative w-32 h-20 sm:w-44 sm:h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 transition-all duration-500 hover:scale-110 flex items-center justify-center group opacity-70 hover:opacity-100 grayscale hover:grayscale-0">
                <Image 
                  src={imgUrl} 
                  alt={logo.name ? `${logo.name} Logo` : 'Client Logo'} 
                  fill
                  className="object-contain drop-shadow-sm transition-all duration-700" 
                  sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                />
              </div>
            );

            return (
              <motion.div key={logo.id || idx} variants={logoVariants} className="flex items-center justify-center">
                {logo.link ? (
                  <a href={logo.link} target="_blank" rel="noreferrer" className="block outline-none focus:ring-2 focus:ring-brand-500/10 cursor-pointer">
                    {logoContent}
                  </a>
                ) : (
                  logoContent
                )}
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </motion.section>
  );
});

export default SchoolLogos;
