"use client";

import { useState, useMemo } from "react";
import { 
  Search, X, TrendingUp, Activity, 
  Loader2, Users, BarChart2, Zap, 
  ArrowUpRight, Calendar, Hash, AlertCircle 
} from "lucide-react";

export default function CompetitorInsights({ myStats }: { myStats: any }) {
  const [query, setQuery] = useState("");
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeComp, setActiveComp] = useState<any>(null);

  // --- ACTIONS ---
  const addCompetitor = async () => {
    if (!query) return;
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await fetch(`/api/youtube/competitor-analysis?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCompetitors(prev => {
          // Prevent duplicates
          if (prev.find(c => c.info.customUrl === data.info.customUrl)) return prev;
          return [...prev, data];
        });
        setActiveComp(data);
        setQuery("");
      }
    } catch (e) {
      setError("Failed to track channel. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const removeCompetitor = (id: string, e: any) => {
    e.stopPropagation();
    setCompetitors(prev => prev.filter(c => c.info.customUrl !== id));
    if (activeComp?.info.customUrl === id) setActiveComp(null);
  };

  // --- METRICS ENGINE ---
  const stats = useMemo(() => {
    if (!activeComp) return null;
    const videos = activeComp.videos || [];
    if (videos.length === 0) return null;

    const totalViews = videos.reduce((acc: number, v: any) => acc + parseInt(v.views || 0), 0);
    const totalLikes = videos.reduce((acc: number, v: any) => acc + parseInt(v.likes || 0), 0);
    const avgEngagement = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : "0";
    const avgViews = totalViews > 0 ? Math.round(totalViews / videos.length) : 0;

    // Posting Heatmap
    const times: Record<string, number> = {};
    videos.forEach((v: any) => {
      const h = new Date(v.publishedAt).getHours();
      const slot = `${h % 12 || 12}${h >= 12 ? 'pm' : 'am'}`;
      times[slot] = (times[slot] || 0) + 1;
    });
    const bestTimes = Object.entries(times).sort((a, b) => b[1] - a[1]).slice(0, 3);

    // Tag Analysis
    const tagCounts: Record<string, number> = {};
    videos.forEach((v: any) => v.tags?.forEach((t: string) => tagCounts[t.toLowerCase()] = (tagCounts[t.toLowerCase()] || 0) + 1));
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

    return { avgEngagement, avgViews, bestTimes, topTags };
  }, [activeComp]);

  return (
    <div className="h-full flex flex-col space-y-6 font-sans text-slate-900 animate-in fade-in duration-500 pb-12">
      
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">Competitive Intelligence</h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">Benchmark against top creators in your niche.</p>
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Track channel (e.g. @MrBeast)"
                    className={`pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all placeholder:text-slate-400 ${error ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-slate-100 focus:border-slate-400'}`}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                  />
                </div>
                <button 
                  onClick={addCompetitor}
                  disabled={loading || !query}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Track"}
                </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium animate-in slide-in-from-top-1">
                <AlertCircle size={12} /> {error}
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. SIDEBAR LIST */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Monitored Channels</span>
             <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md tabular-nums">{competitors.length}</span>
          </div>
          
          <div className="space-y-1.5">
            {competitors.map((comp, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveComp(comp)}
                className={`relative px-3 py-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 group border ${
                  activeComp === comp 
                    ? "bg-white border-slate-300 shadow-sm ring-1 ring-slate-900/5" 
                    : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                <img src={comp.info.thumbnail} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-slate-900 truncate leading-tight">{comp.info.title}</h4>
                  <p className="text-xs text-slate-500 truncate tabular-nums mt-0.5">{Number(comp.info.subs).toLocaleString()} subs</p>
                </div>
                
                {activeComp === comp && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
                
                <button 
                  onClick={(e) => removeCompetitor(comp.info.customUrl, e)}
                  className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md shadow-sm transition-all z-10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {competitors.length === 0 && (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                 <p className="text-sm font-medium text-slate-500">No channels tracked yet</p>
                 <p className="text-xs text-slate-400 mt-1">Add a competitor to start</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. INSIGHTS DASHBOARD */}
        {activeComp && stats ? (
          <div className="lg:col-span-9 space-y-6">
            
            {/* A. KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subscribers */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2 bg-slate-50 rounded-md text-slate-500"><Users size={18} /></div>
                   {Number(myStats?.subscriberCount) > Number(activeComp.info.subs) ? (
                     <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wide">You Lead</span>
                   ) : (
                     <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wide">Trailing</span>
                   )}
                </div>
                <div>
                   <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{Number(activeComp.info.subs).toLocaleString()}</p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Subscribers</p>
                </div>
                {/* Visual Progress Bar */}
                <div className="mt-5 flex h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="bg-slate-900 h-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (Number(activeComp.info.subs) / (Number(activeComp.info.subs) + Number(myStats?.subscriberCount || 1))) * 100)}%` }} />
                </div>
              </div>

              {/* Engagement */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2 bg-slate-50 rounded-md text-slate-500"><Zap size={18} /></div>
                </div>
                <div>
                   <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{stats.avgEngagement}%</p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Engagement Rate</p>
                </div>
                <div className="mt-5 text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">Likes per 100 views</div>
              </div>

              {/* Avg Views */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2 bg-slate-50 rounded-md text-slate-500"><BarChart2 size={18} /></div>
                </div>
                <div>
                   <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{stats.avgViews.toLocaleString()}</p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Avg Views</p>
                </div>
                <div className="mt-5 text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">Based on recent uploads</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* B. STRATEGY ANALYSIS */}
               <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col h-full">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                    <Activity size={16} className="text-indigo-500" />
                    Strategy DNA
                  </h3>
                  
                  <div className="flex-1 space-y-6">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Core Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {stats.topTags.map((tag: string) => (
                          <span key={tag} className="px-2.5 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Upload Rhythm</p>
                       <div className="flex gap-2">
                          {stats.bestTimes.map(([time], i) => (
                            <div key={i} className="flex-1 bg-slate-900 text-white py-2.5 rounded-md text-center shadow-sm">
                               <div className="text-xs font-bold">{time}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>

               {/* C. CONTENT LIST */}
               <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Recent Top Hits
                  </h3>
                  <div className="space-y-4">
                     {activeComp.videos.slice(0, 4).map((v: any, i: number) => (
                       <a 
                         key={v.id} 
                         href={`https://youtube.com/watch?v=${v.id}`} 
                         target="_blank"
                         className="flex items-start gap-3 group"
                       >
                          <div className="w-6 text-xs font-bold text-slate-300 pt-1 tabular-nums">0{i+1}</div>
                          <div className="flex-1 pb-3 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                             <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                               {v.title}
                             </h4>
                             <div className="flex gap-3 mt-1.5 text-[10px] uppercase font-bold tracking-wide text-slate-400">
                               <span className="flex items-center gap-1"><ArrowUpRight size={10} /> {Number(v.views).toLocaleString()} views</span>
                               <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(v.publishedAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </a>
                     ))}
                  </div>
               </div>

            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="lg:col-span-9 h-96 flex flex-col items-center justify-center text-center bg-white rounded-lg border border-dashed border-slate-300">
             <div className="p-4 bg-slate-50 rounded-full mb-4 animate-bounce-slow">
                <Search className="text-slate-400" size={24} />
             </div>
             <h3 className="text-base font-bold text-slate-900">Intelligence Awaits</h3>
             <p className="text-slate-500 text-sm font-medium max-w-xs mt-2">
               Enter a handle above or select a channel to unlock data-driven insights.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}