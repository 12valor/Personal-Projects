"use client";

import React, { memo } from 'react';
import Image from 'next/image';

const SchoolLogos = memo(function SchoolLogos({ logos = [] }: { logos?: any[] }) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden bg-transparent z-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest font-sans">
            Trusted by Forward-Thinking Institutions
          </span>
        </div>

        {/* Logos Flex Container */}
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 lg:gap-24">
          {logos.map((logo, idx) => {
            const logoContent = (
              <div className="relative h-24 md:h-28 lg:h-36 w-48 md:w-64 lg:w-80 p-2">
                <Image 
                  src={logo.image} 
                  alt={logo.name ? `${logo.name} Logo` : 'School Logo'} 
                  fill
                  className="object-contain p-2" 
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                />
              </div>
            );

            return (
              <div
                key={logo.id || idx}
                className={`flex items-center justify-center shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300 ${logo.link ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {logo.link ? (
                  <a href={logo.link} target="_blank" rel="noreferrer" className="block w-full h-full">
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
