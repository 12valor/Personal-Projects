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
      id="partners"
      style={{ opacity: sectionOpacity }} 
      ref={containerRef} 
      className="relative py-12 md:py-20 bg-transparent z-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
        
        <motion.div 
          variants={headerVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="text-center lg:text-left shrink-0 w-full max-w-md lg:max-w-xs mx-auto lg:mx-0"
        >
           <h3 className="text-brand-900 font-black uppercase tracking-[0.3em] text-sm md:text-lg lg:text-xl font-poppins leading-tight">
             trusted by clients from
           </h3>
           <p className="mt-4 text-slate-900 font-medium text-xs md:text-sm lg:text-base font-poppins leading-relaxed">
             Clients from these institutions trusted our high-end services.
           </p>
        </motion.div>

        {/* Logo Section - Right on Desktop, Center on Mobile */}
        <motion.div 
          style={{ y: logoRowY }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.05 }}
          variants={sectionVariants}
          className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-end items-center justify-items-center gap-6 md:gap-8 lg:gap-12 w-full lg:flex-1"
        >
          {logos.map((logo, idx) => {
            const imgUrl = typeof logo.image === 'string' ? logo.image : logo.image?.src || '';
            const logoContent = (
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-24 transition-all duration-500 hover:scale-110 flex items-center justify-center group opacity-70 hover:opacity-100 grayscale hover:grayscale-0">
                <Image 
                  src={imgUrl} 
                  alt={logo.name ? `${logo.name} Logo` : 'Client Logo'} 
                  fill
                  className="object-contain drop-shadow-sm transition-all duration-700" 
                  sizes="(max-width: 768px) 100px, 150px"
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
