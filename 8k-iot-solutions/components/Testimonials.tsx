"use client";

import React, { useState, memo } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = memo(function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {

  // Purely dynamic - if no testimonials in DB, don't show the section
  const testimonials = initialTestimonials;

  if (testimonials.length === 0) {
    return null; // Side-step rendering if no content
  }

  // Separate rows for the 2-lane mobile design to handle infinite scroll
  const half = Math.ceil(testimonials.length / 2);
  const topRowTestimonials = testimonials.slice(0, half);
  const bottomRowTestimonials = testimonials.slice(half);

  const duplicatedTopRow = [...topRowTestimonials, ...topRowTestimonials, ...topRowTestimonials, ...topRowTestimonials]; 
  const duplicatedBottomRow = [...bottomRowTestimonials, ...bottomRowTestimonials, ...bottomRowTestimonials, ...bottomRowTestimonials]; 
  const duplicatedDesktopRow = [...testimonials, ...testimonials, ...testimonials];

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      className="relative py-8 md:py-10 bg-transparent overflow-hidden z-0"
    >

      {/* Floating Gradient Orbs for Depth */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="relative z-10">
        
        {/* === MOBILE 2-ROW SCROLL === */}
        <div className="md:hidden flex flex-col gap-4 overflow-hidden w-full">
          {/* Row 1: Scrolls Left */}
          <div className="flex animate-scroll-left py-2">
            {duplicatedTopRow.map((item, idx) => (
              <TestimonialCard key={`top-${idx}`} item={item} idx={idx} />
            ))}
          </div>
          
          {/* Row 2: Scrolls Right */}
          <div className="flex animate-scroll-right py-2">
            {duplicatedBottomRow.map((item, idx) => (
              <TestimonialCard key={`bottom-${idx}`} item={item} idx={idx} />
            ))}
          </div>
        </div>

        {/* === DESKTOP 1-ROW SCROLL === */}
        <div className="hidden md:flex overflow-hidden">
          <div className="flex animate-scroll-left py-6">
            {duplicatedDesktopRow.map((item, idx) => (
              <TestimonialCard key={`desk-${idx}`} item={item} idx={idx} />
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
});


export default Testimonials;

// Ensure the specific type matches the mapped arrays layout
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

function TestimonialCard({ item, idx }: TestimonialProps) {
  const [imgError, setImgError] = useState(false);
  
  // Extract initials if Image fails (e.g. "Sir Jayson" -> "SJ")
  const initials = item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { duration: 0.6, ease: "easeOut", delay: (idx % 4) * 0.15 } 
        }
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative inline-block w-[300px] sm:w-[450px] mx-3 md:mx-4 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 group select-none whitespace-normal align-top overflow-hidden flex-shrink-0"
    >
      {/* Large faint background Quote Icon for premium watermark effect */}
      <Quote 
        className="absolute -top-4 -right-2 w-24 md:w-32 h-24 md:h-32 text-gray-100 opacity-50 rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110" 
        strokeWidth={1}
      />

      <div className="relative z-10 flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
        {/* Avatar Frame - Uses fallback state */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-brand-100 group-hover:border-brand-500 transition-colors duration-300 flex-shrink-0 bg-brand-50 flex items-center justify-center">
          {!imgError ? (
            <Image 
              src={item.avatar} 
              alt={item.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-sans font-bold text-brand-700 text-lg">{initials}</span>
          )}
        </div>
        
        <div>
          <h4 className="font-sans font-bold text-gray-900 text-base md:text-lg leading-tight line-clamp-1">
            {item.name}
          </h4>
          <p className="font-poppins text-[10px] md:text-xs font-semibold text-brand-600 uppercase tracking-widest mt-0.5 md:mt-1 line-clamp-1">
            {item.position}
          </p>
        </div>
      </div>

      {/* Dynamic Rating Row */}
      <div className="relative z-10 flex gap-0.5 md:gap-1 mb-3 md:mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200'}`} 
          />
        ))}
      </div>

      <blockquote className="relative z-10 font-poppins text-gray-600 text-sm md:text-[15px] leading-relaxed italic line-clamp-4">
        &quot;{item.text}&quot;
      </blockquote>
    </motion.div>
  );
}