"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cpu, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Lightweight Intersection Observer Hook ---
function useInView(options = { threshold: 0.15 }) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect(); // Trigger only once
      }
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView] as const;
}

export default function About() {
  const [setRef, inView] = useInView();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <section id="about" className="relative py-24 lg:py-32 bg-transparent overflow-hidden z-0">
      
      {/* Required Animation Easing */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cubic-out {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}} />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={setRef as any}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ----- LEFT COLUMN: Narrative & Metrics ----- */}
          <div 
            className={`lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 pt-8 lg:pt-0 transition-all duration-[800ms] cubic-out
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}
          >
            
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6 bg-brand-600 rounded-full" />
              <h3 className="text-[12px] font-bold text-brand-900 uppercase tracking-widest font-sans">
                Who We Are
              </h3>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6 font-sans leading-[1.12] tracking-tight">
              Hardware precision meets <br className="hidden md:block"/>
              <span className="text-brand-900">software intelligence.</span>
            </h2>

            <div className="max-w-[600px] text-[15px] sm:text-base text-gray-600 font-poppins leading-relaxed mb-10 space-y-4">
              <p>
                As dedicated freelance IoT specialists based in Talisay City, Negros Occidental, we partner with visionaries and businesses to architect custom solutions from the ground up.
              </p>
              <p>
                From designing custom microcontroller circuits to deploying responsive cloud dashboards, our student-centered approach focuses on building robust ecosystems that seamlessly connect the physical world to actionable digital insights.
              </p>
            </div>

            {/* Metrics Row with Lucide Icons */}
            <div className="grid grid-cols-2 gap-4 md:gap-5 mb-10 max-w-[420px]">
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
            </div>

            <div>
              <a 
                href="#contact" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-900 text-white text-[14.5px] font-medium font-poppins rounded-[8px] overflow-hidden transition-all duration-300 hover:bg-brand-700 active:scale-[0.98]"
              >
                <span>Contact Us</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ----- RIGHT COLUMN: Founders Photo Carousel ----- */}
          <div 
            className={`lg:col-span-5 relative order-1 lg:order-2 transition-all duration-[800ms] cubic-out
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `} 
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative p-2 md:p-2.5 bg-white border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.06)] rounded-xl isolate hover:-translate-y-1 transition-transform duration-500 group/carousel">
              <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden isolate">
                
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
            
            <div className="absolute -inset-0 border border-brand-200 z-[-1] rounded-xl translate-x-3 translate-y-3 hidden md:block transition-transform duration-500 group-hover/carousel:translate-x-4 group-hover/carousel:translate-y-4" />
          </div>

        </div>
      </div>
    </section>
  );
}