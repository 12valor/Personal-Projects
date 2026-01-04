"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const SubmitModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ url: '', goal: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('submissions')
      .insert([
        { 
          youtube_url: formData.url, 
          goal_text: formData.goal,
          channel_name: formData.name // You can eventually pull this via YouTube API
        }
      ]);

    if (!error) {
      alert("Submission Live.");
      onClose();
      window.location.reload(); // Refresh to show in the grid
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div className="bg-panel border-2 border-border w-full max-w-lg shadow-[0_20px_0_0_#000]">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           {/* CHANNEL NAME INPUT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Channel Name</label>
            <input 
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-background border border-border p-4 text-sm font-bold focus:border-white outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* URL INPUT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">YouTube URL</label>
            <input 
              required
              type="url"
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="youtube.com/@handle"
              className="w-full bg-background border border-border p-4 text-sm font-bold focus:border-white outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* GOAL TEXTAREA */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Focus Area</label>
            <textarea 
              required
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              placeholder="e.g. Help with retention"
              className="w-full bg-background border border-border p-4 text-sm font-bold focus:border-white outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] resize-none"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 shadow-tactile active:translate-y-1 active:shadow-none transition-all uppercase tracking-[0.3em] text-xs"
          >
            {loading ? 'Processing...' : 'Confirm Submission'}
          </button>
        </form>
      </div>
    </div>
  );
};