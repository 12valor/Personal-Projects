"use client";
import React from 'react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal = ({ isOpen, onClose }: GuidelinesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 fade-in-0 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Community Guidelines</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed custom-scrollbar">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Be Brutal, Not Toxic</h3>
            <p>Critique is about improvement, not insults. Focus your feedback on the work (the video, the pacing, the audio), not the person. "This pacing is slow" is helpful; "You are boring" is not.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Timestamps are King</h3>
            <p>Vague feedback is useless. Whenever possible, provide specific timestamps (e.g., "At 02:14, the audio cuts out") to help the creator pinpoint the exact issue.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. No Self-Promotion</h3>
            <p>The feedback sections are for giving feedback. Do not paste links to your own channel unless specifically asked for in a "Channel Audit" thread.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Respect Privacy</h3>
            <p>Do not share private information (doxing) or harass creators outside of the platform. We have a zero-tolerance policy for harassment.</p>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
          <button onClick={onClose} className="w-full py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold transition-transform active:scale-[0.98] hover:opacity-90">
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};