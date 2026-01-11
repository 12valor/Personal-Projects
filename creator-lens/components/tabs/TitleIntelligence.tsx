"use client";

import { useState, useMemo } from "react";
import { Search, Zap, BarChart3, BookOpen, AlertCircle, ArrowRight, Filter, Flame, ThumbsUp, Activity } from "lucide-react";

export default function TitleIntelligence() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'velocity' | 'engagement' | 'trending'>('velocity');

  const analyzeTopic = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/youtube/title-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (!json.error) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Client-side Sorting/Filtering Logic
  const filteredVideos = useMemo(() => {
    if (!data?.marketData) return [];
    let sorted = [...data.marketData];

    if (activeFilter === 'engagement') {
      sorted.sort((a, b) => b.engagementRate - a.engagementRate);
    } else if (activeFilter === 'trending') {
      // Prioritize "Fresh" videos, then velocity
      sorted.sort((a, b) => (Number(b.isFresh) - Number(a.isFresh)) || (b.velocity - a.velocity));
    } else {
      // Default: Velocity
      sorted.sort((a, b) => b.velocity - a.velocity);
    }
    return sorted;
  }, [data, activeFilter]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans text-slate-900 pb-20">
      
      {/* 1. HEADER & INPUT */}
      <div className="bg-white p-8 rounded-xl shadow-panel border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen size={20} className="text-slate-400" />
              Title Intelligence
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Analyze competitor strategies using Growth, Engagement, and Trending signals.
            </p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Enter niche (e.g., 'Fitness Tips')"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeTopic()}
              />
            </div>
            <button 
              onClick={analyzeTopic}
              disabled={loading || !topic}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? "Scanning..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 2. LEFT COLUMN: MARKET DATA LIST */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top Performers</h3>
              
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveFilter('velocity')}
                  className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                    activeFilter === 'velocity' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Activity size={12} /> Velocity
                </button>
                <button 
                  onClick={() => setActiveFilter('engagement')}
                  className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                    activeFilter === 'engagement' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ThumbsUp size={12} /> Engagement
                </button>
                <button 
                  onClick={() => setActiveFilter('trending')}
                  className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                    activeFilter === 'trending' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Flame size={12} /> Trending
                </button>
              </div>
            </div>

            {/* Video Cards */}
            <div className="space-y-4">
              {filteredVideos.map((video: any) => (
                <div key={video.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all group flex gap-4">
                  {/* Thumbnail (Optional if data provided, else placeholder) */}
                  <div className="w-24 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                     {video.thumbnail && <img src={video.thumbnail} className="w-full h-full object-cover" />}
                     {video.isFresh && (
                       <div className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</div>
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors" title={video.title}>
                      {video.title}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                       <span className="text-xs text-slate-500 font-medium">{video.channel}</span>
                       
                       {/* Metric Badges */}
                       <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                           <Activity size={10} className="text-emerald-500" /> 
                           {video.velocity.toLocaleString()}/day
                         </span>
                         
                         <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                           video.engagementRate > 5 
                             ? "bg-blue-50 text-blue-700 border-blue-100" 
                             : "bg-slate-50 text-slate-600 border-slate-100"
                         }`}>
                           <ThumbsUp size={10} /> 
                           {video.engagementRate}% ER
                         </span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. RIGHT COLUMN: INTELLIGENCE PANEL */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dominant Structure Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                  <Zap size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Winning Structure</span>
                </div>
                
                {data.intelligence.dominantPattern ? (
                  <>
                    <h3 className="text-2xl font-bold mb-2">
                      {data.intelligence.dominantPattern.type}
                    </h3>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                      This structure appears most frequently among high-velocity videos in this niche.
                    </p>
                    <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                      <p className="text-[10px] text-slate-400 uppercase mb-1">Benchmark Title</p>
                      <p className="text-sm font-medium italic">"{data.intelligence.dominantPattern.example}"</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-300">No clear dominant structure. This niche allows for varied title formats.</p>
                )}
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Keyword Cloud */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 size={14} /> High-Value Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.intelligence.topKeywords.map((word: string) => (
                  <span key={word} className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-sm font-medium capitalize hover:bg-slate-100 transition-colors cursor-default">
                    {word}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                *Weighted by view velocity and engagement.
              </p>
            </div>

            {/* Strategic Insight */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle size={14} /> Optimization Tip
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="mt-1"><ArrowRight size={14} className="text-emerald-500" /></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Sweet Spot Length</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Competitors average <span className="font-bold">{data.intelligence.avgTitleLength} characters</span>.
                      {data.intelligence.avgTitleLength < 50 
                        ? " Concise titles outperform verbose ones here." 
                        : " Detail-rich titles are preferred by this audience."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}