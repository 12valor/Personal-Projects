"use client";
import React, { useRef, memo } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';




const HARDWARE_FEATURES = [
  "IoT Project Development",
  "Hardware Prototyping",
  "Project Consultation",
];

const SOFTWARE_FEATURES = [
  "UI/UX Design",
  "Web Application Development",
  "Project Consultation",
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
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const leftCardVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const rightCardVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
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
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-4xl md:text-[3rem] font-sans font-bold tracking-tight text-zinc-900 mb-4 leading-tight"
            >
              Hardware & Software
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-[16px] md:text-lg text-zinc-500 font-poppins max-w-2xl mx-auto leading-relaxed"
            >
              Specialized solutions for student projects and enterprise clients.
            </motion.p>
          </div>
        </div>

        {/* Cards Container Context */}
        <div className="pb-12 md:pb-16 px-2 sm:px-0">
          <motion.div 
            className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* ========================================= */}
            {/* CARD 1: Hardware Services (FROM LEFT)     */}
            {/* ========================================= */}
            <motion.div 
                variants={leftCardVariants}
                className="group flex flex-col lg:flex-row bg-white/90 backdrop-blur-sm rounded-3xl lg:rounded-[2.5rem] border border-zinc-200/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-default hover:border-zinc-300 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 will-change-transform"
            >
                {/* --- LEFT COLUMN: CORE CONTENT --- */}
                <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="relative z-10 flex-1 flex flex-col">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold text-zinc-950 tracking-tight mb-2 lg:mb-3">Hardware Services</h3>
                      
                      <p className="text-[15px] sm:text-base md:text-lg text-zinc-600 font-poppins font-medium leading-snug mb-4 max-w-[480px]">
                        Custom hardware prototypes and embedded systems. We help turn your ideas into real, working devices.
                      </p>
                      
                      <div className="flex items-center gap-2 mb-8 md:mb-10 opacity-80">
                         <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                         <span className="text-xs md:text-sm font-poppins font-semibold text-zinc-500 tracking-wide">Built for reliability • Fast • Precision-engineered</span>
                      </div>
                      
                      {/* Focal Point Pricing Block */}
                      <div className="mt-8 lg:mt-auto mb-8 md:mb-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[3.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-poppins font-extrabold tracking-tighter text-zinc-900 leading-none">₱999</span>
                          <span className="text-lg md:text-xl font-poppins font-medium text-zinc-400 tracking-tight">base price</span>
                        </div>
                        <p className="text-[13px] sm:text-sm font-poppins font-medium text-zinc-500 mt-3 ml-1">Perfect for small projects, student capstones, and MVPs.</p>
                      </div>
                      
                      <Link 
                          href="/projects/hardware"
                          className="relative inline-flex items-center justify-center w-full lg:max-w-sm bg-zinc-950 text-white font-poppins font-semibold text-sm lg:text-base py-4 lg:py-5 rounded-2xl hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-blue-500/10 transition-all duration-300 active:scale-[0.98]"
                      >
                          Start Your Hardware Project
                      </Link>
                  </div>
                </div>
    
                {/* --- RIGHT COLUMN: FEATURES --- */}
                <div className="lg:w-[400px] xl:w-[450px] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col bg-zinc-50/80 border-t lg:border-t-0 lg:border-l border-zinc-200/60 relative z-10">
                  <h4 className="text-xs sm:text-sm font-poppins font-bold text-zinc-900 uppercase tracking-[0.15em] mb-6 md:mb-8">What's included</h4>
                  <ul className="space-y-4 md:space-y-6 flex-1">
                      {HARDWARE_FEATURES.map((feature, i) => (
                      <li key={i} className="flex items-center gap-4 md:gap-5 group/item transition-transform duration-300 hover:translate-x-1">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-900 shadow-sm border border-blue-800 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover/item:bg-blue-800">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-[15px] md:text-base lg:text-lg text-zinc-600 font-poppins font-medium leading-tight group-hover/item:text-zinc-900 transition-colors duration-300">{feature}</span>
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
                className="group flex flex-col lg:flex-row bg-white/90 backdrop-blur-sm rounded-3xl lg:rounded-[2.5rem] border border-zinc-200/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-default hover:border-zinc-300 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 will-change-transform"
            >
                {/* --- LEFT COLUMN: CORE CONTENT --- */}
                <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="relative z-10 flex-1 flex flex-col">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold text-zinc-950 tracking-tight mb-2 lg:mb-3">Software Services</h3>
                      
                      <p className="text-[15px] sm:text-base md:text-lg text-zinc-600 font-poppins font-medium leading-snug mb-4 max-w-[480px]">
                         Modern web apps and IoT dashboards tailored to your needs. We build clean, reliable software that just works.
                      </p>
                      
                      <div className="flex items-center gap-2 mb-8 md:mb-10 opacity-80">
                         <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                         <span className="text-xs md:text-sm font-poppins font-semibold text-zinc-500 tracking-wide">Built for scalability • Fast • Reliable</span>
                      </div>
                      
                      {/* Focal Point Pricing Block */}
                      <div className="mt-8 lg:mt-auto mb-8 md:mb-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[3.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-poppins font-extrabold tracking-tighter text-zinc-900 leading-none">₱999</span>
                          <span className="text-lg md:text-xl font-poppins font-medium text-zinc-400 tracking-tight">base price</span>
                        </div>
                        <p className="text-[13px] sm:text-sm font-poppins font-medium text-zinc-500 mt-3 ml-1">Perfect for MVPs, landing pages, and web systems.</p>
                      </div>
    
                      <Link 
                          href="/projects/software"
                          className="relative inline-flex items-center justify-center w-full lg:max-w-sm bg-zinc-950 text-white font-poppins font-semibold text-sm lg:text-base py-4 lg:py-5 rounded-2xl hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-blue-500/10 transition-all duration-300 active:scale-[0.98]"
                      >
                          Start Your Software Project
                      </Link>
                  </div>
                </div>
    
                {/* --- RIGHT COLUMN: FEATURES --- */}
                <div className="lg:w-[400px] xl:w-[450px] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col bg-zinc-50/80 border-t lg:border-t-0 lg:border-l border-zinc-200/60 relative z-10">
                  <h4 className="text-xs sm:text-sm font-poppins font-bold text-zinc-900 uppercase tracking-[0.15em] mb-6 md:mb-8">What's included</h4>
                  <ul className="space-y-4 md:space-y-6 flex-1">
                      {SOFTWARE_FEATURES.map((feature, i) => (
                      <li key={i} className="flex items-center gap-4 md:gap-5 group/item transition-transform duration-300 hover:translate-x-1">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-900 shadow-sm border border-blue-800 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover/item:bg-blue-800">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-[15px] md:text-base lg:text-lg text-zinc-600 font-poppins font-medium leading-tight group-hover/item:text-zinc-900 transition-colors duration-300">{feature}</span>
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