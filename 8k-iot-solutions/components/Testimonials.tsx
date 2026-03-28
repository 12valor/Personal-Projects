"use client";

import React, { useState, useRef, memo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';

// --- Animation Variants (mirroring Process.tsx quality) ---

const containerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.97, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Testimonials = memo(function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {

  const testimonials = initialTestimonials;
  if (testimonials.length === 0) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const headerY = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      ref={containerRef}
      className="relative w-full pt-4 pb-16 md:py-16 bg-transparent overflow-hidden z-0"
      style={{ opacity: sectionOpacity }}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.15 }}
    >

      {/* Parallax Ambient Light (matches Process.tsx depth technique) */}
      <motion.div 
        style={{ y: bgY1 }}
        className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-[140px] pointer-events-none will-change-transform" 
      />
      <motion.div 
        style={{ y: bgY2 }}
        className="absolute bottom-[-5%] left-[5%] w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none will-change-transform" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="w-full">
          <motion.div variants={headerVariants} className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-brand-400" />
            <span className="text-[11px] font-bold text-brand-900 uppercase tracking-[0.25em] font-poppins">
              Client Testimonials
            </span>
            <div className="h-px w-8 bg-brand-400" />
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-sans font-bold tracking-tight text-zinc-900 leading-tight">
            What Our Clients <br className="hidden md:block" />
            <span className="text-brand-900">Have to Say.</span>
          </h2>
          </motion.div>
        </motion.div>

        {/* Testimonial Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {displayTestimonials.map((item, idx) => (
              <TestimonialCard key={`testimonial-${item.id || item.name || idx}`} item={item} idx={startIndex + idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div variants={headerVariants} className="flex justify-center items-center mt-10 md:mt-12 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-5 py-2 text-xs sm:text-sm font-poppins font-semibold rounded-full transition-colors duration-300 ${
                    isActive 
                      ? 'bg-brand-900 text-white shadow-md' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                   }`}
                  aria-label={`Go to page ${pageNum}`}
                >
                  Page {pageNum}
                </button>
              );
            })}
          </motion.div>
        )}

      </div>
    </motion.section>
  );
});

export default Testimonials;

type TestimonialProps = {
  item: {
    name: string;
    position: string;
    text: string;
    avatar: string;
    rating: number;
  };
  idx: number;
};

const TestimonialCard = memo(function TestimonialCard({ item, idx }: TestimonialProps) {
  const [imgError, setImgError] = useState(false);
  const initials = item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Alternate large decorative quote numbers for visual rhythm
  const decorativeNumber = String(idx + 1).padStart(2, '0');

  return (
    <motion.div 
      variants={cardVariants}
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
      className="group relative bg-white/80 backdrop-blur-md border border-zinc-100 hover:border-zinc-200 p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl sm:rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-colors transition-shadow duration-300 flex flex-col h-full overflow-hidden cursor-default will-change-transform"
    >

      {/* Oversized Background Number */}
      <div className="absolute -top-3 -right-2 text-[6rem] font-poppins font-bold text-zinc-50 -z-10 select-none group-hover:text-brand-50/40 transition-colors duration-500 pointer-events-none tracking-tighter leading-none">
        {decorativeNumber}
      </div>

      {/* Rating */}
      <div className="flex gap-0.5 mb-4 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200'}`} 
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="relative z-10 text-[13px] sm:text-[14px] md:text-[15px] text-zinc-600 font-poppins leading-[1.65] mb-4 sm:mb-5 flex-grow">
        &ldquo;{item.text}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="relative z-10 flex items-center gap-3 mt-auto pt-4 border-t border-zinc-100 group-hover:border-brand-50 transition-colors duration-500">
        <div className="w-9 h-9 rounded-full bg-zinc-100 group-hover:bg-brand-50 flex items-center justify-center overflow-hidden shrink-0 transition-colors duration-500 relative">
          {!imgError ? (
            <Image 
              src={item.avatar} 
              alt={item.name}
              fill
              className="object-cover"
              sizes="36px"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-poppins font-bold text-zinc-400 group-hover:text-brand-600 text-[10px] transition-colors duration-300">{initials}</span>
          )}
        </div>
        
        <div className="min-w-0">
          <h4 className="text-[13px] font-poppins font-bold text-zinc-900 group-hover:text-brand-900 transition-colors duration-300 tracking-tight truncate">
            {item.name}
          </h4>
          <p className="text-[10px] text-zinc-500 font-medium font-poppins uppercase tracking-wider truncate">
            {item.position}
          </p>
        </div>
      </div>
    </motion.div>
  );
});