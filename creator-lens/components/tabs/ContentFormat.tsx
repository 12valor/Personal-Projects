"use client";

import { useMemo } from "react";

export default function ContentFormat({ videos }: { videos: any[] }) {
  
  // 1. Helper: Parse ISO 8601 Duration (e.g., "PT1H2M10S" -> Seconds)
  const parseDuration = (iso: string) => {
    if (!iso) return 0;
    const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const hours = (parseInt(match[1] || "0")) * 3600;
    const minutes = (parseInt(match[2] || "0")) * 60;
    const seconds = parseInt(match[3] || "0");
    return hours + minutes + seconds;
  };

  // 2. Real-Time Categorization Logic
  const formats = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    const stats = {
      long: { count: 0, views: 0 },
      shorts: { count: 0, views: 0 },
      live: { count: 0, views: 0 },
    };

    videos.forEach((video) => {
      // Handle different API structures (flat vs nested)
      const views = parseInt(video.views || video.statistics?.viewCount || "0");
      const durationIso = video.duration || video.contentDetails?.duration || "PT0S";
      const isLive = video.liveStreamingDetails || video.snippet?.liveBroadcastContent === 'completed'; // Detect past streams
      
      const seconds = parseDuration(durationIso);

      if (isLive) {
        // Live Stream (Past or Present)
        stats.live.count++;
        stats.live.views += views;
      } else if (seconds > 0 && seconds <= 60) {
        // Shorts (<= 60 seconds)
        stats.shorts.count++;
        stats.shorts.views += views;
      } else {
        // Long-Form (> 60 seconds)
        stats.long.count++;
        stats.long.views += views;
      }
    });

    // Helper to calculate average (avoid NaN)
    const getAvg = (cat: { count: number, views: number }) => 
      cat.count > 0 ? Math.round(cat.views / cat.count) : 0;

    return [
      { 
        name: "Long-Form", 
        views: getAvg(stats.long), 
        count: stats.long.count,
        color: "bg-purple-100 text-purple-700" 
      },
      { 
        name: "Shorts", 
        views: getAvg(stats.shorts), 
        count: stats.shorts.count,
        color: "bg-red-100 text-red-700" 
      },
      { 
        name: "Live Streams", 
        views: getAvg(stats.live), 
        count: stats.live.count,
        color: "bg-orange-100 text-orange-700" 
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
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${fmt.color} mb-3 flex items-center gap-2`}>
              {fmt.name}
              <span className="bg-white/50 px-1.5 rounded-full text-[10px] text-current">
                {fmt.count}
              </span>
            </span>
            
            {fmt.count > 0 ? (
              <>
                <p className="text-3xl font-black text-gray-900">{fmt.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Avg Views per Upload</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-300">--</p>
                <p className="text-xs text-gray-400 mt-1">No uploads found</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}