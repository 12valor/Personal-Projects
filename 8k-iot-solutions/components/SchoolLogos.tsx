"use client";

import React, { memo } from 'react';
import Image from 'next/image';

const SchoolLogos = memo(function SchoolLogos({ logos = [] }: { logos?: any[] }) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="relative py-14 lg:py-20 bg-transparent z-0 overflow-hidden">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Label */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-brand-300" />
            <span className="text-[11px] md:text-xs font-bold text-brand-900 uppercase tracking-[0.25em] font-poppins">
              Trusted By Clients From
            </span>
            <div className="h-px w-8 bg-brand-300" />
          </div>
        </div>

        {/* All logos visible, centered, single row, no masking */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
          {logos.map((logo, idx) => {
            const logoContent = (
              <div className="relative h-16 md:h-20 lg:h-24 w-36 md:w-48 lg:w-56 transition-transform duration-500 hover:scale-105 will-change-transform">
                <Image 
                  src={logo.image} 
                  alt={logo.name ? `${logo.name} Logo` : 'School Logo'} 
                  fill
                  className="object-contain drop-shadow-sm" 
                  sizes="(max-width: 768px) 144px, (max-width: 1024px) 192px, 224px"
                />
              </div>
            );

            return (
              <div key={logo.id || idx} className="flex items-center justify-center">
                {logo.link ? (
                  <a href={logo.link} target="_blank" rel="noreferrer" className="block rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-4 cursor-pointer">
                    {logoContent}
                  </a>
                ) : (
                  logoContent
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
});

export default SchoolLogos;
