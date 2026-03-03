import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-white overflow-hidden z-0">
      
      {/* Engineered Technical Blueprint Background */}
      <div 
        className="absolute inset-0 z-[-1] pointer-events-none opacity-[0.15] animate-blueprintShift" 
        style={{
          backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        aria-hidden="true"
      />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ----- LEFT COLUMN: Narrative & Metrics ----- */}
          {/* We use animate-fade-in-up (matches the config) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 pt-8 lg:pt-0 animate-fade-in-up">
            
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

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-4 md:gap-5 mb-10 max-w-[420px]">
              <div className="group flex flex-col items-start border-l-[3px] border-gray-200 hover:border-brand-500 bg-gray-50/80 p-4 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight">10+</span>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-poppins font-semibold uppercase tracking-wider">
                  Projects Completed
                </div>
              </div>

              <div className="group flex flex-col items-start border-l-[3px] border-gray-200 hover:border-brand-500 bg-gray-50/80 p-4 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight">2+</span>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-poppins font-semibold uppercase tracking-wider">
                  Years Experience
                </div>
              </div>
            </div>

            <div>
              <Link 
                href="#contact" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-900 text-white text-[14.5px] font-medium font-poppins rounded-[8px] overflow-hidden transition-all duration-300 hover:bg-brand-700 active:scale-[0.98]"
              >
                <span>Contact Us</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ----- RIGHT COLUMN: Founders Photo ----- */}
          <div className="lg:col-span-5 relative order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative p-2 md:p-2.5 bg-white border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.06)] rounded-xl isolate">
              <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden isolate">
                 <Image 
                  src="/co-founders.jpg" 
                  alt="Founders of 8K IoT Solutions"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute -inset-0 border border-brand-200 z-[-1] rounded-xl translate-x-3 translate-y-3 hidden md:block" />
          </div>

        </div>
      </div>
    </section>
  );
}