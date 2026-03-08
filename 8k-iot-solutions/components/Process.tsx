"use client";
import React, { useEffect, useState, useRef } from 'react';

// Lightweight Intersection Observer Hook
function useInView(options = { threshold: 0.15 }) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView] as const;
}

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understanding the project idea, requirements, and constraints.',
  },
  {
    number: '02',
    title: 'Architecture',
    description: 'Designing the hardware components and software system structure.',
  },
  {
    number: '03',
    title: 'Prototyping',
    description: 'Rapid hardware and software development to validate the concept.',
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Testing, refining, and delivering the final system.',
  },
];

export default function Process() {
  const [setRef, inView] = useInView({ threshold: 0.1 });

  return (
    <section id="process" className="relative w-full py-24 bg-white text-zinc-900 overflow-hidden z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={setRef as any}>
        
        {/* Section Header */}
        <div 
          className={`text-center mb-16 md:mb-24 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold tracking-tight text-zinc-900 mb-4">
            How We Build
          </h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl mx-auto">
            From concept to working systems. Our workflow combines hardware engineering with modern software development.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* 
            Connecting Line 
            Desktop: Horizontal line placed behind the content
            Mobile: Vertical line on the left side
          */}
          <div className="absolute left-[28px] top-0 bottom-0 w-[1px] bg-zinc-100 lg:hidden" />
          <div className="hidden lg:block absolute top-[48px] left-0 right-0 h-[1px] bg-zinc-100" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`group relative flex lg:flex-col items-start lg:items-start gap-6 lg:gap-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Node Point (Connecting Dot) */}
                <div className="relative z-20 shrink-0 lg:mb-8 mt-1 lg:mt-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white border border-zinc-200 rounded-full shadow-sm group-hover:scale-110 group-hover:border-zinc-300 group-hover:shadow-md transition-all duration-300 bg-white">
                     <span className="font-poppins font-semibold text-zinc-400 text-sm group-hover:text-zinc-600 transition-colors">
                        {step.number}
                     </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="relative flex-1 lg:pr-4 pt-1 lg:pt-0">
                  {/* Large Background Number */}
                  <div className="absolute -top-6 -left-4 lg:-top-12 lg:-left-2 text-[6rem] lg:text-[8rem] font-poppins font-bold text-zinc-50/50 -z-10 select-none group-hover:text-zinc-100/60 transition-colors duration-500 pointer-events-none tracking-tighter">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-poppins font-semibold text-zinc-800 mb-3 group-hover:text-zinc-950 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-zinc-500/90 font-medium leading-relaxed group-hover:text-zinc-600 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
