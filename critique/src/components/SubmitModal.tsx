"use client";
import React from 'react';

export const SubmitModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      {/* 3D Form Panel */}
      <div className="bg-panel border-2 border-border w-full max-w-lg shadow-[0_20px_0_0_#000] relative">
        <div className="flex justify-between items-center p-6 border-b border-border bg-background">
          <h2 className="font-black uppercase tracking-tighter text-xl text-white">Post your channel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white font-black">ESC [X]</button>
        </div>
        
        <form className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Channel URL</label>
            <input 
              type="text" 
              placeholder="youtube.com/@handle"
              className="w-full bg-background border border-border p-4 text-sm font-bold focus:outline-none focus:border-white transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">What needs fixing?</label>
            <textarea 
              rows={4}
              placeholder="Be specific. e.g., 'My retention drops at 1:00...'"
              className="w-full bg-background border border-border p-4 text-sm font-bold focus:outline-none focus:border-white transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] resize-none"
            />
          </div>
          
          <button className="w-full bg-white text-black font-black py-5 shadow-tactile active:translate-y-1 active:shadow-none transition-all uppercase tracking-[0.3em] text-xs">
            Confirm Submission
          </button>
        </form>
      </div>
    </div>
  );
};