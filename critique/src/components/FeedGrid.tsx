"use client";

import React, { useState, useRef, useMemo } from "react";
import { SubmissionCard } from "@/components/SubmissionCard";

interface FeedGridProps {
  channels: any[];
}

export const FeedGrid = ({ channels }: FeedGridProps) => {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Mobile Pagination State
  const [mobilePage, setMobilePage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 10;

  // --- 1. EXTRACT TAGS ---
  // Get unique tags sorted by usage frequency
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    channels.forEach((item) => {
      item.problem_categories?.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count desc
      .map(([tag]) => tag);
  }, [channels]);

  // --- 2. FILTERING LOGIC ---
  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      // A. Tag Filter (Intersection: Card must have AT LEAST ONE of the selected tags)
      // If no tags selected, pass this check.
      const hasSelectedTag =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => channel.problem_categories?.includes(tag));

      // B. Search Filter (Matches Title OR Tag name)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        channel.channel_name?.toLowerCase().includes(query) ||
        channel.video_title?.toLowerCase().includes(query) ||
        channel.problem_categories?.some((cat: string) => cat.toLowerCase().includes(query));

      return hasSelectedTag && matchesSearch;
    });
  }, [channels, selectedTags, searchQuery]);

  // --- 3. MOBILE PAGINATION DATA ---
  // Apply pagination to the FILTERED results
  const mobileData = filteredChannels.slice(
    mobilePage * ITEMS_PER_PAGE,
    (mobilePage + 1) * ITEMS_PER_PAGE
  );

  const hasNextPage = (mobilePage + 1) * ITEMS_PER_PAGE < filteredChannels.length;

  // --- HANDLERS ---
  
  const toggleTag = (tag: string) => {
    setMobilePage(0); // Reset pagination on filter change
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setMobilePage(0);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMobilePage((prev) => prev + 1);
      if (containerRef.current) {
        const offset = containerRef.current.offsetTop - 120;
        if (window.scrollY > offset) {
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  };

  return (
    <div ref={containerRef} className="w-full">
      
      {/* --- FILTER UI SECTION --- */}
      <div className="mb-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input 
            type="text"
            placeholder="Search tags or keywords..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setMobilePage(0); }}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:border-ytRed/50 focus:ring-1 focus:ring-ytRed/50 transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-ytRed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Tag Cloud (Horizontal Scroll) */}
        <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-2 no-scrollbar mask-gradient-right">
          {/* Clear Button (Only if tags selected) */}
          {selectedTags.length > 0 && (
            <button 
              onClick={() => setSelectedTags([])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all mr-2 flex-shrink-0"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              Clear
            </button>
          )}

          {allTags.map(tag => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-all flex-shrink-0
                  ${isActive 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent shadow-md transform scale-105' 
                    : 'bg-white dark:bg-[#111] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {filteredChannels.length > 0 ? (
        <>
          {/* DESKTOP LAYOUT */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {filteredChannels.map((channel: any) => (
              <SubmissionCard key={channel.id} channel={channel} />
            ))}
          </div>

          {/* MOBILE LAYOUT (With Pagination & Animation) */}
          <div className="md:hidden">
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

            {/* Pagination Controls */}
            {hasNextPage ? (
              <div className="mt-10 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="group relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all w-3/4 max-w-[200px]"
                >
                  <span>Next</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isAnimating ? 'translate-x-1 opacity-0' : 'group-hover:translate-x-1'}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </button>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                  Showing {Math.min((mobilePage + 1) * ITEMS_PER_PAGE, filteredChannels.length)} of {filteredChannels.length}
                </p>
              </div>
            ) : (
              <div className="mt-12 text-center pb-8 opacity-50">
                <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 mx-auto rounded-full mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">End of List</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl bg-slate-50/50 dark:bg-white/[0.02]">
           <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
           <h3 className="text-lg font-black uppercase text-slate-400 dark:text-slate-500 mb-2">No Matches Found</h3>
           <p className="text-sm text-slate-400 max-w-xs text-center mb-6">We couldn't find any threads matching your filters.</p>
           <button 
             onClick={clearFilters}
             className="text-xs font-bold uppercase tracking-widest text-ytRed hover:text-red-600 underline underline-offset-4"
           >
             Clear all filters
           </button>
        </div>
      )}
    </div>
  );
};