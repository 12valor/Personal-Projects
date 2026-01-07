"use client";

import React, { useState, useRef, useEffect } from "react";
import { SubmissionCard } from "@/components/SubmissionCard";

interface FeedGridProps {
  channels: any[];
}

export const FeedGrid = ({ channels }: FeedGridProps) => {
  // --- MOBILE STATE ---
  const [mobilePage, setMobilePage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 10;

  // Calculate current slice for mobile
  const mobileData = channels?.slice(
    mobilePage * ITEMS_PER_PAGE,
    (mobilePage + 1) * ITEMS_PER_PAGE
  ) || [];

  const hasNextPage = (mobilePage + 1) * ITEMS_PER_PAGE < (channels?.length || 0);

  // --- HANDLERS ---
  const handleNext = () => {
    // 1. Trigger Fade Out
    setIsAnimating(true);

    // 2. Wait for fade out, then switch data and fade in
    setTimeout(() => {
      setMobilePage((prev) => prev + 1);
      
      // Scroll slightly up if the user is deep down, to keep context
      if (containerRef.current) {
        const offset = containerRef.current.offsetTop - 100;
        if (window.scrollY > offset) {
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
      
      // Short delay to allow DOM update before fading in
      setTimeout(() => setIsAnimating(false), 50);
    }, 200); // 200ms match duration-200 class
  };

  return (
    <div ref={containerRef} className="w-full">
      
      {/* ----------------------------------------------------
        DESKTOP LAYOUT (Hidden on Mobile)
        - Preserves original behavior exactly as requested
        ----------------------------------------------------
      */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16 animate-in fade-in duration-700">
        {channels?.map((channel: any) => (
          <SubmissionCard key={channel.id} channel={channel} />
        ))}
      </div>

      {/* ----------------------------------------------------
        MOBILE LAYOUT (Visible only on Mobile)
        - 2 Columns
        - 10 Items limit
        - QuickFade Animation
        ----------------------------------------------------
      */}
      <div className="md:hidden mt-8">
        
        {/* Animated Grid Container */}
        <div 
          className={`
            grid grid-cols-2 gap-3 
            transition-all duration-200 ease-out 
            ${isAnimating ? 'opacity-0 scale-[0.98] translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
          `}
        >
          {mobileData.map((channel: any) => (
            <div key={channel.id} className="h-full">
              <SubmissionCard channel={channel} />
            </div>
          ))}
        </div>

        {/* Next Button Area */}
        {hasNextPage ? (
          <div className="mt-10 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="group relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all w-3/4 max-w-[200px]"
            >
              <span>Next</span>
              {/* Animated Arrow */}
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isAnimating ? 'translate-x-1 opacity-0' : 'group-hover:translate-x-1'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
              Showing {mobilePage + 1} of {Math.ceil(channels.length / ITEMS_PER_PAGE)}
            </p>
          </div>
        ) : (
          /* End of Feed Message */
          <div className="mt-12 text-center pb-8 opacity-50">
            <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 mx-auto rounded-full mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">End of Stream</p>
          </div>
        )}
      </div>
    </div>
  );
};