"use client";
import React, { useState } from 'react';
import { SubmitModal } from './SubmitModal';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="h-14 border-b border-border flex items-center justify-between px-6 bg-background sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rotate-45 shadow-tactile"></div>
          <span className="font-bold tracking-tighter text-lg ml-2 uppercase">Critique.</span>
        </div>
        <div className="flex gap-6 items-center">
          <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors tracking-widest uppercase">Browse</button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black text-[10px] font-black px-4 py-2 shadow-tactile active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest"
          >
            Post Channel
          </button>
        </div>
      </nav>
      <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};