"use client";
import React, { useState, useRef, memo } from 'react';
import Image from 'next/image';
import { Cpu, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';


const containerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.97,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const About = memo(function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const textY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const bgOrbY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const images = [
    "/co-founders.jpg",
    "/about-img-2.jpg", // Placeholder paths for the additional images
    "/about-img-3.jpg"  // Will fall back natively or user will provide them
  ];

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <motion.section style={{ opacity: sectionOpacity }} ref={containerRef} id="about" className="relative py-12 lg:py-16 bg-transparent overflow-hidden z-0">

      {/* Ambient Depth Orb */}
      <motion.div 
        style={{ y: bgOrbY }}
        className="absolute top-[-5%] left-[10%] w-[400px] h-[400px] bg-brand-50/40 rounded-full blur-[120px] pointer-events-none will-change-transform" 
      />
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15, margin: "0px 0px -10% 0px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ----- LEFT COLUMN: Narrative & Metrics ----- */}
          <motion.div 
            style={{ y: textY }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left justify-center order-2 lg:order-1 pt-8 lg:pt-0 max-w-2xl mx-auto lg:mx-0 w-full"
          >
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="h-px w-6 bg-brand-600 rounded-full" />
              <h3 className="text-[12px] font-bold text-brand-900 uppercase tracking-widest font-sans">
                Who We Are
              </h3>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6 font-sans leading-[1.12] tracking-tight"
              style={{ willChange: 'transform, opacity' }}
            >
              Hardware precision meets <br className="hidden md:block"/>
              <span className="text-brand-900">software intelligence.</span>
            </motion.h2>

            <motion.div 
              variants={itemVariants}
              className="max-w-[600px] text-[15px] sm:text-base text-gray-600 font-poppins leading-relaxed mb-10 space-y-4"
              style={{ willChange: 'transform, opacity' }}
            >
              <p>
                As dedicated freelance IoT specialists based in Talisay City, Negros Occidental, we partner with visionaries and businesses to architect custom solutions from the ground up.
              </p>
              <p>
                From designing custom microcontroller circuits to deploying responsive cloud dashboards, our student-centered approach focuses on building robust ecosystems that seamlessly connect the physical world to actionable digital insights.
              </p>
            </motion.div>

            {/* Metrics Row with Lucide Icons */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 md:gap-5 mb-10 max-w-[420px] w-full text-left"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Metric 1 */}
              <div className="group flex flex-col items-start border-l-[3px] border-gray-200 hover:border-brand-500 bg-gray-50/80 p-4 transition-colors duration-300">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight">10+</span>
                  <Cpu className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors duration-300" strokeWidth={2} />
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-poppins font-semibold uppercase tracking-wider mt-1">
                  Projects Completed
                </div>
              </div>

              {/* Metric 2 */}
              <div className="group flex flex-col items-start border-l-[3px] border-gray-200 hover:border-brand-500 bg-gray-50/80 p-4 transition-colors duration-300">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight">2+</span>
                  <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors duration-300" strokeWidth={2} />
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-poppins font-semibold uppercase tracking-wider mt-1">
                  Years Experience
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ willChange: 'transform, opacity' }}>
              <a 
                href="#contact" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-900 text-white text-[14.5px] font-medium font-poppins rounded-[8px] overflow-hidden transition-all duration-300 hover:bg-brand-700 active:scale-[0.98]"
              >
                <span>Contact Us</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* ----- RIGHT COLUMN: Founders Photo — Blueprint Specimen Frame ----- */}
          <motion.div 
            variants={itemVariants}
            className="hidden lg:block lg:col-span-5 relative order-1 lg:order-2"
            style={{ willChange: 'transform, opacity', y: imageY }}
          >
            <div className="relative group/carousel">

              {/* Corner Crosshair Marks — Technical registration reference */}
              <div className="absolute -top-3 -left-3 w-6 h-6 z-30 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-300 group-hover/carousel:bg-brand-400 transition-colors duration-500" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-300 group-hover/carousel:bg-brand-400 transition-colors duration-500" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 z-30 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-300 group-hover/carousel:bg-brand-400 transition-colors duration-500" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-300 group-hover/carousel:bg-brand-400 transition-colors duration-500" />
              </div>

              {/* Main Frame */}
              <div className="relative border-2 border-zinc-200 hover:border-brand-300 rounded-2xl p-1.5 transition-colors duration-500 bg-white/50 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_-8px_rgba(30,58,138,0.1)]">
                <div className="relative aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden isolate">
                  
                  {images.map((src, idx) => (
                    <Image 
                      key={src}
                      src={src} 
                      alt={`About 8K IoT Solutions Image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className={`object-cover transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      priority={idx === 0}
                    />
                  ))}

                  {/* Carousel Controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20">
                    <button 
                      onClick={prevImage}
                      className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-all shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 focus:outline-none"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-all shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 focus:outline-none"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Carousel Indicators (Dots) */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex 
                            ? 'w-4 bg-white shadow-sm' 
                            : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.section>
  );
});

export default About;