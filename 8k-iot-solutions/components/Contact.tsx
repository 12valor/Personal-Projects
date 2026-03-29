"use client";

import React, { useRef, useActionState, memo } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitContactForm } from '@/app/contact';

const sectionVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Contact = memo(() => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const formY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const dotGridY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const searchParams = useSearchParams();
  const initialMessage = searchParams?.get("project_idea") || "";

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { success?: boolean; message?: string; error?: string } | null, formData: FormData) => {
      return await submitContactForm(formData);
    },
    null
  );

  return (
    <motion.section style={{ opacity: sectionOpacity }} ref={containerRef} id="contact" className="relative py-12 lg:py-16 bg-slate-950 overflow-hidden z-0 font-poppins">

      <motion.div 
        className="absolute inset-0 z-[-2] opacity-20" 
        style={{
          y: dotGridY,
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <motion.div variants={columnVariants} className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-[2px] w-6 bg-brand-400 rounded-full"></span>
              <span className="font-poppins font-semibold text-brand-400 tracking-[0.1em] text-[12px] uppercase">
                Get in Touch
              </span>
            </div>

            <h2 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-[3.25rem] text-white tracking-tight leading-[1.12] mb-6">
              Let&apos;s engineer your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-200">
                next ecosystem.
              </span>
            </h2>
            
            <p className="font-poppins text-slate-400 text-[15px] sm:text-[16px] leading-[1.7] mb-12 max-w-md">
              Whether you need precise hardware prototyping or a scalable data dashboard, we&apos;re ready to architect the solution. Based in Talisay City, serving visionaries everywhere.
            </p>

            {/* ----- CONTACT INFO CARDS (Premium Dark) ----- */}
            <div className="w-full flex flex-col gap-5">
              
              {/* Card 1: Location */}
              <div className="group bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06] shadow-xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:scale-[1.02] cursor-default">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.02] flex items-center justify-center text-slate-500 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-poppins text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">Location</h4>
                    <p className="font-poppins font-medium text-[16px] text-slate-200">Talisay City, Negros Occidental</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Email */}
              <a href="mailto:8kiotsolutions@gmail.com" className="group bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06] shadow-xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.02] flex items-center justify-center text-slate-500 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-10.5 7.5L3 6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-poppins text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">Email</h4>
                    <p className="font-poppins font-medium text-[16px] text-slate-200 group-hover:text-brand-300 transition-colors">8kiotsolutions@gmail.com</p>
                  </div>
                </div>
              </a>

            </div>
          </motion.div>


          {/* ----- RIGHT SIDE: Clean Form Panel ----- */}
          <motion.div style={{ y: formY }} className="lg:col-span-6 lg:col-start-7 w-full relative">
            <motion.div variants={columnVariants}>
              {/* The Form Container — clean, no glass tricks */}
              <div className="bg-white/[0.04] p-8 md:p-10 rounded-2xl border border-white/[0.06] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">

              {/* Success Message */}
              {state?.success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-poppins text-center">
                  <svg className="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {state.message}
                </div>
              )}

              {/* Error Message */}
              {state?.error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-poppins text-center">
                  <svg className="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {state.error}
                </div>
              )}

              <form action={formAction} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="font-poppins text-[11px] font-medium text-slate-400 tracking-wider group-focus-within:text-brand-400 transition-colors">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. AG Evangelista"
                      className="w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-4 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-slate-900/60 focus:border-brand-400/50 focus:ring-4 focus:ring-brand-400/5 transition-all duration-300 shadow-inner"
                    />
                  </div>
                  
                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <label className="font-poppins text-[11px] font-medium text-slate-400 tracking-wider group-focus-within:text-brand-400 transition-colors">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      name="email"
                      required
                      placeholder="name@domain.com"
                      className="w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-4 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-slate-900/60 focus:border-brand-400/50 focus:ring-4 focus:ring-brand-400/5 transition-all duration-300 shadow-inner"
                    />
                  </div>
                </div>

                {/* Dropdown / Subject */}
                <div className="space-y-2 group">
                  <label className="font-poppins text-[11px] font-medium text-slate-400 tracking-wider group-focus-within:text-brand-400 transition-colors">
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select 
                      name="inquiryType"
                      required
                      defaultValue=""
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 font-poppins text-[14px] text-slate-300 focus:outline-none focus:bg-brand-500/10 focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all duration-300 appearance-none cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      <option value="" disabled>Select a project type...</option>
                      <option value="hardware">Hardware Prototyping</option>
                      <option value="software">Web Dashboard / Software</option>
                      <option value="integration">Full IoT Integration</option>
                      <option value="other">General Inquiry</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2 group">
                  <label className="font-poppins text-[11px] font-medium text-slate-400 tracking-wider group-focus-within:text-brand-400 transition-colors">
                    Project Details
                  </label>
                  <textarea 
                    key={initialMessage}
                    name="message"
                    required
                    defaultValue={initialMessage}
                    rows={4}
                    placeholder="Tell us about your technical requirements..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-brand-500/10 focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all duration-300 resize-none"
                  />
                </div>

                  {/* Submit Button - font-medium refined */}
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full group flex justify-center items-center gap-2 bg-brand-500 text-white font-poppins font-medium text-[15px] py-4 rounded-xl transition-all duration-300 hover:bg-brand-400 active:scale-[0.98] shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>
                      {isPending ? 'Sending...' : 'Send Message'}
                    </span>
                    {isPending ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </button>
                
              </form>
            </div>
          </motion.div>
        </motion.div>

        </div>
      </motion.div>
    </motion.section>
  );
});

export default Contact;