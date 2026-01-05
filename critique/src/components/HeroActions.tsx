"use client";
import Link from 'next/link';

export function HeroActions() {
  return (
    <div className="flex flex-row items-center">
      {/* Critique Me Button Removed per instructions */}
      <Link 
        href="#feed-section" 
        className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-3 group"
      >
        Browse Retention Feed 
        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
      </Link>
    </div>
  );
}