"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
}

export default function ViralSpikeManager({ 
  recentVideos, 
  velocity 
}: { 
  recentVideos: Video[], 
  velocity: Record<string, number> 
}) {
  const [selectedSpike, setSelectedSpike] = useState<Video | null>(null);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // --- CHANGED LOGIC: ALWAYS SHOW CARDS ---
  const spikingVideos = useMemo(() => {
    // 1. First, look for actual spikes (> 0 velocity)
    const activeSpikes = recentVideos.filter(v => (velocity[v.id] || 0) > 0);
    
    // 2. If no spikes, just show the top 3 recent videos so the UI stays visible
    if (activeSpikes.length === 0) {
      return recentVideos.slice(0, 3);
    }
    
    return activeSpikes;
  }, [recentVideos, velocity]);

  // 2. ANALYZE RETENTION
  const analyzeVideo = async (video: Video) => {
    setSelectedSpike(video);
    setLoadingAnalysis(true);
    setHighlights([]);
    
    try {
      const res = await fetch(`/api/youtube/retention?videoId=${video.id}`);
      const data = await res.json();
      
      if (data.retention) {
        const chartData = data.retention.map((row: any) => ({
          timeRatio: row[0],
          retention: row[1],
          seconds: Math.floor(row[0] * data.duration)
        }));
        setRetentionData(chartData);

        // Find Peaks Logic
        const peaks = [];
        for (let i = 5; i < chartData.length - 5; i++) {
          const current = chartData[i].retention;
          const prev = chartData[i-5].retention;
          const next = chartData[i+5].retention;
          
          if (current > prev && current > next && current > 0.4) {
             const start = Math.max(0, chartData[i].seconds - 15);
             const end = Math.min(data.duration, chartData[i].seconds + 15);
             peaks.push({ start, end, score: current, duration: end - start });
             i += 10;
          }
        }
        setHighlights(peaks.sort((a, b) => b.score - a.score).slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const fmtTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (recentVideos.length === 0) return null;

  return (
    <div className="mb-10 font-sans">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Real-Time Monitor</h2>
          <p className="text-sm text-gray-500">Live performance & Highlight extraction.</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Active
        </span>
      </div>

      {/* VIDEO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spikingVideos.map(video => {
          const currentVelocity = velocity[video.id] || 0;
          const isSpiking = currentVelocity > 0;

          return (
            <div 
              key={video.id} 
              onClick={() => analyzeVideo(video)}
              className={`group bg-white rounded-2xl p-4 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden ${isSpiking ? 'border-blue-100 ring-1 ring-blue-50' : 'border-gray-100'}`}
            >
              <div className="flex gap-4 relative z-10">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img src={video.thumbnail} alt="" className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h4>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                     {isSpiking ? (
                       <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded-md shadow-sm shadow-blue-200">
                         <span>📈</span>
                         <span>+{currentVelocity} views/m</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                         <span>zzz</span>
                         <span>Stable</span>
                       </div>
                     )}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex items-center text-gray-300 group-hover:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* HIGHLIGHT STUDIO MODAL */}
      {selectedSpike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/20 animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div className="flex gap-5 items-center">
                 <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5">
                   <img src={selectedSpike.thumbnail} className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Magic Clips</h3>
                   <p className="text-sm text-gray-500 font-medium">Auto-extracted from retention data</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedSpike(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              {loadingAnalysis ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative w-16 h-16">
                     <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-gray-900 font-bold">Analyzing Engagement</h4>
                    <p className="text-gray-500 text-sm mt-1">Scanning for rewatch peaks...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Retention Chart */}
                  {retentionData.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-end mb-4">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Audience Retention</p>
                         <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                           Peaks Found
                         </span>
                      </div>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={retentionData}>
                            <defs>
                              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="retention" 
                              stroke="#3b82f6" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorRetention)" 
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                              labelStyle={{ display: 'none' }}
                              formatter={(value: any) => [`${(Number(value) * 100).toFixed(0)}%`, "Retention"]}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Clip List */}
                  <div>
                    <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                       <span>✂️</span> Ready-to-Edit Clips
                    </h4>
                    
                    {highlights.length === 0 ? (
                      <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <p className="text-gray-400 text-sm">Not enough data to determine viral peaks yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {highlights.map((clip, i) => (
                          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col sm:flex-row gap-5 items-center">
                            
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                               <span className="text-xl font-black text-gray-900">{clip.duration}s</span>
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Duration</span>
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                              <h5 className="font-bold text-gray-900 text-sm">Viral Segment #{i+1}</h5>
                              <p className="text-gray-500 text-xs mt-1 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded">
                                {fmtTime(clip.start)} — {fmtTime(clip.end)}
                              </p>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                              <a 
                                href={`https://www.youtube.com/embed/${selectedSpike.id}?start=${clip.start}&end=${clip.end}&autoplay=1`} 
                                target="_blank"
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                              >
                                <span>▶️</span> Preview
                              </a>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://youtu.be/${selectedSpike.id}?t=${clip.start}`);
                                }}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-gray-200"
                              >
                                Copy Link
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}