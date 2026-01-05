"use client";
import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl flex flex-col animate-in zoom-in-95 fade-in-0 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Support & Help</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Quickest Support</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Join our Discord server for real-time help from moderators and the community.</p>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-[#5865F2] px-4 py-2 rounded-lg hover:bg-[#4752C4] transition-colors">
              Join Discord
            </a>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">For account issues, billing, or formal complaints.</p>
            <a href="mailto:support@critique.app" className="text-sm font-semibold text-slate-900 dark:text-white underline hover:text-[#FF0032] transition-colors">
              support@critique.app
            </a>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
          <button onClick={onClose} className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};