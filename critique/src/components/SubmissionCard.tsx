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
      <div className="h-full flex flex-col bg-panel border border-border rounded-lg shadow-sm hover:border-ytRed/40 transition-all duration-300 overflow-visible relative">
        
        {/* --- SECTION 1: THE BRAND BLOCK --- */}
        <div className="relative h-32 w-full bg-neutral-900 rounded-t-lg overflow-hidden border-b border-border">
          {hasVideo ? (
            <video src={channel.video_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
          ) : bannerUrl ? (
            <img src={bannerUrl} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt="Banner" />
          ) : (
            <div className="w-full h-full bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          )}
          <div className="absolute top-3 right-3 z-10">
             <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">{displayIcon} {displayType}</span>
          </div>
        </div>

{/* --- SECTION 1b: OVERLAID YT PFP --- */}
{isChannelLayout && (
  <div className="relative flex justify-center -mt-12 z-20 pointer-events-none">
    <div className="w-24 h-24 rounded-full border-[5px] border-panel bg-panel shadow-lg overflow-hidden flex-shrink-0 aspect-square">
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
        <div className={`px-5 flex items-center justify-between ${isChannelLayout ? 'mt-3' : 'mt-5'}`}>
          <div className="flex items-center gap-2">
            <img src={uploaderAvatar || `https://ui-avatars.com/api/?name=${uploaderName}`} className="w-4 h-4 rounded-full grayscale group-hover:grayscale-0 transition-all border border-border" alt="uploader" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{uploaderName}</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500 uppercase">{new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* --- SECTION 3: TITLE & SUBS --- */}
        <div className="px-5 mt-4 text-center">
          <h3 className={`text-lg font-black uppercase tracking-tight text-foreground leading-none group-hover:text-ytRed transition-colors truncate ${!isChannelLayout && 'text-left'}`}>
            {isChannelLayout ? (channel.channel_name || "Untitled") : channel.video_title}
            {channel.is_verified && <span className="ml-1 text-ytRed text-[14px]">✓</span>}
          </h3>
          {isChannelLayout && subCount && (
            <div className="mt-1 flex items-center justify-center gap-1.5 opacity-50">
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground">{subCount} Subscribers</span>
            </div>
          )}
        </div>

        {/* --- SECTION 4: GOAL --- */}
        <div className={`px-5 mt-4 flex flex-col ${isChannelLayout ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1.5 mb-1 opacity-60">
            <div className="w-1 h-3 bg-ytRed/50 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground">Goal</span>
          </div>
          <p className={`text-xs font-semibold text-gray-400 leading-snug line-clamp-1 italic ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            {channel.goal_text || "General Perspective"}
          </p>
        </div>

        {/* --- SECTION 5: DESCRIPTION --- */}
        <div className="px-5 mt-3 mb-6">
          <p className={`text-[11px] leading-relaxed text-gray-500 font-medium line-clamp-2 h-8 ${isChannelLayout ? 'text-center' : 'text-left'}`}>
            {channel.context_text}
          </p>
        </div>

        {/* --- SECTION 6: ACTION ROW & CATEGORIES --- */}
        <div className="mt-auto p-4 bg-panel/50 border-t border-border flex justify-between items-center rounded-b-lg">
           <div className="flex flex-wrap gap-1 max-w-[70%]">
              {categories.map((cat: string) => (
                <span key={cat} className="text-[8px] font-black uppercase tracking-tighter text-ytRed bg-ytRed/5 border border-ytRed/10 px-2 py-0.5 rounded-sm">
                  {cat}
                </span>
              ))}
              <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 ml-1">💬 {commentCount}</div>
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-ytRed transition-all flex items-center gap-1">
             Critique <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
           </span>
        </div>
      </div>
    </Link>
  );
};