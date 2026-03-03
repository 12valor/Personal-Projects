"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import About from '@/components/About'; // Make sure this path matches where you saved About.tsx!

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  // Background Images Array
  const heroImages = [
    '/hero-bg.jpg', 
    '/hero-bg-2.jpg',
    '/hero-bg-3.jpg',
  ];

  // Image Rotation Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative font-sans antialiased text-gray-900 bg-white">
      
      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative h-[95vh] min-h-[700px] flex items-center justify-start overflow-hidden bg-brand-950 font-sans">
        
        {/* Rotating Background */}
        <div className="absolute inset-0 z-0 bg-brand-950">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`8K IoT Solutions Header ${index + 1}`}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/60 to-transparent z-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center pt-24">
          
          <div className="max-w-xl opacity-0 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.15] mb-6 font-poppins">
              Engineering the Future of <br className="hidden sm:block" />
              <span className="text-brand-400 font-extrabold tracking-tighter">Connected Systems</span>
            </h1>
            
            <p className="text-lg sm:text-[1.1rem] text-gray-200 mb-10 font-light leading-relaxed font-sans">
              From precision hardware prototyping and environmental sensor integration to scalable, real-time web dashboards. We bridge the gap between physical data and digital insights.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <a 
                href="#about" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 overflow-hidden rounded-full border-[3px] border-white/20 bg-[#006bb3] text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,107,179,0.4)] hover:border-white/40 w-full sm:w-auto font-poppins"
              >
                About Us
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
                </svg>
                {/* Shine Element */}
                <div className="absolute top-0 -left-[100px] h-full w-[100px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60 group-hover:animate-shine"></div>
              </a>

              <a 
                href="#services" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 overflow-hidden rounded-full border-[3px] border-white/40 bg-transparent backdrop-blur-sm text-[15px] font-bold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white/10 hover:border-white w-full sm:w-auto font-poppins"
              >
                Our Services
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <About />
      
    </div>
  );
}