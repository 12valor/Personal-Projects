"use client";
import React from 'react';
import Link from 'next/link';

export const SubmissionCard = ({ channel }: { channel: any }) => {
  // 1. PHYSICAL CONTENT CHECK
  // We check if the data actually exists, regardless of what the 'submission_type' column says.
  const hasVideo = !!channel.video_url;
  const hasChannel = !!channel.youtube_url || (!!channel.channel_name && channel.submission_type !== 'video_only');
  
  const uploaderName = channel.profiles?.full_name || "Anonymous";
  const uploaderAvatar = channel.profiles?.avatar_url;
  const commentCount = channel.comments?.[0]?.count || 0;

  // 2. DYNAMIC BADGE LOGIC
  // Logic: Only show COMBO if both physical assets are present.
  let displayType = 'CHANNEL';
  let displayIcon = '📺';

  if (hasVideo && hasChannel) {
    displayType = 'COMBO';
    displayIcon = '📺+🎬';
  } else if (hasVideo) {
    displayType = 'VIDEO';
    displayIcon = '🎬';
  }

  return (
    <Link href={`/channel/${channel.id}`} className="block group h-full">
      <div className="h-full flex flex-col bg-panel border border-border rounded-sm shadow-sm hover:border-ytRed/50 hover:shadow-yt-glow hover:-translate-y-1 transition-all overflow-hidden relative">
        
        {/* Banner/Thumbnail Header */}
        <div className="h-32 w-full bg-gray-900 relative overflow-hidden border-b border-border">
          {hasVideo ? (
            <video 
              src={channel.video_url} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-700"
              muted
              loop
              onMouseOver={e => e.currentTarget.play()}
              onMouseOut={e => e.currentTarget.pause()}
            />
          ) : (
            <div className="w-full h-full bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-20"></div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-1">
             {channel.is_locked && (
               <span className="bg-red-900 text-red-100 text-[9px] font-black uppercase px-2 py-1 rounded border border-red-800 shadow-lg">Locked</span>
             )}
             
             {/* CORRECTED BADGE */}
             <span className="bg-black/80 text-white text-[9px] font-bold uppercase px-2 py-1 rounded backdrop-blur-md flex items-center gap-1 border border-white/10">
                <span>{displayIcon}</span> {displayType}
             </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-border overflow-hidden">
                   <img 
                     src={uploaderAvatar || "https://ui-avatars.com/api/?background=random"} 
                     className="w-full h-full object-cover" 
                     alt="avatar"
                   />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  {uploaderName}
                </span>
             </div>
             <span className="text-[10px] font-mono text-gray-600">
               {new Date(channel.created_at).toLocaleDateString()}
             </span>
          </div>

          <div className="mb-3">
             {displayType !== 'VIDEO' && (
               <div className="flex items-center gap-1 mb-1">
                 <span className="text-xs font-black uppercase text-gray-400 group-hover:text-ytRed transition-colors">
                   {channel.channel_name}
                 </span>
                 {channel.is_verified && <span className="text-[10px] text-ytRed">✓</span>}
               </div>
             )}
             <h3 className="text-lg font-black uppercase tracking-tight text-foreground leading-tight group-hover:text-ytRed transition-colors truncate">
               {(displayType === 'VIDEO') ? channel.video_title : (channel.channel_name || "Untitled")}
             </h3>
          </div>

          <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-6 h-8 italic">
             "{channel.context_text || "No specific feedback requested."}"
          </p>

          <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
             <div className="flex gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-background border border-border px-2 py-1 rounded-full">
                  {hasVideo ? 'Editing' : 'Branding'}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-ytRed bg-ytRed/5 border border-ytRed/20 px-2 py-1 rounded-full flex items-center gap-1">
                  💬 {commentCount}
                </span>
             </div>
             <span className="text-xs font-bold text-gray-300 group-hover:translate-x-1 group-hover:text-foreground transition-all">
               Review →
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
};