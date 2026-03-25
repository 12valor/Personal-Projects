"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const SchoolLogos = memo(function SchoolLogos({ logos = [] }: { logos?: any[] }) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="relative py-14 lg:py-20 bg-transparent z-0 overflow-hidden">

      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
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
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
          {logos.map((logo, idx) => {
            const logoContent = (
              <div className="relative h-16 md:h-20 lg:h-24 w-36 md:w-48 lg:w-56 transition-transform duration-500 hover:scale-105 will-change-transform">
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
        </div>

      </motion.div>
    </section>
  );
});

export default SchoolLogos;
