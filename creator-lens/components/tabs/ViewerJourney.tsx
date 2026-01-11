"use client";
import { useMemo } from "react";

export default function ViewerJourney({ relatedVideos, loyalty }: { relatedVideos: any[], loyalty: any[] }) {
  
  // 1. Process Traffic Sources (Videos sending you views)
  const sources = useMemo(() => {
    if (!relatedVideos) return [];
    return relatedVideos.slice(0, 3).map(v => ({
      name: v[0] || "Unknown Video",
      views: v[1]
    }));
  }, [relatedVideos]);

  // 2. Process Stickiness (Returning vs New)
  const stickiness = useMemo(() => {
    if (!loyalty) return { score: 0, label: "Unknown" };
    
    // API returns [["SUBSCRIBED", views], ["UNSUBSCRIBED", views]]
    const subRow = loyalty.find(r => r[0] === "SUBSCRIBED");
    const unsubRow = loyalty.find(r => r[0] === "UNSUBSCRIBED");
    
    const subViews = subRow ? subRow[1] : 0;
    const totalViews = (subViews) + (unsubRow ? unsubRow[1] : 0);
    
    // Retention Rate = (Sub Views / Total Views) * 100
    // This is a proxy for how well you convert traffic into loyal watchers
    const rate = totalViews > 0 ? (subViews / totalViews) * 100 : 0;
    
    return {
      score: rate.toFixed(1),
      label: rate > 15 ? "High Stickiness" : rate > 5 ? "Moderate" : "Low Retention"
    };
  }, [loyalty]);

  if (!relatedVideos) return <div className="p-8 text-center text-gray-400">Loading Journey Data...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Viewer Journey Mapper</h2>
      <p className="text-gray-500">How viewers enter your channel and their likelihood to stay.</p>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 relative overflow-hidden">
        {/* Flow Visualization */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* STEP 1: REAL ENTRY POINTS */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="text-center mb-4">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Sources (Related Video)</span>
            </div>
            {sources.length === 0 ? (
              <div className="text-xs text-gray-400 text-center italic">No related video traffic detected.</div>
            ) : sources.map((v, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-700 truncate shadow-sm">
                📺 {v.name}
                <span className="block text-gray-400 text-[10px] mt-1">{v.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>

          {/* ARROW */}
          <div className="hidden md:block text-gray-300 text-4xl">➜</div>

          {/* STEP 2: YOUR CHANNEL HUB */}
          <div className="w-full md:w-1/3 text-center">
            <div className="bg-black text-white p-6 rounded-2xl shadow-xl transform scale-110">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-bold text-lg">Your Content</h3>
              <p className="text-xs text-gray-400 mt-1">Traffic Processor</p>
            </div>
          </div>

          {/* ARROW */}
          <div className="hidden md:block text-gray-300 text-4xl">➜</div>

          {/* STEP 3: REAL RETENTION SCORE */}
          <div className="w-full md:w-1/3 space-y-4">
             <div className="text-center mb-4">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Outcome (Loyalty)</span>
            </div>
             
             <div className={`p-4 rounded-xl border text-center ${
               Number(stickiness.score) > 10 ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-200 text-blue-800"
             }`}>
               <p className="text-3xl font-black">{stickiness.score}%</p>
               <p className="text-xs font-bold uppercase mt-1">Return Rate</p>
               <p className="text-[10px] opacity-70 mt-1">({stickiness.label})</p>
             </div>

             <p className="text-[10px] text-gray-400 text-center px-4">
               *Percentage of total views coming from subscribed users.
             </p>
          </div>

        </div>

        {/* Decorative Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-0 hidden md:block"></div>
      </div>
    </div>
  );
}