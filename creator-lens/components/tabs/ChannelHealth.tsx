"use client";
import { useMemo } from "react";

export default function ChannelHealth({ stats, videos }: { stats: any, videos: any[] }) {
  
  const healthData = useMemo(() => {
    if (!stats || !videos.length) return null;

    // Consistency (Days since last upload)
    const lastUpload = new Date(videos[0].publishedAt).getTime();
    const daysSinceUpload = (Date.now() - lastUpload) / (1000 * 3600 * 24);
    const consistencyScore = daysSinceUpload < 7 ? 100 : daysSinceUpload < 14 ? 70 : 40;

    // Engagement (Likes/Views)
    const recentLikes = videos.slice(0, 5).reduce((acc, v) => acc + parseInt(v.likes), 0);
    const recentViews = videos.slice(0, 5).reduce((acc, v) => acc + parseInt(v.views), 0);
    const engRate = recentViews > 0 ? (recentLikes / recentViews) * 100 : 0;
    const engagementScore = Math.min(100, (engRate / 4) * 100); // Benchmark approx 4%

    // Velocity (Mock for MVP)
    const velocityScore = 85; 

    const totalScore = Math.round((consistencyScore * 0.3) + (engagementScore * 0.4) + (velocityScore * 0.3));

    let verdict = "Stable";
    if (totalScore > 80) verdict = "Excellent";
    else if (totalScore < 50) verdict = "Needs Attention";

    return { totalScore, verdict, consistencyScore, engagementScore, velocityScore };
  }, [stats, videos]);

  if (!healthData) return <div className="p-8 text-gray-400">Loading Health Data...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Channel Health Pulse</h2>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Overall Health Score</p>
          <div className="flex items-baseline gap-4 mt-2">
            <h1 className="text-6xl font-black text-gray-900">{healthData.totalScore}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${healthData.totalScore > 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {healthData.verdict}
            </span>
          </div>
          <p className="text-gray-500 mt-4 max-w-md">
            Your channel is performing <strong>{healthData.totalScore > 80 ? "above" : "at"}</strong> industry standards. 
          </p>
        </div>
        
        {/* Radial Visual */}
        <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-8 border-black border-t-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
          <span className="text-3xl">❤️</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Consistency", score: healthData.consistencyScore, icon: "📅" },
          { label: "Engagement", score: Math.round(healthData.engagementScore), icon: "💬" },
          { label: "Velocity", score: healthData.velocityScore, icon: "🚀" },
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between mb-4">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-bold text-gray-900">{item.score}/100</span>
            </div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}