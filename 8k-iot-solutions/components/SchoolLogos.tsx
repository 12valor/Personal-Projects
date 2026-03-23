"use client";

import React, { memo } from 'react';
import Image from 'next/image';

const SchoolLogos = memo(function SchoolLogos({ logos = [] }: { logos?: any[] }) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-white z-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-poppins">
            Trusted by Forward-Thinking Institutions
          </span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
          {logos.map((logo, idx) => {
            const logoContent = (
              <div className="relative h-20 md:h-24 lg:h-32 w-48 md:w-56 lg:w-72 p-2 transition-transform duration-300 hover:scale-110">
                <Image 
                  src={logo.image} 
                  alt={logo.name ? `${logo.name} Logo` : 'School Logo'} 
                  fill
                  className="object-contain" 
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            );

            return (
              <div key={logo.id || idx} className="flex items-center justify-center">
                {logo.link ? (
                  <a href={logo.link} target="_blank" rel="noreferrer" className="block">
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
