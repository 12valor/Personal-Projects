"use client";

import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { GraduationCap, Building2, Library, School, BookOpen, Globe2, Shapes } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const baseLogos = [
  { name: 'Quantum University', icon: GraduationCap, color: 'text-brand-600' },
  { name: 'Global Institute', icon: Globe2, color: 'text-blue-600' },
  { name: 'Nexus Academy', icon: Building2, color: 'text-emerald-600' },
  { name: 'Tech Foundation', icon: Shapes, color: 'text-purple-600' },
  { name: 'National Library', icon: Library, color: 'text-amber-600' },
  { name: 'State College', icon: School, color: 'text-rose-600' },
  { name: 'Open Learning', icon: BookOpen, color: 'text-cyan-600' },
];

const SchoolLogos = memo(function SchoolLogos() {
  // Duplicate array 3 times to ensure a seamless infinite scroll across ultra-wide monitors
  const duplicatedLogos = [...baseLogos, ...baseLogos, ...baseLogos];

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden bg-transparent z-0">
      
      {/* CSS for infinite seamless marquee and hover pause */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 45s linear infinite;
        }
        .group-marquee:hover .animate-custom-marquee {
          animation-play-state: paused;
        }
      `}} />

      <motion.div 
        className="w-full max-w-full mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2, margin: "0px 0px -10% 0px" }}
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="text-center mb-10 px-4"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest font-sans">
            Trusted by Forward-Thinking Institutions
          </span>
        </motion.div>

        {/* Marquee Wrapper Container */}
        <div className="relative flex overflow-hidden group-marquee">
          
          {/* Fading Edges to blend with site background seamlessly */}
          <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="flex flex-nowrap gap-12 sm:gap-16 lg:gap-24 items-center w-max animate-custom-marquee pr-12 sm:pr-16 lg:pr-24">
            
            {duplicatedLogos.map((logo, idx) => {
              const Icon = logo.icon;
              // Add slight sizing variation to feel natural, based on index
              const scaleVariation = idx % 2 === 0 ? 'scale-[1.02]' : 'scale-[0.98]';

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  style={{ willChange: 'transform, opacity' }}
                  className={`flex items-center gap-3 shrink-0 opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500 ease-out hover:scale-[1.06] cursor-default ${scaleVariation}`}
                >
                  <Icon className={`w-8 h-8 ${logo.color}`} strokeWidth={1.5} />
                  <span className="text-xl sm:text-2xl font-bold font-sans text-gray-800 whitespace-nowrap tracking-tight">
                    {logo.name}
                  </span>
                </motion.div>
              );
            })}
            
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default SchoolLogos;
