"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useInView } from '@/lib/animations';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sir Jayson",
    position: "Thesis Adviser • TUPV",
    text: "The technical precision 8K IoT Solutions brings to hardware prototyping is impressive. Their parking detection system is a testament to their engineering growth.",
    avatar: "/avatars/jayson.jpg"
  },
  {
    name: "Sherack Dojillo",
    position: "Project Partner • Hardware",
    text: "Collaborating with AG on IoT projects like the automatic fish skin dryer showed me how hardware and software can truly be integrated seamlessly.",
    avatar: "/avatars/sherack.jpg"
  },
  {
    name: "Technowatch Admin",
    position: "Admin • Operations Team",
    text: "8K built our organizational platform with a focus on speed and clean UI. Their student-led approach doesn't compromise on professional standards.",
    avatar: "/avatars/tech.jpg"
  },
  {
    name: "Adriano's Coffee",
    position: "Business Owner • Retail",
    text: "From marketing logos to technical advice, 8K has been an essential partner in launching our physical and digital presence.",
    avatar: "/avatars/coffee.jpg"
  }
];

// Duplicate for seamless looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const [setRef, inView] = useInView();

  return (
    <section className="relative py-10 md:py-12 bg-transparent overflow-hidden z-0" ref={setRef as unknown as React.LegacyRef<HTMLElement>}>

      {/* Floating Gradient Orbs for Depth */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="relative z-10">
        {/* Continuous Horizontal Scroll Track */}
        <div className="flex overflow-hidden">
          <div className="flex animate-scroll-horizontal whitespace-nowrap py-6">
            {duplicatedTestimonials.map((item, idx) => (
              <TestimonialCard key={idx} item={item} idx={idx} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Ensure the specific type matches the mapped arrays layout
type TestimonialProps = {
  item: {
    name: string;
    position: string;
    text: string;
    avatar: string;
  };
  idx: number;
  inView: boolean;
};

function TestimonialCard({ item, idx, inView }: TestimonialProps) {
  const [imgError, setImgError] = useState(false);
  
  // Extract initials if Image fails (e.g. "Sir Jayson" -> "SJ")
  const initials = item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: (idx % 4) * 0.15 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative inline-block w-[350px] sm:w-[450px] mx-4 bg-white border border-gray-100 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 group select-none whitespace-normal align-top overflow-hidden"
    >
      {/* Large faint background Quote Icon for premium watermark effect */}
      <Quote 
        className="absolute -top-4 -right-2 w-32 h-32 text-gray-100 opacity-50 rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110" 
        strokeWidth={1}
      />

      <div className="relative z-10 flex items-center gap-4 mb-5">
        {/* Avatar Frame - Uses fallback state */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-100 group-hover:border-brand-500 transition-colors duration-300 flex-shrink-0 bg-brand-50 flex items-center justify-center">
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
          <h4 className="font-sans font-bold text-gray-900 text-lg leading-tight">
            {item.name}
          </h4>
          <p className="font-poppins text-xs font-semibold text-brand-600 uppercase tracking-widest mt-1">
            {item.position}
          </p>
        </div>
      </div>

      {/* 5-Star Rating Row */}
      <div className="relative z-10 flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>

      <blockquote className="relative z-10 font-poppins text-gray-600 text-[15px] leading-relaxed italic line-clamp-4">
        &quot;{item.text}&quot;
      </blockquote>
    </motion.div>
  );
}