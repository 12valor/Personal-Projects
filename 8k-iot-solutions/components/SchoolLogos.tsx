"use client";

import React, { useRef, memo } from 'react';
import Image from 'next/image';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
  const logoRowY = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const bgOrbY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.section style={{ opacity: sectionOpacity }} ref={containerRef} className="relative pt-14 pb-4 md:py-20 lg:py-20 bg-transparent z-0 overflow-hidden">

      {/* Ambient Depth Orb */}
      <motion.div 
        style={{ y: bgOrbY }}
        className="absolute top-[-10%] right-[20%] w-[350px] h-[350px] bg-brand-50/30 rounded-full blur-[100px] pointer-events-none will-change-transform" 
      />

      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        variants={sectionVariants}
      >

        {/* Label */}
        <motion.div variants={headerVariants} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-brand-300" />
            <span className="text-[11px] md:text-xs font-bold text-brand-900 uppercase tracking-[0.25em] font-poppins">
              Trusted By Clients From
            </span>
            <div className="h-px w-8 bg-brand-300" />
          </div>
        </motion.div>

        {/* All logos visible, centered, single row, no masking */}
        <motion.div style={{ y: logoRowY }} className="grid grid-cols-2 gap-4 md:gap-10 lg:flex lg:flex-wrap lg:justify-center lg:gap-14">
          {logos.map((logo, idx) => {
            const logoContent = (
              <div className="relative h-24 sm:h-28 md:h-20 lg:h-24 w-full max-w-[150px] sm:max-w-[180px] md:w-48 lg:w-56 transition-transform duration-500 hover:scale-105 will-change-transform">
                <Image 
                  src={logo.image} 
                  alt={logo.name ? `${logo.name} Logo` : 'School Logo'} 
                  fill
                  className="object-contain drop-shadow-sm" 
                  sizes="(max-width: 768px) 144px, (max-width: 1024px) 192px, 224px"
                />
              </div>
            );

            return (
              <motion.div key={logo.id || idx} variants={logoVariants} className="flex items-center justify-center">
                {logo.link ? (
                  <a href={logo.link} target="_blank" rel="noreferrer" className="block rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-4 cursor-pointer">
                    {logoContent}
                  </a>
                ) : (
                  logoContent
                )}
              </motion.div>
            );
          })}
        </motion.div>

      </motion.div>
    </motion.section>
  );
});

export default SchoolLogos;
