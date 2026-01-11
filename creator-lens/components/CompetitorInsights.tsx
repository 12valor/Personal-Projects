"use client";

import { useState } from "react";

export default function CompetitorInsights({ myStats }: { myStats: any }) {
  const [query, setQuery] = useState("");
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeComp, setActiveComp] = useState<any>(null);

  const addCompetitor = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube/competitor?query=${query}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setCompetitors(prev => [...prev, data]);
        setActiveComp(data);
        setQuery("");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to track competitor.");
    } finally {
      setLoading(false);
    }
  };

  const getPostTimes = (videos: any[]) => {
    const times: Record<string, number> = {};
    videos.forEach(v => {
      const hour = new Date(v.publishedAt).getHours();
      // Format 13:00 -> 1 PM
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      const slot = `${h12} ${ampm}`;
      times[slot] = (times[slot] || 0) + 1;
    });
    return Object.entries(times).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };

  return (
    <div className="h-full flex flex-col space-y-8 font-sans">
      
      {/* 1. SEARCH BAR */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">Competitor Intelligence</h2>
           <p className="text-gray-500 mt-1">Track rival channels to reveal their strategy.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder="Channel Handle (e.g. @MrBeast)..."
            className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-black transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
          />
          <button 
            onClick={addCompetitor}
            disabled={loading || !query}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg shadow-gray-200"
          >
            {loading ? "Scanning..." : "Track"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. COMPETITOR LIST (Sidebar) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">Tracked Channels</h3>
          
          {competitors.map((comp, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveComp(comp)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 group ${
                activeComp === comp 
                  ? "bg-white border-black ring-1 ring-black shadow-lg shadow-gray-100" 
                  : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <img src={comp.info.thumbnail} className="w-14 h-14 rounded-full border border-gray-100" />
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{comp.info.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{Number(comp.info.subs).toLocaleString()} Subs</p>
              </div>
              {activeComp === comp && <span className="ml-auto text-xl">👉</span>}
            </div>
          ))}
          
          {competitors.length === 0 && (
            <div className="text-center py-12 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
              <span className="text-4xl block mb-2">🕵️</span>
              <p className="text-gray-900 font-bold">No competitors yet</p>
              <p className="text-sm text-gray-500 mt-1">Add a handle above to start spying.</p>
            </div>
          )}
        </div>

        {/* 3. ANALYSIS PANEL */}
        {activeComp && (
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* A. Comparison Cards */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">⚔️ Head-to-Head Stats</h3>
              <div className="grid grid-cols-2 gap-8 relative">
                
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 border-4 border-white z-10">VS</div>

                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">You</p>
                  <p className="text-3xl md:text-4xl font-black text-gray-900">{Number(myStats?.subscriberCount || 0).toLocaleString()}</p>
                  <p className="text-sm font-medium text-gray-500 mt-1">Subscribers</p>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <p className="text-xs text-blue-400 uppercase font-bold tracking-widest mb-2">{activeComp.info.title}</p>
                  <p className="text-3xl md:text-4xl font-black text-blue-900">{Number(activeComp.info.subs).toLocaleString()}</p>
                  <p className="text-sm font-medium text-blue-600/70 mt-1">Subscribers</p>
                </div>
              </div>
            </div>

            {/* B. Trending Videos */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-bold text-gray-900 text-lg">🔥 Their Top Recent Content</h3>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">High Engagement</span>
              </div>
              
              <div className="space-y-4">
                {activeComp.videos.slice(0, 3).map((v: any) => (
                  <a 
                    key={v.id} 
                    href={`https://youtube.com/watch?v=${v.id}`} 
                    target="_blank"
                    className="flex flex-col sm:flex-row gap-5 items-start p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                  >
                    <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{v.title}</h4>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1">👀 {Number(v.views).toLocaleString()}</span>
                        <span className="flex items-center gap-1">❤️ {Number(v.likes).toLocaleString()}</span>
                      </div>
                      
                      {/* Tags/Keywords */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {v.tags?.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* C. Posting Habits Heatmap */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">⏰ When They Post</h3>
              <div className="grid grid-cols-3 gap-4">
                {getPostTimes(activeComp.videos).map(([time, count], i) => (
                   <div key={i} className="flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4 rounded-2xl border border-gray-100">
                     <span className="text-2xl font-black">{time}</span>
                     <span className="text-xs font-bold text-gray-400 uppercase mt-1">Common Slot</span>
                   </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}