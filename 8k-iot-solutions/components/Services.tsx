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

const studioEase = [0.16, 1, 0.3, 1] as any;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: studioEase,
    },
  },
};

const leftCardVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: studioEase,
    },
  },
};

const rightCardVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: studioEase,
    },
  },
};

const ServicesSection = memo(function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section id="services" ref={sectionRef} className="relative w-full pt-4 lg:pt-6 pb-2 md:pb-4 bg-transparent text-zinc-900 overflow-hidden z-0">
      <motion.div style={{ opacity: sectionOpacity }} className="w-full h-full relative">

      {/* Ambient Depth Orb */}
      <div className="absolute top-[-5%] left-[15%] w-[400px] h-[400px] bg-brand-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="w-full">
          <div className="text-center mb-10 md:mb-12">
            <motion.h2 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.2, ease: studioEase }}
              className="text-4xl md:text-[3rem] font-sans font-bold tracking-tight text-zinc-900 mb-4 leading-tight"
            >
              Hardware & Software
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.2, ease: studioEase }}
              className="text-[16px] md:text-lg text-zinc-500 font-poppins max-w-2xl mx-auto leading-relaxed"
            >
              Specialized solutions for student projects and enterprise clients.
            </motion.p>
          </div>
        </div>

        {/* Cards Container Context */}
        <div className="pb-12 md:pb-16">
          <motion.div 
            className="grid grid-cols-1 gap-12 lg:gap-16 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* ========================================= */}
            {/* CARD 1: Hardware Services (FROM LEFT)     */}
            {/* ========================================= */}
            <motion.div 
                variants={leftCardVariants}
                className="group flex flex-col lg:flex-row bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-zinc-200/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-default hover:border-zinc-300 transition-colors duration-300 will-change-transform"
            >
                {/* --- LEFT COLUMN: CORE CONTENT --- */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="relative z-10 flex-1 flex flex-col">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-zinc-900 tracking-tight mb-4">Hardware Services</h3>
                      
                      <p className="text-base md:text-lg text-zinc-500 font-poppins font-medium leading-relaxed mb-10 max-w-[480px]">
                        Custom hardware prototypes and embedded systems designed to your exact specs. We bridge the gap between idea and physical prototype.
                      </p>
                      
                      {/* Focal Point Pricing Block */}
                      <div className="mt-auto mb-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl md:text-7xl lg:text-8xl font-poppins font-extrabold tracking-tighter text-zinc-900 leading-none">₱999</span>
                        </div>
                        <p className="text-xs md:text-sm font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mt-3 ml-1">Starting price</p>
                      </div>
                      
                      <Link 
                          href="/projects/hardware"
                          className="relative inline-flex items-center justify-center w-full lg:max-w-sm bg-zinc-900 text-white font-poppins font-bold text-base py-5 rounded-2xl hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-[0.98]"
                      >
                          Explore Hardware Solutions
                      </Link>
                  </div>
                </div>
    
                {/* --- RIGHT COLUMN: FEATURES --- */}
                <div className="lg:w-[400px] xl:w-[450px] p-8 md:p-12 lg:p-16 flex flex-col bg-zinc-50/50 border-t lg:border-t-0 lg:border-l border-zinc-100/80 relative z-10">
                  <h4 className="text-sm font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">What's included</h4>
                  <ul className="space-y-6 flex-1">
                      {HARDWARE_FEATURES.map((feature, i) => (
                      <li key={i} className="flex items-center gap-5 group/item">
                          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(30,58,138,0.3)] transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-[0_0_20px_rgba(30,58,138,0.5)]">
                            <Check className="w-4 h-4 text-white" strokeWidth={3.5} />
                          </div>
                          <span className="text-base md:text-lg text-zinc-700 font-poppins font-semibold leading-tight">{feature}</span>
                      </li>
                      ))}
                  </ul>
                </div>
            </motion.div>
    
            {/* ========================================= */}
            {/* CARD 2: Software Services (FROM RIGHT)    */}
            {/* ========================================= */}
            <motion.div 
                variants={rightCardVariants}
                className="group flex flex-col lg:flex-row bg-white/90 backdrop-blur-sm rounded-[2.5rem] border border-zinc-200/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-default hover:border-zinc-300 transition-colors duration-300 will-change-transform"
            >
                {/* --- LEFT COLUMN: CORE CONTENT --- */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="relative z-10 flex-1 flex flex-col">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-zinc-900 tracking-tight mb-4">Software Services</h3>
                      
                      <p className="text-base md:text-lg text-zinc-500 font-poppins font-medium leading-relaxed mb-10 max-w-[480px]">
                         Modern web apps and IoT dashboards built with bleeding-edge technology. Scalable solutions that grow with your business.
                      </p>
                      
                      {/* Focal Point Pricing Block */}
                      <div className="mt-auto mb-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl md:text-7xl lg:text-8xl font-poppins font-extrabold tracking-tighter text-zinc-900 leading-none">₱999</span>
                        </div>
                        <p className="text-xs md:text-sm font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mt-3 ml-1">Starting price</p>
                      </div>
    
                      <Link 
                          href="/projects/software"
                          className="relative inline-flex items-center justify-center w-full lg:max-w-sm bg-zinc-900 text-white font-poppins font-bold text-base py-5 rounded-2xl hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-[0.98]"
                      >
                          Explore Software Solutions
                      </Link>
                  </div>
                </div>
    
                {/* --- RIGHT COLUMN: FEATURES --- */}
                <div className="lg:w-[400px] xl:w-[450px] p-8 md:p-12 lg:p-16 flex flex-col bg-zinc-50/50 border-t lg:border-t-0 lg:border-l border-zinc-100/80 relative z-10">
                  <h4 className="text-sm font-poppins font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">What's included</h4>
                  <ul className="space-y-6 flex-1">
                      {SOFTWARE_FEATURES.map((feature, i) => (
                      <li key={i} className="flex items-center gap-5 group/item">
                          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(30,58,138,0.3)] transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-[0_0_20px_rgba(30,58,138,0.5)]">
                            <Check className="w-4 h-4 text-white" strokeWidth={3.5} />
                          </div>
                          <span className="text-base md:text-lg text-zinc-700 font-poppins font-semibold leading-tight">{feature}</span>
                      </li>
                      ))}
                  </ul>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </section>
  );
});

export default ServicesSection;