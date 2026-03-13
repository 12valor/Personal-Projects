"use client";

import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative bg-white pt-16 pb-8 overflow-hidden z-0 font-sans">
      
      {/* ----- ENGINEERED BACKGROUND ----- */}
      {/* Extremely faint dot matrix to retain the studio's technical identity */}
      <div 
        className="absolute inset-0 z-[-2] opacity-[0.1]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Top Seamless Divider & Hint of Ambient Tech Glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[80px] bg-brand-400/5 blur-[60px] rounded-full pointer-events-none z-[-1]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ----- INTEGRATED FOOTER CONTENT ----- */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 justify-between items-start pt-4">
          
          {/* ----- LEFT: Brand Logo & Mission ----- */}
          <div className="md:w-5/12 flex flex-col space-y-5">
            
            {/* Logo & Brand Lockup */}
            <div className="flex items-center gap-4 group cursor-pointer w-fit">
              {/* Scaled Logo with 1.03x Hover Interaction */}
              <div className="relative h-9 sm:h-10 w-[100px] sm:w-[110px] transition-transform duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.15)]">
                <Image 
                  src="/8k.png" 
                  alt="8K IoT Solutions Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              
              {/* Clean Vertical Separator */}
              <div className="h-6 w-[1px] bg-slate-200"></div>

              {/* Brand Typography */}
              <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-800 tracking-tight">
                8K <span className="text-brand-600">IoT Solutions</span>
              </h3>
            </div>

            <p className="font-poppins text-[14px] text-slate-500 leading-relaxed max-w-sm">
              Hardware precision meets software intelligence. We architect custom, scalable IoT ecosystems designed to connect the physical world to actionable digital insights.
            </p>
          </div>

          {/* ----- CENTER: Navigation ----- */}
          <div className="md:w-3/12 flex flex-col space-y-3">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] tracking-widest uppercase mb-1">
              Navigation
            </h4>
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="font-poppins text-[14px] text-slate-500 hover:text-brand-600 transition-colors duration-300 w-fit group relative"
              >
                {item}
                {/* Micro-interaction: Glowing Underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-500 transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(59,130,246,0.4)] rounded-full"></span>
              </a>
            ))}
          </div>

          {/* ----- RIGHT: Transmissions & Socials ----- */}
          <div className="md:w-4/12 flex flex-col space-y-4">
            <div>
              <h4 className="font-sans font-bold text-slate-800 text-[13px] tracking-widest uppercase mb-2">
                Transmissions
              </h4>
              <p className="font-poppins text-[14px] text-slate-500 mb-1">
                Talisay City, Negros Occidental
              </p>
              <a 
                href="mailto:8kiotsolutions@gmail.com" 
                className="font-poppins text-[14px] text-brand-600 font-medium hover:text-brand-500 transition-colors duration-300"
              >
                8kiotsolutions@gmail.com
              </a>
            </div>
            
            {/* Interactive Social Pills (Shadows restricted to these elements) */}
            <div className="flex gap-3 pt-2">
              
              {/* Facebook */}
              <a href="#" className="shrink-0 group flex items-center justify-start h-[40px] w-[40px] bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:w-[190px] overflow-hidden border border-slate-100 hover:border-brand-200 hover:shadow-[0_4px_15px_rgba(59,130,246,0.12)]">
                <div className="flex items-center justify-center min-w-[40px] h-[40px]">
                  <svg viewBox="0 0 320 512" className="h-[16px] w-[16px] fill-[#1877f2]" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                </div>
                <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[13px] font-sans font-bold text-slate-800 transition-all duration-300 group-hover:w-[140px] group-hover:pl-1">8K IoT Solutions</span>
              </a>

              {/* TikTok */}
              <a href="#" className="shrink-0 group flex items-center justify-start h-[40px] w-[40px] bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:w-[190px] overflow-hidden border border-slate-100 hover:border-brand-200 hover:shadow-[0_4px_15px_rgba(59,130,246,0.12)]">
                <div className="flex items-center justify-center min-w-[40px] h-[40px]">
                  <svg viewBox="0 0 448 512" className="h-[14px] w-[14px] fill-[#000]" xmlns="http://www.w3.org/2000/svg"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/></svg>
                </div>
                <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[13px] font-sans font-bold text-slate-800 transition-all duration-300 group-hover:w-[140px] group-hover:pl-1">@8k_solutions</span>
              </a>

              {/* GitHub */}
              
            </div>
          </div>

        </div>

        {/* ----- BOTTOM COPYRIGHT ----- */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-6">
          <p className="font-poppins text-[13px] text-slate-500">
            &copy; {new Date().getFullYear()} 8K IoT Solutions. All rights reserved.
          </p>
          <div className="font-poppins text-[13px] text-slate-500 flex gap-6">
            <span className="hover:text-brand-600 transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-brand-600 transition-colors cursor-pointer">Terms of Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;