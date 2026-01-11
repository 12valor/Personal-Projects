"use client";
import { useMemo } from "react";

export default function AlgorithmTrust({ videos }: { videos: any[] }) {
  
  const scoreData = useMemo(() => {
    if (!videos || videos.length < 5) return null;

    // 1. Calculate Consistency (Standard Deviation of Upload gaps)
    const dates = videos.map(v => new Date(v.publishedAt).getTime());
    const gaps = [];
    for (let i = 0; i < dates.length - 1; i++) {
      gaps.push(Math.abs(dates[i] - dates[i+1]) / (1000 * 3600 * 24)); // Days
    }
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    // Lower deviation = Higher consistency score
    const consistencyScore = avgGap < 7 ? 95 : avgGap < 14 ? 80 : 50;

    // 2. Performance Stability (Are views crashing?)
    const views = videos.slice(0, 5).map(v => parseInt(v.views));
    const recentAvg = views.slice(0, 2).reduce((a,b)=>a+b,0) / 2;
    const olderAvg = views.slice(2, 5).reduce((a,b)=>a+b,0) / 3;
    const stabilityScore = recentAvg >= olderAvg ? 100 : 70;

    // 3. Engagement Health
    const likes = videos.slice(0, 5).reduce((acc, v) => acc + parseInt(v.likes), 0);
    const totalViews = videos.slice(0, 5).reduce((acc, v) => acc + parseInt(v.views), 0);
    const engRate = (likes / totalViews) * 100;
    const engScore = engRate > 4 ? 100 : engRate > 2 ? 80 : 60;

    const finalScore = Math.round((consistencyScore * 0.3) + (stabilityScore * 0.4) + (engScore * 0.3));

    let status = "At Risk";
    if (finalScore > 85) status = "Trusted";
    else if (finalScore > 65) status = "Stable";

    return { finalScore, status, consistencyScore, stabilityScore, engScore };
  }, [videos]);

  if (!scoreData) return <div className="p-8 text-center text-gray-400">Not enough data for Trust Score.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Algorithm Trust Score</h2>
      <p className="text-gray-500">How "safe" your channel looks to the recommendation engine.</p>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3">
             <span className="text-5xl font-black text-gray-900">{scoreData.finalScore}</span>
             <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
               scoreData.status === "Trusted" ? "bg-green-50 text-green-700 border-green-200" : 
               scoreData.status === "Stable" ? "bg-blue-50 text-blue-700 border-blue-200" : 
               "bg-red-50 text-red-700 border-red-200"
             }`}>
               {scoreData.status}
             </span>
           </div>
           <p className="text-sm text-gray-500 mt-2">
             {scoreData.status === "Trusted" 
               ? "The algorithm likely prioritizes your content due to high consistency." 
               : "Inconsistent uploads or view drops may be throttling impressions."}
           </p>
        </div>

        <div className="flex gap-4">
          {[
            { label: "Consistency", val: scoreData.consistencyScore },
            { label: "Stability", val: scoreData.stabilityScore },
            { label: "Engagement", val: scoreData.engScore },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="w-16 h-1 bg-gray-100 rounded-full mb-2 overflow-hidden mx-auto">
                <div className="h-full bg-black rounded-full" style={{ width: `${m.val}%` }}></div>
              </div>
              <p className="text-xs font-bold text-gray-900">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}