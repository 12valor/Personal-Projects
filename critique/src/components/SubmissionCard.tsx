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
  const isLocked = channel.is_locked; // Check locked status

  let displayType = 'CHANNEL';
  let displayIcon = '📺';
  if (hasVideo && hasChannel) { displayType = 'COMBO'; displayIcon = '📺+🎬'; }
  else if (hasVideo) { displayType = 'VIDEO'; displayIcon = '🎬'; }

  const isChannelLayout = displayType === 'CHANNEL' || displayType === 'COMBO';

  return (
    <Link href={`/channel/${channel.id}`} className="block group h-full">
      {/* Container: Add subtle red border if locked */}
      <div className={`h-full flex flex-col bg-white dark:bg-black border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative ${isLocked ? 'border-red-500/20 dark:border-red-900/30' : 'border-slate-200 dark:border-white/10'}`}>
        
        {/* --- SECTION 1: THE BRAND BLOCK --- */}
        <div className="relative h-32 w-full bg-slate-100 dark:bg-neutral-900 overflow-hidden">
          {hasVideo ? (
            <video 
              src={channel.video_url} 
              className={`w-full h-full object-cover transition-opacity ${isLocked ? 'opacity-50 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
              muted loop onMouseOver={e => !isLocked && e.currentTarget.play()} onMouseOut={e => !isLocked && e.currentTarget.pause()} 
            />
          ) : bannerUrl ? (
            <img 
              src={bannerUrl} 
              className={`w-full h-full object-cover transition-transform duration-1000 ${isLocked ? 'opacity-50 grayscale' : 'opacity-90 group-hover:scale-110'}`}
              alt="Banner" 
            />
          ) : (
            <div className="w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]" />
          )}
          
          {/* Top Badges */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
             {/* LOCKED BADGE */}
             {isLocked && (
               <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded border border-red-500 shadow-sm flex items-center gap-1.5">
                 🔒 LOCKED
               </span>
             )}
             
             {/* TYPE BADGE */}
             <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-black dark:text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded border border-black/5 dark:border-white/10 shadow-sm flex items-center gap-1.5">
               {displayIcon} {displayType}
             </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        </div>

        {/* --- SECTION 1b: OVERLAID YT PFP --- */}
        {isChannelLayout && (
          <div className="relative flex justify-center -mt-10 z-20 pointer-events-none">
            <div className="w-20 h-20 rounded-full border-[5px] border-white dark:border-black bg-white dark:bg-black shadow-lg overflow-hidden flex-shrink-0 aspect-square">
               <img 
                 src={channelPfp || `https://ui-avatars.com/api/?name=${channel.channel_name}&background=random`} 
                 className={`w-full h-full object-cover ${isLocked ? 'grayscale' : ''}`}
                 alt="PFP" 
                 loading="lazy"
               />
            </div>
          </div>
        )}

        {/* --- SECTION 2: METADATA ROW --- */}
        <div className={`px-5 flex items-center justify-between ${isChannelLayout ? 'mt-3' : 'mt-5'}`}>
          <div className="flex items-center gap-2">
            <img 
              src={uploaderAvatar || `https://ui-avatars.com/api/?name=${uploaderName}`} 
              className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/20" 
              alt="uploader" 
            />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate max-w-[100px]">{uploaderName}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            {new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* --- SECTION 3: TITLE & SUBS --- */}
        <div className="px-5 mt-3 text-center">
          <h3 className={`text-lg font-black tracking-tight text-black dark:text-white leading-tight transition-colors truncate ${!isChannelLayout && 'text-left'} ${!isLocked && 'group-hover:text-ytRed'}`}>
            {isChannelLayout ? (channel.channel_name || "Untitled") : channel.video_title}
            {channel.is_verified && <span className="ml-1 text-ytRed text-[14px]">✓</span>}
          </h3>
          {isChannelLayout && subCount && (
            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">
                {subCount} Subscribers
              </span>
            </div>
          )}
        </div>

        {/* --- SECTION 4: GOAL --- */}
        <div className={`px-5 mt-4 mb-2 flex flex-col ${isChannelLayout ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1.5 mb-1 opacity-90">
            <div className={`w-1 h-3 rounded-full ${isLocked ? 'bg-gray-400' : 'bg-ytRed'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isLocked ? 'text-gray-400' : 'text-ytRed'}`}>Goal</span>
          </div>
          <p className={`text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug line-clamp-1 italic ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            "{channel.goal_text || "General Perspective"}"
          </p>
        </div>

        {/* --- SECTION 5: CATEGORIES --- */}
        <div className="mt-auto px-5 pb-5 pt-2">
            <div className={`flex flex-wrap gap-1.5 ${isChannelLayout ? 'justify-center' : 'justify-start'}`}>
              {categories.slice(0, 3).map((cat: string) => (
                <span key={cat} className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 px-2 py-1 rounded">
                  {cat}
                </span>
              ))}
              {categories.length > 3 && (
                 <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 px-1 py-1">+{categories.length - 3}</span>
              )}
            </div>
        </div>

        {/* --- FOOTER: COMMENTS & ACTION --- */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {commentCount}
           </div>
           {/* ACTION TEXT */}
           {isLocked ? (
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
               Locked
             </span>
           ) : (
             <span className="text-[10px] font-black uppercase tracking-widest text-ytRed group-hover:translate-x-1 transition-transform">
               Audit →
             </span>
           )}
        </div>
      </div>
    </Link>
  );
};