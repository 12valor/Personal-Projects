"use client";

import React, { useActionState, memo } from 'react';
import { submitContactForm } from '@/app/contact';

const Contact = memo(() => {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { success?: boolean; message?: string; error?: string } | null, formData: FormData) => {
      return await submitContactForm(formData);
    },
    null
  );

  return (
    <section id="contact" className="relative py-12 lg:py-16 bg-slate-950 overflow-hidden z-0 font-sans">
      

      <div 
        className="absolute inset-0 z-[-2] opacity-20" 
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      
   
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-brand-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 z-[-1] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3 translate-x-1/3 z-[-1] animate-[pulse_8s_ease-in-out_infinite_alternate]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
      
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            
          
            <div className="inline-flex items-center gap-2 mb-6 opacity-0 animate-[fadeInUp_600ms_ease-out_100ms_forwards]">
              <span className="h-[2px] w-6 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
              <span className="font-poppins font-semibold text-brand-400 tracking-[0.1em] text-[12px] uppercase">
                Initiate Project
              </span>
            </div>

          
            <h2 className="font-sans font-bold text-4xl sm:text-5xl lg:text-[3.25rem] text-white tracking-tight leading-[1.12] mb-6 opacity-0 animate-[fadeInUp_600ms_ease-out_200ms_forwards]">
              Let&apos;s engineer your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-200 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                next ecosystem.
              </span>
            </h2>
            
            {/* Subtext */}
            <p className="font-poppins text-slate-400 text-[15px] sm:text-[16px] leading-[1.7] mb-12 max-w-md opacity-0 animate-[fadeInUp_600ms_ease-out_300ms_forwards]">
              Whether you need precise hardware prototyping or a scalable data dashboard, we&apos;re ready to architect the solution. Based in Talisay City, serving visionaries everywhere.
            </p>

            {/* ----- EDITORIAL SIGNAL ROWS ----- */}
            <div className="w-full flex flex-col opacity-0 animate-[fadeInUp_600ms_ease-out_400ms_forwards]">
              
              {/* Signal Row 1: Location */}
              <div className="group flex items-start py-8 border-t border-white/[0.05] w-full transition-colors duration-500 relative overflow-hidden">
                {/* Subtle interaction highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className="flex items-start gap-8 w-full">
                  {/* Thin Line Icon */}
                  <div className="text-slate-600 group-hover:text-brand-400 transition-colors duration-300 mt-1 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  {/* Metadata Text */}
                  <div className="flex-1">
                    <h4 className="font-poppins text-[11px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-2 group-hover:text-slate-400 transition-colors">
                      Terminal Location
                    </h4>
                    <p className="font-sans text-xl font-light text-slate-200 tracking-wide leading-relaxed">
                      Talisay City, <br />
                      Negros Occidental
                    </p>
                  </div>
                </div>
              </div>

              {/* Signal Row 2: Email */}
              <a href="mailto:8kiotsolutions@gmail.com" className="group flex items-start py-8 border-t border-b border-white/[0.05] w-full transition-colors duration-500 relative overflow-hidden cursor-pointer">
                {/* Subtle interaction highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className="flex items-start gap-8 w-full">
                  {/* Thin Line Icon */}
                  <div className="text-slate-600 group-hover:text-brand-400 transition-colors duration-300 mt-1 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-10.5 7.5L3 6.75" />
                    </svg>
                  </div>
                  {/* Metadata Text */}
                  <div className="flex-1">
                    <h4 className="font-poppins text-[11px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-2 group-hover:text-slate-400 transition-colors">
                      Direct Transmission
                    </h4>
                    <p className="font-sans text-xl font-light text-slate-200 tracking-wide group-hover:text-brand-300 transition-colors duration-300">
                      8kiotsolutions@gmail.com
                    </p>
                  </div>
                </div>
              </a>

            </div>
          </div>


          {/* ----- RIGHT SIDE: Floating Glass Form ----- */}
          <div className="lg:col-span-6 lg:col-start-7 w-full relative opacity-0 animate-[fadeInUp_800ms_ease-out_400ms_forwards]">
            
            {/* Soft Ambient Edge Glow Behind Form */}
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-500/30 via-transparent to-blue-400/20 rounded-2xl blur-xl opacity-70 z-[-1]"></div>

            {/* The Glass Container */}
            <div className="bg-white/[0.02] backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              
              {/* Internal top highlight */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {/* Success Message */}
              {state?.success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-poppins text-center animate-[fadeInUp_400ms_ease-out_forwards]">
                  <svg className="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {state.message}
                </div>
              )}

              {/* Error Message */}
              {state?.error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-poppins text-center animate-[fadeInUp_400ms_ease-out_forwards]">
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
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-brand-500/10 focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all duration-300"
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
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-brand-500/10 focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all duration-300"
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
                    {/* Custom Dropdown Arrow */}
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
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your technical requirements..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 font-poppins text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-brand-500/10 focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full relative group flex justify-center items-center gap-2 bg-brand-600 text-white font-poppins font-medium text-[15px] py-3.5 rounded-lg overflow-hidden transition-all duration-300 hover:bg-brand-500 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] mt-2 border border-brand-400/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isPending ? 'Transmitting...' : 'Send Transmission'}
                  </span>
                  {isPending ? (
                    <svg className="w-4 h-4 relative z-10 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1s_infinite] pointer-events-none z-0"></div>
                </button>
                
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

export default Contact;