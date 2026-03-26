"use client";
import React, { useRef, memo } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';




const HARDWARE_FEATURES = [
  "IoT Project Development",
  "Arduino Programming",
  "Sensor Integration",
  "Hardware Prototyping",
];

const SOFTWARE_FEATURES = [
  "Website Design",
  "Web Application Development",
  "Embedded System Development",
];

const containerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // easeOutQuart
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ServicesSection = memo(function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // map scroll progress to a subtle offset range [-40, 40]
  const yOffset = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const headerY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const bgOrbY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="services" ref={containerRef} className="relative w-full pt-12 lg:pt-16 pb-8 md:pb-12 bg-transparent text-zinc-900 overflow-hidden z-0">

      {/* Ambient Depth Orb */}
      <motion.div 
        style={{ y: bgOrbY }}
        className="absolute top-[-5%] left-[15%] w-[400px] h-[400px] bg-brand-50/40 rounded-full blur-[100px] pointer-events-none will-change-transform" 
      />

      <motion.div 
        className="max-w-4xl mx-auto px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15 }}
      >
        
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="w-full">
          <motion.div 
            variants={headerVariants}
            className="text-center mb-12"
          >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold tracking-tight text-zinc-900">
            Hardware & Software
          </h2>
          <p className="mt-3 text-sm text-zinc-500 font-medium">
            Specialized solutions for student projects and enterprise clients.
          </p>
          </motion.div>
        </motion.div>

        {/* Parallax Container Context */}
        <div>
          {/* Cards Container with Parallax transformation */}
          <motion.div style={{ y: yOffset }}>
                <motion.div 
                  className="grid grid-cols-2 gap-6 md:gap-8 items-stretch"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={containerVariants}
                >
                  {/* ========================================= */}
                  {/* CARD 1: Hardware Services                 */}
                  {/* ========================================= */}
                  <motion.div 
                      variants={cardVariants}
                      className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                      {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
                      <div className="relative bg-zinc-50/50 border-b border-zinc-100 p-4 sm:p-8 overflow-hidden h-auto sm:h-[210px] flex flex-col">
                      {/* Subtle Dot Pattern - Masked to fade out towards the bottom */}
                      <div 
                          className="absolute inset-0 opacity-60 pointer-events-none"
                          style={{
                          backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                          WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                          maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)'
                          }}
                      />
          
                      <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-xl font-poppins font-semibold text-zinc-900 leading-tight">Hardware Services</h3>
                          </div>
                          
                          {/* Descriptive Subtitle for better text hierarchy */}
                          <p className="text-[11px] sm:text-sm text-zinc-500 font-medium mb-3 sm:mb-6 line-clamp-2 leading-tight">
                          Custom hardware solutions and prototypes designed per client request.
                          </p>
                          
                          {/* Pricing Block Highlight */}
                          <div className="flex items-baseline gap-1 mt-auto flex-wrap">
                          <span className="text-[10px] sm:text-sm font-semibold text-zinc-400">PHP</span>
                          <span className="text-xl sm:text-5xl font-poppins font-bold tracking-tighter text-zinc-900 leading-none">2,000</span>
                          <span className="text-[10px] sm:text-sm font-medium text-zinc-500 sm:ml-1">/project</span>
                          </div>
                      </div>
                      </div>
          
                      {/* --- BODY BLOCK (Features & CTA) --- */}
                      <div className="p-3 sm:p-8 flex flex-col flex-1 bg-white relative z-10">
                      <ul className="space-y-2.5 sm:space-y-4 flex-1 mb-4 sm:mb-8">
                          {HARDWARE_FEATURES.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-3">
                              <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-zinc-400 shrink-0 mt-0.5 sm:mt-0.5" strokeWidth={2.5} />
                              <span className="text-[11px] sm:text-sm text-zinc-700 font-medium leading-tight">{feature}</span>
                          </li>
                          ))}
                      </ul>
          
                      <Link 
                          href="/projects/hardware"
                          className="block text-center w-full bg-white border border-zinc-200 text-zinc-800 font-semibold text-[11px] sm:text-sm py-2 sm:py-3.5 rounded-lg sm:rounded-xl hover:bg-zinc-50 hover:border-brand-300 hover:text-brand-600 transition-colors duration-200 shadow-sm"
                      >
                          Explore Hardware
                      </Link>
                      </div>
                  </motion.div>
          
                  {/* ========================================= */}
                  {/* CARD 2: Software Services (Highlighted)   */}
                  {/* ========================================= */}
                  <motion.div 
                      variants={cardVariants}
                      className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden"
                  >
                      {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
                      <div className="relative bg-gradient-to-b from-brand-50/60 to-white border-b border-brand-100/40 p-4 sm:p-8 overflow-hidden h-auto sm:h-[210px] flex flex-col">
                      {/* Brand Dot Pattern - Masked to fade out towards the bottom */}
                      <div 
                          className="absolute inset-0 opacity-70 pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                          backgroundImage: 'radial-gradient(#bfdbfe 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                          WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                          maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)'
                          }}
                      />
          
                      <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-xl font-poppins font-semibold text-zinc-900 leading-tight">Software Services</h3>
                          </div>
          
                          {/* Descriptive Subtitle for better text hierarchy */}
                          <p className="text-[11px] sm:text-sm text-zinc-500 font-medium mb-3 sm:mb-6 line-clamp-2 leading-tight">
                          Scalable web applications, modern dashboards, and API integrations.
                          </p>
          
                          {/* Pricing Block Highlight */}
                          <div className="flex items-baseline gap-1 mt-auto flex-wrap">
                          <span className="text-[10px] sm:text-sm font-semibold text-brand-400">PHP</span>
                          <span className="text-xl sm:text-5xl font-poppins font-bold tracking-tighter text-zinc-900 leading-none">2,000</span>
                          <span className="text-[10px] sm:text-sm font-medium text-zinc-500 sm:ml-1">/project</span>
                          </div>
                      </div>
                      </div>
          
                      {/* --- BODY BLOCK (Features & CTA) --- */}
                      <div className="p-3 sm:p-8 flex flex-col flex-1 bg-white relative z-10">
                      <ul className="space-y-2.5 sm:space-y-4 flex-1 mb-4 sm:mb-8">
                          {SOFTWARE_FEATURES.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-3">
                              <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-brand-500 shrink-0 mt-0.5 sm:mt-0.5" strokeWidth={2.5} />
                              <span className="text-[11px] sm:text-sm text-zinc-700 font-medium leading-tight">{feature}</span>
                          </li>
                          ))}
                      </ul>
          
                      <Link 
                          href="/projects/software"
                          className="block text-center w-full bg-brand-500 text-white font-semibold text-[11px] sm:text-sm py-2 sm:py-3.5 rounded-lg sm:rounded-xl hover:bg-brand-600 transition-colors duration-200 shadow-md shadow-brand-500/20"
                      >
                          Explore Software
                      </Link>
                      </div>
                  </motion.div>
                </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default ServicesSection;