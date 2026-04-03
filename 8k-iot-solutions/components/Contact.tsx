"use client";

import React, { useRef, useActionState, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitContactForm } from '@/app/contact';

const Contact = memo(() => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
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
    <motion.section 
      style={{ opacity: sectionOpacity }} 
      ref={containerRef} 
      id="contact" 
      className="relative py-16 lg:py-24 bg-slate-950 overflow-hidden z-0 font-poppins"
    >
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* ----- LEFT SIDE: STUDIO CONTENT ----- */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start"
          >

            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[0.95] mb-8">
              Start a <br />
              <span className="text-blue-400">
                Project.
              </span>
            </h2>
            
            <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-12 max-w-md font-medium">
              Got a big idea? We&apos;re here to help you turn it into something real. Whether you&apos;re still at the drawing board or ready to launch, let&apos;s jump in and build it together!
            </p>

            {/* Simplified Contact Details */}
            <div className="space-y-8 w-full border-t border-white/5 pt-12">
              <div className="group flex items-center gap-5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Studio Location</span>
                  <span className="text-slate-200 font-medium text-base">Talisay City, Negros Occidental</span>
                </div>
              </div>

              <a href="mailto:8kiotsolutions@gmail.com" className="group flex items-center gap-5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-10.5 7.5L3 6.75" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Inquiries</span>
                  <span className="text-slate-200 font-medium text-base">8kiotsolutions@gmail.com</span>
                </div>
              </a>
            </div>
          </motion.div>


          {/* ----- RIGHT SIDE: GLASS STUDIO FORM ----- */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl p-8 lg:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative">
              
              {/* Status Messages */}
              <AnimatePresence>
                {state?.success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center"
                  >
                    {state.message}
                  </motion.div>
                )}
                {state?.error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-8 p-5 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium text-center"
                  >
                    {state.error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form action={formAction} className="space-y-8">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } }
                  }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2.5 group">
                      <label htmlFor="contact-fullName" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors duration-300">
                        How should we address you?
                      </label>
                      <input 
                        id="contact-fullName"
                        type="text"
                        name="fullName"
                        required
                        placeholder="Your full name"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[15px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-inner"
                      />
                    </motion.div>
                    
                    {/* Email Input */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2.5 group">
                      <label htmlFor="contact-email" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors duration-300">
                        Where can we reach you?
                      </label>
                      <input 
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        placeholder="name@domain.com"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[15px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-inner"
                      />
                    </motion.div>
                  </div>

                  {/* Inquiry Type */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2.5 group">
                    <label htmlFor="contact-inquiryType" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors duration-300">
                      What can we help you build?
                    </label>
                    <div className="relative">
                      <select 
                        id="contact-inquiryType"
                        name="inquiryType"
                        required
                        defaultValue=""
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[15px] text-slate-200 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 appearance-none cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
                      >
                        <option value="" disabled>Select a project type...</option>
                        <option value="hardware">Hardware Prototyping</option>
                        <option value="software">Web Dashboard / Software</option>
                        <option value="integration">Full IoT Integration</option>
                        <option value="other">General Inquiry</option>
                      </select>
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Message Textarea */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2.5 group">
                    <label htmlFor="contact-message" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors duration-300">
                      Tell us about your masterpiece...
                    </label>
                    <textarea 
                      id="contact-message"
                      key={initialMessage}
                      name="message"
                      required
                      defaultValue={initialMessage}
                      rows={4}
                      placeholder="Share your vision, constraints, and must-haves..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[15px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 resize-none shadow-inner"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button 
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    type="submit"
                    disabled={isPending}
                    className="w-full group flex justify-center items-center gap-3 bg-white text-slate-950 font-sans font-bold text-[15px] py-4 rounded-2xl transition-all duration-300 hover:bg-white active:scale-[0.98] shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.15)] mt-4 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden relative"
                  >
                    <span className="relative z-10">
                      {isPending ? 'Propelling message...' : 'Propel your vision'}
                    </span>
                    {!isPending && (
                      <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1.5 relative z-10" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                    <div className="absolute inset-0 bg-blue-500 origin-left scale-x-0 group-hover:scale-x-0 transition-transform duration-500" />
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.section>
  );
});

export default Contact;