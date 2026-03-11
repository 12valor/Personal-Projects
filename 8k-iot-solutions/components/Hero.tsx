"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFadeUpClasses, getStaggerStyle } from '@/lib/animations';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Using the co-founders image for all slots to create the seamless vertical flow
  const scrollImages = ['/client.jpg', '/client.jpg', '/client.jpg', '/client.jpg'];

  return (
    <section id="home" className="relative min-h-[100vh] lg:min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden z-0 bg-transparent">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ----- LEFT COLUMN: Content Stack ----- */}
          {/* pt-8 and lg:pt-12 moves this stack higher up the page */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-8 lg:pt-16 opacity-0 animate-heroPop">
            <h1 
              className={`font-sans font-bold text-4xl sm:text-5xl lg:text-[3.5rem] text-slate-900 tracking-tight leading-[1.12] mb-6 ${getFadeUpClasses(mounted, 'translate-y-8')}`}
              style={getStaggerStyle(mounted, 1)}
            >
              Building Ideas <br className="hidden sm:block" />
              <span className="text-brand-900">Into Reality</span>
            </h1>
            
            <p 
              className={`font-poppins font-normal text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-[58ch] mb-10 ${getFadeUpClasses(mounted, 'translate-y-8')}`}
              style={getStaggerStyle(mounted, 2)}
            >
              We offer a range of hardware and software services, including device prototyping, system integration, and web-based solutions, tailored to help students and innovators bring their ideas to life.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${getFadeUpClasses(mounted, 'translate-y-8')}`}
              style={getStaggerStyle(mounted, 3)}
            >
              <a 
                href="#contact" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-900 text-white text-[15px] font-bold font-sans rounded-[6px] transition-all duration-300 hover:bg-brand-700 active:scale-[0.98] shadow-sm"
              >
                <span>Start a Project</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <a 
                href="#services" 
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border-2 border-gray-200 bg-white text-gray-900 text-[15px] font-bold font-sans rounded-[6px] transition-all duration-300 hover:border-brand-600 hover:text-brand-600 active:scale-[0.98] shadow-sm"
              >
                <span>Explore Services</span>
              </a>
            </div>
          </div>

          {/* ----- RIGHT COLUMN: Asymmetric Scrolling Grid ----- */}
          <div 
            className={`lg:col-span-6 relative h-[500px] sm:h-[650px] w-full rounded-3xl overflow-hidden lg:ml-8 mt-12 lg:mt-0 ${getFadeUpClasses(mounted, 'translate-y-8')}`}
            style={getStaggerStyle(mounted, 2)}
          >
            
            {/* Gradient masks to ensure images don't look cut off at the edges */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            {/* The Grid Container - Ensure co-founders.jpg is in /public folder */}
            <div className="grid grid-cols-2 gap-4 h-full transform -rotate-3 scale-110">
              
              {/* Column 1: Top to Bottom (Scroll Down) */}
              <div className="relative h-full overflow-hidden">
                <div className="flex flex-col gap-4 animate-scroll-down">
                  {scrollImages.map((src, idx) => (
                    <div key={`down-${idx}`} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                      <Image 
                        src={src} 
                        alt="Work Showcase" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={idx < 2} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Bottom to Top (Scroll Up) */}
              <div className="relative h-full overflow-hidden">
                <div className="flex flex-col gap-4 animate-scroll-up">
                  {scrollImages.map((src, idx) => (
                    <div key={`up-${idx}`} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                      <Image 
                        src={src} 
                        alt="Work Showcase" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={idx < 2}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
