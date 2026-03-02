"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  // Array of background images. 
  // Ensure you add these matching files (e.g., hero-bg-2.jpg) to your 'public' folder.
  const heroImages = [
    '/hero-bg.png',  // Your original image
    '/hero-bg-2.jpg', // Add a second image
    '/hero-bg-3.png', // Add a third image
  ];

  // Handle the automatic 3-second rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [heroImages.length]);

  return (
    <div className="relative">
      
      {/* HERO SECTION */}
      <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-start overflow-hidden bg-brand-950">
        
        {/* Rotating Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`8K IoT Solutions Background ${index + 1}`}
              fill
              priority={index === 0} // Only preload the first image to optimize page speed
              className={`object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Refined Gradient Overlays for Maximum Text Readability */}
          {/* 1. A subtle universal dark wash to tone down bright images */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          
          {/* 2. A deep brand gradient focused on the left text area, fading out to the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/70 to-transparent z-10" />
        </div>

        {/* Hero Content container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center pt-24">
          
          {/* Text block constraint and layout */}
          <div className="max-w-xl opacity-0 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter leading-[1.15] mb-6">
              Engineering the Future of <br className="hidden sm:block" />
              <span className="text-brand-400 font-extrabold tracking-tighter">Connected Systems</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 mb-10 font-light leading-relaxed">
              We deliver bespoke IoT integration and responsive web dashboards, bridging the gap between hardware data and actionable digital insights. Precision, scalability, and performance in every build.
            </p>
            
            {/* Call-to-Action Area */}
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              
              {/* Primary CTA: The Animated Shine Button */}
              <a 
                href="#about" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 overflow-hidden rounded-full border-[3px] border-white/30 bg-[#006bb3] text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60 w-full sm:w-auto"
              >
                About Us
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
                </svg>
                {/* The animated shine element */}
                <div className="absolute top-0 -left-[100px] h-full w-[100px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60 group-hover:animate-shine"></div>
              </a>

              {/* Secondary CTA: Transparent outline with matching animations */}
              <a 
                href="#services" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 overflow-hidden rounded-full border-[3px] border-white/40 bg-transparent backdrop-blur-sm text-[15px] font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/10 hover:border-white w-full sm:w-auto"
              >
                Our Services
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>

            </div>
          </div>

        </div>
      </section>

      {/* Placeholder for subsequent sections to allow scrolling */}
      <section id="about" className="h-screen bg-white p-20">
        <h2 className="text-4xl font-bold text-brand-950">About Section Placeholder</h2>
      </section>
      
    </div>
  );
}