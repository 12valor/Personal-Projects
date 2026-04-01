"use client";

import React, { useState, useRef, memo, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLElement>(null);
  
  // Responsive items calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (testimonials.length === 0) return null;

  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);
  const maxIndex = testimonials.length - itemsPerPage;

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setDirection(1);
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };
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
      id="testimonials"
      ref={containerRef} 
      className="relative w-full pt-2 pb-6 md:pb-8 md:pt-6 bg-transparent overflow-hidden z-0"
      style={{ opacity: sectionOpacity }}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.15 }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="w-full">
          <motion.div variants={headerVariants} className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-[3.25rem] font-poppins font-black tracking-tight text-slate-900 leading-tight">
            What Our Clients <br className="hidden md:block" />
            <span className="text-brand-900 font-bold">Have to Say.</span>
          </h2>
          </motion.div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          
          {/* Main Viewport */}
          <div className="overflow-hidden px-4 -mx-4 py-8">
            <motion.div 
              className="flex gap-4 lg:gap-5"
              animate={{ x: `calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * ((itemsPerPage === 3 ? 20 : 16) / itemsPerPage)}px)` }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag="x"
              dragConstraints={{ 
                left: -(maxIndex * (100 / itemsPerPage)),
                right: 0 
              }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipeThreshold = 50;
                if (offset.x < -swipeThreshold && currentIndex < maxIndex) {
                  nextSlide();
                } else if (offset.x > swipeThreshold && currentIndex > 0) {
                  prevSlide();
                }
              }}
            >
              {testimonials.map((item, idx) => (
                <div 
                  key={`testimonial-${item.id || idx}`} 
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerPage}% - ${((itemsPerPage - 1) * (itemsPerPage === 3 ? 20 : 16)) / itemsPerPage}px)` }}
                >
                  <TestimonialCard item={item} idx={idx} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Minimalist Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 lg:-left-16 z-20">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full bg-white border border-zinc-100 shadow-lg transition-all duration-300 ${
                currentIndex === 0 
                ? 'opacity-0 scale-90 pointer-events-none' 
                : 'opacity-100 scale-100 hover:bg-brand-900 hover:border-brand-900 text-slate-600 hover:text-white hover:shadow-brand-900/20 group-hover/carousel:translate-x-2 md:group-hover/carousel:translate-x-0'
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 lg:-right-16 z-20">
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className={`p-3 rounded-full bg-white border border-zinc-100 shadow-lg transition-all duration-300 ${
                currentIndex === maxIndex 
                ? 'opacity-0 scale-90 pointer-events-none' 
                : 'opacity-100 scale-100 hover:bg-brand-900 hover:border-brand-900 text-slate-600 hover:text-white hover:shadow-brand-900/20 group-hover/carousel:-translate-x-2 md:group-hover/carousel:translate-x-0'
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 md:w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: testimonials.length - itemsPerPage + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === i 
                    ? 'w-8 bg-brand-900' 
                    : 'w-1.5 bg-zinc-200 hover:bg-zinc-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

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
      className="group relative bg-white/80 backdrop-blur-md border border-zinc-100 hover:border-zinc-200 p-5 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full overflow-hidden cursor-default will-change-transform"
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
          <h3 className="text-[13px] font-poppins font-bold text-zinc-900 group-hover:text-brand-900 transition-colors duration-300 tracking-tight truncate">
            {item.name}
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium font-poppins uppercase tracking-wider truncate">
            {item.position}
          </p>
        </div>
      </div>
    </motion.div>
  );
});