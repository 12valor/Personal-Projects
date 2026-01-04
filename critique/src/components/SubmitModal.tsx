"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';

// Helper: Extract handle from URL to get the REAL profile pic
// Example: "youtube.com/@MrBeast" -> "MrBeast"
const getAvatarFromUrl = (url: string) => {
  try {
    // Regex looks for the "@" symbol followed by text
    const handleMatch = url.match(/@([\w.-]+)/);
    const handle = handleMatch ? handleMatch[1] : null;
    
    // This URL returns the ACTUAL YouTube profile picture
    return handle ? `https://unavatar.io/youtube/${handle}` : null;
  } catch (e) {
    return null;
  }
};

export const SubmitModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ url: '', goal: '', name: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Get the REAL avatar URL
    const realAvatarUrl = getAvatarFromUrl(formData.url) || 
      `https://ui-avatars.com/api/?name=${formData.name}&background=random`; // Fallback only if regex fails

    const { error } = await supabase
      .from('submissions')
      .insert([
        { 
          youtube_url: formData.url, 
          goal_text: formData.goal,
          channel_name: formData.name,
          avatar_url: realAvatarUrl // <--- Saving the real image link
        }
      ]);

    if (!error) {
      onClose();
      window.location.reload(); 
    } else {
      alert("Error submitting. Please check your connection.");
    }
    setLoading(false);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-panel border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-8 border-b border-border bg-panel">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground italic">
              Submit Channel
            </h2>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">
              Get Brutal Feedback
            </p>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 px-3 py-1.5 border border-transparent hover:border-border hover:bg-background transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ytRed">Esc</span>
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="absolute w-4 h-0.5 bg-foreground rotate-45 group-hover:bg-ytRed transition-colors"></span>
              <span className="absolute w-4 h-0.5 bg-foreground -rotate-45 group-hover:bg-ytRed transition-colors"></span>
            </div>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-panel">
          <div className="space-y-2 group">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-ytRed transition-colors">
              Channel Name
            </label>
            <input 
              required
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. MrBeast"
              className="w-full bg-background border border-border p-4 text-sm font-bold text-foreground placeholder:text-gray-700 focus:border-ytRed focus:outline-none focus:shadow-[inset_0_0_0_1px_var(--ytRed)] transition-all"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-ytRed transition-colors">
              Channel URL
            </label>
            <input 
              required
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://youtube.com/@handle"
              className="w-full bg-background border border-border p-4 text-sm font-bold text-foreground placeholder:text-gray-700 focus:border-ytRed focus:outline-none focus:shadow-[inset_0_0_0_1px_var(--ytRed)] transition-all"
            />
          </div>

          <div className="space-y-2 group">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-ytRed transition-colors">
                What needs fixing?
              </label>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Max 140 chars</span>
            </div>
            <textarea 
              required
              rows={3}
              maxLength={140}
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              placeholder="e.g. My CTR is low on gaming videos..."
              className="w-full bg-background border border-border p-4 text-sm font-medium text-foreground placeholder:text-gray-700 focus:border-ytRed focus:outline-none focus:shadow-[inset_0_0_0_1px_var(--ytRed)] transition-all resize-none"
            />
          </div>
          
          <div className="pt-2">
            <button 
              disabled={loading}
              className="w-full bg-ytRed text-white font-black py-4 shadow-tactile hover:shadow-yt-glow hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3"
            >
              {loading ? 'Fetching Avatar...' : 'Submit Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};