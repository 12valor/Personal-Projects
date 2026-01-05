"use client";
import React from 'react';
import Link from 'next/link';

export const SubmissionCard = ({ channel }: { channel: any }) => {
  const hasVideo = !!channel.video_url;
  const hasChannel = !!channel.youtube_url || (!!channel.channel_name && channel.submission_type !== 'video_only');
  const bannerUrl = channel.banner_url;
  const uploaderName = channel.profiles?.full_name || "Anonymous";
  const uploaderAvatar = channel.profiles?.avatar_url;
  const channelPfp = channel.avatar_url; 
  const commentCount = channel.comments?.[0]?.count || 0;
  const categories = channel.problem_categories || [];
  const subCount = channel.subscriber_count;

  let displayType = 'CHANNEL';
  let displayIcon = '📺';
  if (hasVideo && hasChannel) { displayType = 'COMBO'; displayIcon = '📺+🎬'; }
  else if (hasVideo) { displayType = 'VIDEO'; displayIcon = '🎬'; }

  const isChannelLayout = displayType === 'CHANNEL' || displayType === 'COMBO';

  return (
    <Link href={`/channel/${channel.id}`} className="block group h-full">
      {/* Container: Replaced heavy border with soft shadow and thin glass border */}
      <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_-15px_rgba(204,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-visible relative">
        
        {/* --- SECTION 1: THE BRAND BLOCK --- */}
        <div className="relative h-32 w-full bg-slate-100 dark:bg-neutral-900 rounded-t-2xl overflow-hidden">
          {hasVideo ? (
            <video 
              src={channel.video_url} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} 
            />
          ) : bannerUrl ? (
            <img 
              src={bannerUrl} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000" 
              alt="Banner" 
            />
          ) : (
            <div className="w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px]" />
          )}
          
          {/* Overlay Tag: Cleaned up typography */}
          <div className="absolute top-3 right-3 z-10">
             <span className="bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border border-white/20 shadow-sm flex items-center gap-1.5">
               {displayIcon} {displayType}
             </span>
          </div>
          {/* Subtle Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        </div>

        {/* --- SECTION 1b: OVERLAID YT PFP --- */}
        {isChannelLayout && (
          <div className="relative flex justify-center -mt-12 z-20 pointer-events-none">
            <div className="w-24 h-24 rounded-full border-[6px] border-white dark:border-[#0a0a0a] bg-white dark:bg-[#0a0a0a] shadow-xl overflow-hidden flex-shrink-0 aspect-square transition-transform duration-500 group-hover:scale-105">
               <img 
                 src={channelPfp || `https://ui-avatars.com/api/?name=${channel.channel_name}&background=random`} 
                 className="w-full h-full object-cover rounded-full block" 
                 alt="YouTube PFP" 
                 loading="lazy"
               />
            </div>
          </div>
        )}

        {/* --- SECTION 2: METADATA ROW (Uploader) --- */}
        <div className={`px-5 flex items-center justify-between ${isChannelLayout ? 'mt-4' : 'mt-6'}`}>
          <div className="flex items-center gap-2">
            <img 
              src={uploaderAvatar || `https://ui-avatars.com/api/?name=${uploaderName}`} 
              className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/10" 
              alt="uploader" 
            />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{uploaderName}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            {new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* --- SECTION 3: TITLE & SUBS --- */}
        <div className="px-5 mt-4 text-center">
          <h3 className={`text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-ytRed transition-colors truncate ${!isChannelLayout && 'text-left'}`}>
            {isChannelLayout ? (channel.channel_name || "Untitled") : channel.video_title}
            {channel.is_verified && <span className="ml-1 text-ytRed text-[14px]">✓</span>}
          </h3>
          {isChannelLayout && subCount && (
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                {subCount} Subscribers
              </span>
            </div>
          )}
        </div>

        {/* --- SECTION 4: GOAL --- */}
        <div className={`px-5 mt-5 flex flex-col ${isChannelLayout ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1.5 mb-1 opacity-80">
            <div className="w-1 h-3 bg-ytRed rounded-full shadow-[0_0_8px_rgba(204,0,0,0.4)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ytRed">Goal</span>
          </div>
          <p className={`text-xs font-semibold text-slate-600 dark:text-slate-400 leading-snug line-clamp-1 italic ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            "{channel.goal_text || "General Perspective"}"
          </p>
        </div>

        {/* --- SECTION 5: DESCRIPTION --- */}
        <div className="px-5 mt-3 mb-6">
          <p className={`text-[11px] leading-relaxed text-slate-500 dark:text-slate-500 font-medium line-clamp-2 h-8 ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            {channel.context_text}
          </p>
        </div>

        {/* --- SECTION 6: ACTION ROW & CATEGORIES --- */}
        <div className="mt-auto p-5 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex justify-between items-center rounded-b-2xl">
           <div className="flex flex-wrap gap-1.5 max-w-[70%]">
              {categories.slice(0, 2).map((cat: string) => (
                <span key={cat} className="text-[8px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-md">
                  {cat}
                </span>
              ))}
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 ml-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount}
              </div>
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-ytRed transition-all flex items-center gap-1 group-hover:gap-2">
             AUDIT <span className="transition-transform duration-300">→</span>
           </span>
        </div>
      </div>
    </Link>
  );
};