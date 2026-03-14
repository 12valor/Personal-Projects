"use client";
import React from 'react';
import { Search, LayoutTemplate, Cpu, Rocket } from 'lucide-react';

import { useInView, getFadeUpClasses, getStaggerStyle } from '@/lib/animations';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understanding the project idea, requirements, and constraints.',
    details: 'We dive deep into your vision, target audience, and technical feasibility to ensure a solid foundation from day one.',
    icon: Search
  },
  {
    number: '02',
    title: 'Architecture',
    description: 'Designing the hardware components and software system structure.',
    details: 'Creating custom schematic blueprints, selecting optimal microcontrollers, and mapping out the cloud database architecture.',
    icon: LayoutTemplate
  },
  {
    number: '03',
    title: 'Prototyping',
    description: 'Rapid hardware and software development to validate the concept.',
    details: 'Iterative building of physical electronics and writing functional code to bring the underlying concept to life quickly.',
    icon: Cpu
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Testing, refining, and delivering the final working system.',
    details: 'Rigorous real-world field testing, performance polish, and finally handing over a production-ready IoT solution.',
    icon: Rocket
  },
];

export default function Process() {
  const [setRef, inView] = useInView({ threshold: 0.1 });

  return (
    <section id="process" className="relative w-full pt-8 pb-12 lg:pt-12 lg:pb-16 bg-transparent text-zinc-900 overflow-hidden z-0 border-t border-zinc-50 border-b">
      
      {/* 1. Subtle Premium Background Layers */}
      {/* Soft Aurora Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={setRef as any}>
        
        {/* Section Header */}
        <div 
          className={`text-center mb-16 md:mb-24 ${getFadeUpClasses(inView, 'translate-y-8')}`}
          style={getStaggerStyle(inView, 0)}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-6 font-poppins text-xs font-semibold text-brand-600 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Our Process
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-sans font-bold tracking-tight text-zinc-900 mb-5 leading-tight">
            How We Build
          </h2>
          <p className="text-[15px] md:text-base text-zinc-500 font-poppins max-w-2xl mx-auto leading-relaxed">
            From concept to working systems. Our workflow combines rigorous hardware engineering with modern, scalable software development practices.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12 lg:mt-20">
          
          {/* Connecting Line with Glowing Endpoints */}
          <div className="absolute left-[34px] lg:left-0 top-[34px] lg:top-[34px] lg:right-0 bottom-0 lg:bottom-auto w-[2px] lg:w-full lg:h-[2px] bg-zinc-100 -z-10 isolate">
            {/* Glowing endpoints (desktop only) */}
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gradient-to-r from-transparent to-brand-300" />
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gradient-to-l from-transparent to-brand-300" />
            
            {/* Moving glow effect along the line */}
            <div className="absolute top-0 left-0 w-full h-[30%] lg:w-[30%] lg:h-full bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-brand-400/30 to-transparent animate-shimmer" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10 pt-2 lg:pt-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className={`group relative flex lg:flex-col items-start lg:items-start gap-6 lg:gap-8 ${getFadeUpClasses(inView, 'translate-y-12')}`}
                  style={getStaggerStyle(inView, index + 1, 0)}
                >
                  {/* Node Point */}
                  <div className="relative z-20 shrink-0 mt-0 lg:mt-0 lg:mx-auto">
                    <div className="w-[68px] h-[68px] flex items-center justify-center bg-white border-2 border-zinc-100 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:scale-110 group-hover:border-brand-200 group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] transition-all duration-500 ease-out relative isolate">
                       <span className="font-poppins font-bold text-zinc-400 text-sm group-hover:text-brand-600 transition-colors duration-300">
                          {step.number}
                       </span>
                       {/* Subtle outer ping on hover */}
                       <div className="absolute inset-0 rounded-full border border-brand-400 opacity-0 group-hover:animate-ping transition-opacity duration-300 -z-10" />
                    </div>
                  </div>

                  {/* Content Panel (Glassmorphism Card) */}
                  <div className="relative flex-1 w-full bg-white/70 hover:bg-white backdrop-blur-md border border-zinc-100 hover:border-brand-100/60 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 ease-out overflow-hidden">
                    
                    {/* Oversized Background Number anchor */}
                    <div className="absolute -top-6 -right-4 text-[7rem] md:text-[9rem] font-poppins font-bold text-zinc-50 -z-10 select-none group-hover:text-brand-50/50 transition-colors duration-500 pointer-events-none tracking-tighter leading-none">
                      {step.number}
                    </div>
                    
                    {/* Step Icon */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-5 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors duration-500 shadow-sm">
                      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-brand-500 transition-colors duration-500" strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-xl font-poppins font-bold text-zinc-900 mb-3 group-hover:text-brand-900 transition-colors duration-300 tracking-tight">
                      {step.title}
                    </h3>
                    
                    <p className="text-[14px] text-zinc-600 font-medium leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    <p className="text-[13px] text-zinc-500/90 leading-relaxed font-poppins border-t border-zinc-100 pt-4 group-hover:border-brand-50 transition-colors duration-500">
                      {step.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
