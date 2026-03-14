"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import ServiceCardSkeleton from './Skeletons/ServiceCardSkeleton';
import { useInView, getFadeUpClasses, getStaggerStyle } from '@/lib/animations';

// --- Local Scroll Parallax Hook ---
function useParallax(speedMultiplier = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // Calculate distance from center of viewport
        const centerDistance = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        setOffset(centerDistance * speedMultiplier);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial set
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speedMultiplier]);

  return { parallaxRef: ref, offset };
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
  const { parallaxRef, offset } = useParallax(0.04);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state to show skeletons
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="services" className="relative w-full pt-24 pb-8 md:pb-12 bg-transparent text-zinc-900 overflow-hidden font-inter z-0">
      {/* Import Fonts & Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        
        .cubic-out {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Loopable Pop-Up (Floating) Animation */
        @keyframes popFloat {
          0% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-10px); }
          100% { transform: scale(1) translateY(0); }
        }
        
        .animate-pop-loop-1 {
          animation: popFloat 6s ease-in-out infinite;
        }
        
        .animate-pop-loop-2 {
          animation: popFloat 7s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}} />

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

        {/* Parallax Container Context */}
        <div ref={parallaxRef}>
          {/* Cards Container with Parallax transformation */}
          <div style={{ transform: `translateY(${-offset}px)` }}>
            {isLoading ? (
                <div className="grid grid-cols-2 gap-6 md:gap-8 items-stretch pt-4">
                  <ServiceCardSkeleton />
                  <ServiceCardSkeleton isHighlighted />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 md:gap-8 items-stretch">
                  {/* ========================================= */}
                  {/* CARD 1: Hardware Services                 */}
                  {/* ========================================= */}
                  <div 
                      className={`
                      group flex flex-col bg-white rounded-2xl border border-zinc-200 
                      shadow-sm hover:shadow-lg transition-shadow duration-[250ms]
                      overflow-hidden
                      ${inView ? 'animate-pop-loop-1' : ''}
                      ${getFadeUpClasses(inView, 'translate-y-12')}
                      `}
                      style={getStaggerStyle(inView, 1)}
                  >
                      {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
                      <div className="relative bg-zinc-50/50 border-b border-zinc-100 p-4 sm:p-8 overflow-hidden h-auto sm:h-[210px] flex flex-col">
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
          
                      <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-xl font-poppins font-semibold text-zinc-900 leading-tight">Hardware Services</h3>
                          </div>
                          
                          {/* Descriptive Subtitle for better text hierarchy */}
                          <p className="text-[11px] sm:text-sm text-zinc-500 font-medium mb-3 sm:mb-6 line-clamp-2 leading-tight">
                          End-to-end custom embedded systems, sensor arrays, and physical prototyping.
                          </p>
                          
                          {/* Pricing Block Highlight */}
                          <div className="flex items-baseline gap-1 mt-auto flex-wrap">
                          <span className="text-[10px] sm:text-sm font-semibold text-zinc-400">PHP</span>
                          <span className="text-xl sm:text-5xl font-poppins font-bold tracking-tighter text-zinc-900 leading-none">2,000</span>
                          <span className="text-[10px] sm:text-sm font-medium text-zinc-500 sm:ml-1">/project</span>
                          </div>
                      </div>
                      </div>
          
                      {/* --- BODY BLOCK (Features & CTA) --- */}
                      <div className="p-3 sm:p-8 flex flex-col flex-1 bg-white relative z-10">
                      <ul className="space-y-2.5 sm:space-y-4 flex-1 mb-4 sm:mb-8">
                          {HARDWARE_FEATURES.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-3">
                              <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-zinc-400 shrink-0 mt-0.5 sm:mt-0.5" strokeWidth={2.5} />
                              <span className="text-[11px] sm:text-sm text-zinc-700 font-medium leading-tight">{feature}</span>
                          </li>
                          ))}
                      </ul>
          
                      <Link 
                          href="/projects/hardware"
                          className="block text-center w-full bg-white border border-zinc-200 text-zinc-800 font-semibold text-[11px] sm:text-sm py-2 sm:py-3.5 rounded-lg sm:rounded-xl hover:bg-zinc-50 hover:border-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
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
                      shadow-md hover:shadow-xl transition-shadow duration-[250ms]
                      overflow-hidden ring-1 ring-indigo-50
                      ${inView ? 'animate-pop-loop-2' : ''}
                      ${getFadeUpClasses(inView, 'translate-y-12')}
                      `}
                      style={getStaggerStyle(inView, 2)}
                  >
                      {/* --- HEADER BLOCK (Contains Pattern & Pricing) --- */}
                      <div className="relative bg-gradient-to-b from-indigo-50/80 to-white border-b border-indigo-50/80 p-4 sm:p-8 overflow-hidden h-auto sm:h-[210px] flex flex-col">
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
          
                      <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-xl font-poppins font-semibold text-zinc-900 leading-tight">Software Services</h3>
                          </div>
          
                          {/* Descriptive Subtitle for better text hierarchy */}
                          <p className="text-[11px] sm:text-sm text-zinc-500 font-medium mb-3 sm:mb-6 line-clamp-2 leading-tight">
                          Scalable web applications, modern dashboards, and API integrations.
                          </p>
          
                          {/* Pricing Block Highlight */}
                          <div className="flex items-baseline gap-1 mt-auto flex-wrap">
                          <span className="text-[10px] sm:text-sm font-semibold text-indigo-400">PHP</span>
                          <span className="text-xl sm:text-5xl font-poppins font-bold tracking-tighter text-indigo-950 leading-none">2,000</span>
                          <span className="text-[10px] sm:text-sm font-medium text-zinc-500 sm:ml-1">/project</span>
                          </div>
                      </div>
                      </div>
          
                      {/* --- BODY BLOCK (Features & CTA) --- */}
                      <div className="p-3 sm:p-8 flex flex-col flex-1 bg-white relative z-10">
                      <ul className="space-y-2.5 sm:space-y-4 flex-1 mb-4 sm:mb-8">
                          {SOFTWARE_FEATURES.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-3">
                              <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-indigo-500 shrink-0 mt-0.5 sm:mt-0.5" strokeWidth={2.5} />
                              <span className="text-[11px] sm:text-sm text-zinc-700 font-medium leading-tight">{feature}</span>
                          </li>
                          ))}
                      </ul>
          
                      <Link 
                          href="/projects/software"
                          className="block text-center w-full bg-indigo-600 text-white font-semibold text-[11px] sm:text-sm py-2 sm:py-3.5 rounded-lg sm:rounded-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-600/20"
                      >
                          Explore Software
                      </Link>
                      </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}