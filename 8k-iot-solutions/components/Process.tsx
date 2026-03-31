"use client";
import React, { useRef, memo } from 'react';
import { Search, LayoutTemplate, Cpu, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understanding the project idea, requirements, and constraints.',
    details: 'We dive deep into your vision, target audience, and technical feasibility to ensure a solid foundation from day one.',
    icon: Search
  },
  {
    number: '02',
    title: 'Architecture',
    description: 'Designing the hardware components and software system structure.',
    details: 'Creating custom schematic blueprints, selecting optimal microcontrollers, and mapping out the cloud database architecture.',
    icon: LayoutTemplate
  },
  {
    number: '03',
    title: 'Prototyping',
    description: 'Rapid hardware and software development to validate the concept.',
    details: 'Iterative building of physical electronics and writing functional code to bring the underlying concept to life quickly.',
    icon: Cpu
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Testing, refining, and delivering the final working system.',
    details: 'Rigorous real-world field testing, performance polish, and finally handing over a production-ready IoT solution.',
    icon: Rocket
  },
];

// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.1,
    },
  },
};

const cardContentVariants: Variants = {
  hidden: { opacity: 0, y: 10, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const Process = memo(function Process() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax Background Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const headerY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      id="process" 
      ref={containerRef}
      className="relative w-full pt-12 pb-16 lg:pt-20 lg:pb-24 bg-transparent text-zinc-900 z-0 border-t border-zinc-50 border-b overflow-hidden"
      style={{ opacity: sectionOpacity }}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
    >
      
      {/* 1. Subtle Premium Background Layers (Parallax) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          style={{ y: bgY1 }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-50/60 rounded-full blur-[120px] pointer-events-none will-change-transform" 
        />
        <motion.div 
          style={{ y: bgY2 }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none will-change-transform" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="w-full">
          <motion.div 
            variants={headerVariants}
            className="text-center mb-16 md:mb-24"
          >
          <motion.h2 
            className="text-4xl md:text-[3.5rem] font-sans font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            How We Build
          </motion.h2>
          <motion.p 
            className="text-[16px] md:text-lg text-zinc-500 font-poppins max-w-2xl mx-auto leading-relaxed"
          >
            From concept to working systems. Our workflow combines rigorous hardware engineering with modern, scalable software development practices.
          </motion.p>
          </motion.div>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10 pt-2 lg:pt-0"
          variants={containerVariants}
          style={{ y: cardsY }}
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.number}
                className="group relative flex lg:flex-col items-start lg:items-start gap-6 lg:gap-8"
                variants={cardVariants}
              >
                {/* Node Point */}
                <motion.div 
                  className="sticky top-28 lg:relative lg:top-0 z-20 shrink-0 mt-0 lg:mt-0 lg:mx-auto"
                >
                  <div className="w-[68px] h-[68px] flex items-center justify-center bg-white border-2 border-zinc-100 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:scale-110 group-hover:border-brand-200 group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] transition-all duration-500 ease-out relative isolate">
                     <span className="font-poppins font-bold text-zinc-400 text-sm group-hover:text-brand-600 transition-colors duration-300">
                        {step.number}
                     </span>
                     <div className="absolute inset-0 rounded-full border border-brand-400 opacity-0 group-hover:animate-ping transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>

                {/* Content Panel (Glassmorphism Card) */}
                <motion.div 
                  className="relative flex-1 w-full bg-white/70 backdrop-blur-md border border-zinc-100 hover:border-brand-100/60 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden cursor-default will-change-transform"
                  whileHover={{ 
                    y: -6, 
                    scale: 1.015,
                    backgroundColor: "rgba(255, 255, 255, 0.95)"
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                >
                  {/* Oversized Background Number anchor */}
                  <div className="absolute -top-6 -right-4 text-[7rem] md:text-[9rem] font-poppins font-bold text-zinc-50 -z-10 select-none group-hover:text-brand-50/50 transition-colors duration-500 pointer-events-none tracking-tighter leading-none">
                    {step.number}
                  </div>
                  
                  {/* Step Icon */}
                  <motion.div 
                    variants={cardContentVariants}
                    className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-5 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors duration-500 shadow-sm"
                  >
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-brand-500 transition-colors duration-500" strokeWidth={2} />
                  </motion.div>
                  
                  <motion.h3 
                    variants={cardContentVariants}
                    className="text-xl font-poppins font-bold text-zinc-900 mb-3 group-hover:text-brand-900 transition-colors duration-300 tracking-tight"
                  >
                    {step.title}
                  </motion.h3>
                  
                  <motion.p 
                    variants={cardContentVariants}
                    className="text-[14px] text-zinc-600 font-medium leading-relaxed mb-4"
                  >
                    {step.description}
                  </motion.p>
                  
                  <motion.p 
                    variants={cardContentVariants}
                    className="text-[13px] text-zinc-500/90 leading-relaxed font-poppins border-t border-zinc-100 pt-4 group-hover:border-brand-50 transition-colors duration-500"
                  >
                    {step.details}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
});

export default Process;
