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
  const isLocked = channel.is_locked;

  let displayType = 'CHANNEL';
  let displayIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  if (hasVideo && hasChannel) { 
    displayType = 'COMBO'; 
    displayIcon = (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  } else if (hasVideo) { 
    displayType = 'VIDEO'; 
    displayIcon = (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1V5a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    );
  }

  const isChannelLayout = displayType === 'CHANNEL' || displayType === 'COMBO';

  return (
    <Link href={`/channel/${channel.id}`} className="block group h-full">
      <div className={`h-full flex flex-col bg-white dark:bg-[#0A0A0A] border rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative ${isLocked ? 'border-red-500/20 opacity-95' : 'border-slate-200 dark:border-white/5'}`}>
        
        {/* --- SECTION 1: VISUAL BLOCK --- */}
        <div className="relative h-32 w-full bg-slate-100 dark:bg-neutral-900 overflow-hidden">
          {hasVideo ? (
            <video 
              src={channel.video_url} 
              className={`w-full h-full object-cover transition-all duration-700 ${isLocked ? 'grayscale opacity-60' : 'group-hover:scale-105'}`}
              muted loop onMouseOver={e => !isLocked && e.currentTarget.play()} onMouseOut={e => !isLocked && e.currentTarget.pause()} 
            />
          ) : bannerUrl ? (
            <img src={bannerUrl} className={`w-full h-full object-cover transition-transform duration-1000 ${isLocked ? 'grayscale opacity-60' : 'group-hover:scale-110'}`} alt="Banner" />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-neutral-800 opacity-20" />
          )}
          
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
             {isLocked ? (
               <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                 <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>
                 Locked
               </span>
             ) : (
               <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-black dark:text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-black/5 dark:border-white/10 shadow-sm flex items-center gap-1.5">
                 {displayIcon} {displayType}
               </span>
             )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* --- SECTION 1b: PFP --- */}
        {isChannelLayout && (
          <div className="relative flex justify-center -mt-10 z-20">
            <div className="w-20 h-20 rounded-full border-[6px] border-white dark:border-[#0A0A0A] bg-white dark:bg-black shadow-xl overflow-hidden aspect-square">
               <img 
                 src={channelPfp || `https://ui-avatars.com/api/?name=${channel.channel_name}&background=random`} 
                 className={`w-full h-full object-cover ${isLocked ? 'grayscale opacity-80' : ''}`}
                 alt="PFP" 
               />
            </div>
          </div>
        )}

        {/* --- SECTION 2: ORGANIZED TEXT LAYOUT --- */}
        <div className="flex flex-col flex-grow px-5">
          
          <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden border border-white/10">
                <img src={uploaderAvatar || `https://ui-avatars.com/api/?name=${uploaderName}`} alt="u" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider truncate max-w-[90px]">{uploaderName}</span>
            </div>
            <span className="text-[9px] font-medium text-slate-400 dark:text-neutral-600 tracking-tighter">
              {new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className={`pt-4 ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] group-hover:text-ytRed transition-colors duration-300">
              {isChannelLayout ? (channel.channel_name || "Untitled") : channel.video_title}
              {channel.is_verified && <span className="ml-1 text-ytRed">●</span>}
            </h3>
            
            {isChannelLayout && subCount && (
              <p className="mt-1 text-[10px] font-bold text-ytRed uppercase tracking-[0.15em] opacity-80">
                {subCount} Subscribers
              </p>
            )}
          </div>

          <div className={`my-4 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            <span className="block text-[8px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Audit Objective</span>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-2">
              "{channel.goal_text || "General Perspective"}"
            </p>
          </div>

          {/* --- RED TAGS --- */}
          <div className={`mt-auto pb-5 flex flex-wrap gap-1.5 ${isChannelLayout ? 'justify-center' : 'justify-start'}`}>
            {categories.slice(0, 3).map((cat: string) => (
              <span key={cat} className="text-[9px] font-extrabold uppercase tracking-tight text-white bg-red-600/90 dark:bg-red-700/80 px-2 py-0.5 rounded-md shadow-sm">
                #{cat.replace(/\s+/g, '')}
              </span>
            ))}
            {categories.length > 3 && (
               <span className="text-[9px] font-bold text-slate-300 dark:text-neutral-700">+{categories.length - 3}</span>
            )}
          </div>
        </div>

        {/* --- FOOTER: IMPROVED COMMENTS VISIBILITY --- */}
        <div className="px-5 py-4 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex justify-between items-center group/footer">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 dark:text-white transition-colors">
                <svg className="w-4 h-4 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                </svg>
                {commentCount}
              </div>
           </div>

           {isLocked ? (
             <div className="flex items-center gap-1.5 text-slate-400">
               <span className="text-[10px] font-black uppercase tracking-tighter">Read Only</span>
             </div>
           ) : (
             <div className="flex items-center gap-1 text-ytRed font-black text-[10px] uppercase tracking-widest transition-all">
               <span className="group-hover/footer:mr-1 transition-all duration-300">Open Report</span>
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
};