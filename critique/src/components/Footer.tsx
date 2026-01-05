"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { TermsModal } from './TermsModal';
import { PrivacyModal } from './PrivacyModal';
import { GuidelinesModal } from './GuidelinesModal'; // Import new modal
import { SupportModal } from './SupportModal';       // Import new modal

export const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false); // New State
  const [showSupport, setShowSupport] = useState(false);       // New State

  return (
    <>
      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/10 mt-auto font-poppins">
        
        {/* --- PROTOTYPE BANNER --- */}
        <div className="bg-amber-400 text-black py-3 font-poppins shadow-sm relative z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center md:justify-start gap-3 text-center md:text-left">
             <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
             <p className="text-xs font-black uppercase tracking-widest">
               Prototype Build v0.1 — Data is currently simulated.
             </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            
            {/* BRAND BLOCK */}
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center gap-3 group mb-6 w-fit">
                <div className="w-8 h-8 bg-[#FF0032] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[10px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
                <span className="font-black tracking-tighter text-2xl uppercase italic text-slate-900 dark:text-white">
                  Critique<span className="text-[#FF0032]">.</span>
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                The honest feedback loop for creators. Stop guessing why your retention drops. Get brutal, timestamped critiques from the community.
              </p>
            </div>

            <div className="hidden md:block md:col-span-1" />

            {/* LINKS */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {/* FIXED: Live Feed now scrolls to the feed section */}
                <li><Link href="/#feed-section" className="hover:text-[#FF0032] transition-colors">Live Feed</Link></li>
                <li><Link href="/profile" className="hover:text-[#FF0032] transition-colors">Creator Dashboard</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Resources</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {/* FIXED: Now opens Guidelines Modal */}
                <li>
                  <button onClick={() => setShowGuidelines(true)} className="hover:text-[#FF0032] transition-colors text-left">
                    Guidelines
                  </button>
                </li>
                {/* FIXED: Now opens Support Modal */}
                <li>
                  <button onClick={() => setShowSupport(true)} className="hover:text-[#FF0032] transition-colors text-left">
                    Support
                  </button>
                </li>
              </ul>
            </div>

            {/* LEGAL LINKS */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="hover:text-[#FF0032] transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowTerms(true)} className="hover:text-[#FF0032] transition-colors text-left">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="mt-20 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              © {new Date().getFullYear()} Critique. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-slate-400">
               <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Twitter</span>
               <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Discord</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RENDER MODALS */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <GuidelinesModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
      <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </>
  );
};