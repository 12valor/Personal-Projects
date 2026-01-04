"use client";
import React, { useState, useEffect } from 'react';
import { SubmitModal } from './SubmitModal';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Toggle Logic
  useEffect(() => {
    // Check if user previously preferred light
    if (localStorage.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <>
      <nav className="h-16 border-b border-border flex items-center justify-between px-8 bg-background sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* YouTube-Style Play Logo */}
          <div className="w-8 h-6 bg-ytRed rounded-lg flex items-center justify-center shadow-yt-glow">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic">Critique.</span>
        </div>
        
        <div className="flex gap-6 items-center">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-panel border border-transparent hover:border-border transition-all"
          >
            {isDark ? (
              <span className="text-lg">☀</span> // Sun icon for dark mode
            ) : (
              <span className="text-lg">☾</span> // Moon icon for light mode
            )}
          </button>

          <button className="text-xs font-bold text-gray-500 hover:text-ytRed transition-colors tracking-widest uppercase hidden md:block">
            Browse
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background text-xs font-black px-5 py-3 shadow-tactile active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest hover:bg-ytRed hover:text-white hover:shadow-yt-glow"
          >
            Post Channel
          </button>
        </div>
      </nav>
      <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};