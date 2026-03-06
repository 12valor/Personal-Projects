"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

// --- Lightweight Intersection Observer Hook ---
function useInView(options = { threshold: 0.15 }) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView] as const;
}

// --- Data ---
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

export default function ServicesSection() {
  const [setRef, inView] = useInView();

  return (
    <section id="services" className="relative w-full py-24 bg-[#FAFAFA] text-zinc-900 overflow-hidden font-inter">
      {/* Import Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        
        .service-grid-bg {
          background-size: 24px 24px;
          background-image: radial-gradient(circle, #e4e4e7 1px, transparent 1px);
        }
        
        .cubic-out {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}} />

      {/* Subtle Main Background Grid */}
      <div className="absolute inset-0 service-grid-bg opacity-60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={setRef as any}>
        
        {/* Section Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 cubic-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold tracking-tight text-zinc-900">
            Engineering & Software
          </h2>
          <p className="mt-3 text-sm text-zinc-500 font-medium">
            Specialized solutions for government and enterprise infrastructure.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          
          {/* ========================================= */}
          {/* CARD 1: Hardware Services                 */}
          {/* ========================================= */}
          <div 
            className={`
              group flex flex-col bg-white rounded-2xl border border-zinc-200 
              shadow-sm hover:shadow-lg transition-all duration-[250ms] ease-out 
              hover:-translate-y-[6px] overflow-hidden cubic-out
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}
            style={{ transitionDuration: '600ms', transitionDelay: '0ms' }}
          >
            {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
            <div className="relative bg-zinc-50/50 border-b border-zinc-100 px-8 pt-8 pb-8 overflow-hidden">
              {/* Subtle Dot Pattern - Masked to fade out towards the bottom */}
              <div 
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)'
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-poppins font-semibold text-zinc-900">Hardware Services</h3>
                </div>
                
                {/* Descriptive Subtitle for better text hierarchy */}
                <p className="text-sm text-zinc-500 font-medium mb-6 line-clamp-2">
                  End-to-end custom embedded systems, sensor arrays, and physical prototyping.
                </p>
                
                {/* Pricing Block Highlight */}
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-sm font-semibold text-zinc-400">PHP</span>
                  <span className="text-5xl font-poppins font-bold tracking-tighter text-zinc-900">2,000</span>
                  <span className="text-sm font-medium text-zinc-500 ml-1">/project</span>
                </div>
              </div>
            </div>

            {/* --- BODY BLOCK (Features & CTA) --- */}
            <div className="p-8 flex flex-col flex-1 bg-white relative z-10">
              <ul className="space-y-4 flex-1 mb-8">
                {HARDWARE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-sm text-zinc-700 font-medium leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/projects/hardware"
                className="block text-center w-full bg-white border border-zinc-200 text-zinc-800 font-semibold text-sm py-3.5 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Explore Hardware
              </Link>
            </div>
          </div>

          {/* ========================================= */}
          {/* CARD 2: Software Services (Highlighted)   */}
          {/* ========================================= */}
          <div 
            className={`
              group flex flex-col bg-white rounded-2xl border border-zinc-200 
              shadow-md hover:shadow-xl transition-all duration-[250ms] ease-out 
              hover:-translate-y-[6px] overflow-hidden cubic-out ring-1 ring-indigo-50
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}
            style={{ transitionDuration: '600ms', transitionDelay: '150ms' }}
          >
            {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
            <div className="relative bg-gradient-to-b from-indigo-50/80 to-white border-b border-indigo-50/80 px-8 pt-8 pb-8 overflow-hidden">
              {/* Indigo Dot Pattern - Masked to fade out towards the bottom */}
              <div 
                className="absolute inset-0 opacity-70 pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  backgroundImage: 'radial-gradient(#c7d2fe 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)'
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-poppins font-semibold text-zinc-900">Software Services</h3>
                </div>

                {/* Descriptive Subtitle for better text hierarchy */}
                <p className="text-sm text-zinc-500 font-medium mb-6 line-clamp-2">
                  Scalable web applications, modern dashboards, and API integrations.
                </p>

                {/* Pricing Block Highlight */}
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-sm font-semibold text-indigo-400">PHP</span>
                  <span className="text-5xl font-poppins font-bold tracking-tighter text-indigo-950">2,000</span>
                  <span className="text-sm font-medium text-zinc-500 ml-1">/project</span>
                </div>
              </div>
            </div>

            {/* --- BODY BLOCK (Features & CTA) --- */}
            <div className="p-8 flex flex-col flex-1 bg-white relative z-10">
              <ul className="space-y-4 flex-1 mb-8">
                {SOFTWARE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-sm text-zinc-700 font-medium leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/projects/software"
                className="block text-center w-full bg-indigo-600 text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-600/20"
              >
                Explore Software
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}