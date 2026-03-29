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
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section id="services" ref={containerRef} className="relative w-full pt-4 lg:pt-6 pb-2 md:pb-4 bg-transparent text-zinc-900 overflow-hidden z-0">
      <motion.div style={{ opacity: sectionOpacity }} className="w-full h-full relative">

      {/* Ambient Depth Orb */}
      <motion.div 
        style={{ y: bgOrbY }}
        className="absolute top-[-5%] left-[15%] w-[400px] h-[400px] bg-brand-50/40 rounded-full blur-[100px] pointer-events-none will-change-transform" 
      />

      <motion.div 
        className="max-w-7xl mx-auto px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15 }}
      >
        
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="w-full">
          <motion.div 
            variants={headerVariants}
            className="text-center mb-10 md:mb-14"
          >
          <h2 className="text-4xl md:text-[3.5rem] font-sans font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            Hardware & Software
          </h2>
          <p className="text-[16px] md:text-lg text-zinc-500 font-poppins max-w-2xl mx-auto leading-relaxed">
            Specialized solutions for student projects and enterprise clients.
          </p>
          </motion.div>
        </motion.div>

        {/* Parallax Container Context */}
        <div className="pb-16 md:pb-24">
          {/* Cards Container with Parallax transformation */}
          <motion.div style={{ y: yOffset }}>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
                  variants={containerVariants}
                >
                  {/* ========================================= */}
                  {/* CARD 1: Hardware Services                 */}
                  {/* ========================================= */}
                  <motion.div 
                      variants={cardVariants}
                      className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl border border-zinc-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.1)] transition-all duration-700 overflow-hidden cursor-default"
                  >
                      {/* --- HEADER BLOCK --- */}
                      <div className="relative border-b border-zinc-100/50 p-8 md:p-10 flex flex-col min-h-[220px]">
                        <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="text-xl md:text-2xl font-poppins font-bold text-zinc-900 tracking-tight mb-3">Hardware Services</h3>
                            
                            <p className="text-sm md:text-base text-zinc-500 font-poppins font-medium leading-relaxed mb-8 max-w-[280px]">
                              Custom hardware prototypes and embedded systems designed to your exact specs.
                            </p>
                            
                            {/* Modern Pricing Block */}
                            <div className="mt-auto flex flex-col items-start">
                              <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Starts at</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-[12px] font-poppins font-bold text-zinc-400">PHP</span>
                                <span className="text-5xl md:text-6xl font-poppins font-bold tracking-tight text-zinc-900 leading-none">999</span>
                                <span className="text-sm font-poppins font-medium text-zinc-400 ml-2">/ project</span>
                              </div>
                            </div>
                        </div>
                      </div>
          
                      {/* --- BODY BLOCK --- */}
                      <div className="p-8 md:p-10 flex flex-col flex-1 bg-white relative z-10">
                        <ul className="space-y-4 flex-1 mb-10">
                            {HARDWARE_FEATURES.map((feature, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span className="text-sm md:text-base text-zinc-600 font-poppins font-medium leading-tight">{feature}</span>
                            </li>
                            ))}
                        </ul>
            
                        <Link 
                            href="/projects/hardware"
                            className="relative inline-flex items-center justify-center w-full bg-zinc-900 text-white font-poppins font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-900/10 overflow-hidden active:scale-[0.98]"
                        >
                            Explore Hardware
                        </Link>
                      </div>
                  </motion.div>
          
                  {/* ========================================= */}
                  {/* CARD 2: Software Services                 */}
                  {/* ========================================= */}
                  <motion.div 
                      variants={cardVariants}
                      className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl border border-zinc-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.1)] transition-all duration-700 overflow-hidden cursor-default"
                  >
                      {/* --- HEADER BLOCK --- */}
                      <div className="relative border-b border-zinc-100/50 p-8 md:p-10 flex flex-col min-h-[220px]">
                        <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="text-xl md:text-2xl font-poppins font-bold text-zinc-900 tracking-tight mb-3">Software Services</h3>
                            
                            <p className="text-sm md:text-base text-zinc-500 font-poppins font-medium leading-relaxed mb-8 max-w-[280px]">
                              Modern web apps and IoT dashboards built with bleeding-edge technology.
                            </p>
                            
                            {/* Modern Pricing Block */}
                            <div className="mt-auto flex flex-col items-start">
                              <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Starts at</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-[12px] font-poppins font-bold text-zinc-400">PHP</span>
                                <span className="text-5xl md:text-6xl font-poppins font-bold tracking-tight text-zinc-900 leading-none">999</span>
                                <span className="text-sm font-poppins font-medium text-zinc-400 ml-2">/ project</span>
                              </div>
                            </div>
                        </div>
                      </div>
          
                      {/* --- BODY BLOCK --- */}
                      <div className="p-8 md:p-10 flex flex-col flex-1 bg-white relative z-10">
                        <ul className="space-y-4 flex-1 mb-10">
                            {SOFTWARE_FEATURES.map((feature, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span className="text-sm md:text-base text-zinc-600 font-poppins font-medium leading-tight">{feature}</span>
                            </li>
                            ))}
                        </ul>
            
                        <Link 
                            href="/projects/software"
                            className="relative inline-flex items-center justify-center w-full bg-zinc-900 text-white font-poppins font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-900/10 overflow-hidden active:scale-[0.98]"
                        >
                            Explore Software
                        </Link>
                      </div>
                  </motion.div>
                </motion.div>
          </motion.div>
        </div>
      </motion.div>
      </motion.div>
    </section>
  );
});

export default ServicesSection;