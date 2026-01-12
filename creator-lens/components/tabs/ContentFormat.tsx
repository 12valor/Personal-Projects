"use client";

import { useMemo } from "react";
import { Clapperboard, Smartphone, Radio } from "lucide-react";

export default function ContentFormat({ videos }: { videos: any[] }) {
  
  // 1. IMPROVED PARSER: Handles "PT1M" correctly and avoids NaN errors
  const parseDuration = (iso: string) => {
    if (!iso) return 0;
    // Match individual parts safely
    const hours = iso.match(/(\d+)H/);
    const minutes = iso.match(/(\d+)M/);
    const seconds = iso.match(/(\d+)S/);

    const h = parseInt(hours?.[1] || "0");
    const m = parseInt(minutes?.[1] || "0");
    const s = parseInt(seconds?.[1] || "0");

    return (h * 3600) + (m * 60) + s;
  };

  // 2. LOGIC: Added 90s buffer and fallback for 0s videos
  const formats = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    const stats = {
      long: { count: 0, views: 0 },
      shorts: { count: 0, views: 0 },
      live: { count: 0, views: 0 },
    };

    videos.forEach((video) => {
      // Robust View Parsing
      const views = parseInt(video.views || video.statistics?.viewCount || "0");
      
      // Robust Duration Parsing
      const durationIso = video.duration || video.contentDetails?.duration || "PT0S";
      const seconds = parseDuration(durationIso);

      // Check for Live
      const isLive = 
        video.liveStreamingDetails || 
        video.snippet?.liveBroadcastContent === 'live' ||
        video.snippet?.liveBroadcastContent === 'upcoming'; 

      if (isLive) {
        stats.live.count++;
        stats.live.views += views;
      } 
      // FIX: Increase limit to 90s to catch "1:01" bugs
      // FIX: Allow 0s videos to default to Shorts (likely metadata lag on new uploads)
      else if (seconds <= 90) { 
        stats.shorts.count++;
        stats.shorts.views += views;
      } 
      else {
        stats.long.count++;
        stats.long.views += views;
      }
    });

    const getAvg = (cat: { count: number, views: number }) => 
      cat.count > 0 ? Math.round(cat.views / cat.count) : 0;

    return [
      { 
        name: "Shorts", // Moved Shorts to first position since that's your focus
        icon: Smartphone,
        views: getAvg(stats.shorts), 
        count: stats.shorts.count,
        color: "bg-rose-100 text-rose-700",
        border: "border-rose-100"
      },
      { 
        name: "Long-Form", 
        icon: Clapperboard,
        views: getAvg(stats.long), 
        count: stats.long.count,
        color: "bg-purple-100 text-purple-700",
        border: "border-purple-100"
      },
      { 
        name: "Live Streams", 
        icon: Radio,
        views: getAvg(stats.live), 
        count: stats.live.count,
        color: "bg-orange-100 text-orange-700",
        border: "border-orange-100"
      },
    ];
  }, [videos]);

  if (!videos.length) return <div className="p-6 text-center text-gray-400">Loading Format Data...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-gray-900">Format Performance</h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Based on last {videos.length} uploads
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formats.map((fmt, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${fmt.border} flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
            
            {/* Background Icon Decoration */}
            <fmt.icon className={`absolute -right-4 -bottom-4 text-gray-50 opacity-10 w-32 h-32 rotate-12`} />

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${fmt.color} mb-3 flex items-center gap-2 relative z-10`}>
              <fmt.icon size={12} />
              {fmt.name}
              <span className="bg-white/60 px-1.5 rounded-full text-[10px] text-current">
                {fmt.count}
              </span>
            </span>
            
            <div className="relative z-10">
              {fmt.count > 0 ? (
                <>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">{fmt.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Avg Views per Upload</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-300">--</p>
                  <p className="text-xs text-gray-400 mt-1">No uploads found</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}