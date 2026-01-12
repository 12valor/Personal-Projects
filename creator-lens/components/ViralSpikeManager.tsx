"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// FIX: Added ArrowRight to the import list below
import { 
  TrendingUp, Activity, Play, Zap, 
  Scissors, ExternalLink, X, Clock, Loader2, ArrowRight
} from "lucide-react";

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

  // LOGIC: Filter for spikes, fallback to recent 3 if none
  const spikingVideos = useMemo(() => {
    const activeSpikes = recentVideos.filter(v => (velocity[v.id] || 0) > 0);
    return activeSpikes.length === 0 ? recentVideos.slice(0, 3) : activeSpikes;
  }, [recentVideos, velocity]);

  // ANALYZE RETENTION (Mocked or Real API)
  const analyzeVideo = async (video: Video) => {
    setSelectedSpike(video);
    setLoadingAnalysis(true);
    setHighlights([]);
    setRetentionData([]);
    
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

        // Peak Detection Algorithm
        const peaks = [];
        for (let i = 5; i < chartData.length - 5; i++) {
          const current = chartData[i].retention;
          const prev = chartData[i-5].retention;
          const next = chartData[i+5].retention;
          
          if (current > prev && current > next && current > 0.4) {
             const start = Math.max(0, chartData[i].seconds - 15);
             const end = Math.min(data.duration, chartData[i].seconds + 15);
             peaks.push({ start, end, score: current, duration: end - start });
             i += 10; // Skip forward to avoid duplicate peaks
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
    <div className="mb-10 font-sans text-slate-900">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="text-rose-500" size={20} />
            Velocity Monitor
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time engagement spikes & retention analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Feed</span>
        </div>
      </div>

      {/* VIDEO CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spikingVideos.map(video => {
          const currentVelocity = velocity[video.id] || 0;
          const isSpiking = currentVelocity > 10; // Threshold for visual emphasis

          return (
            <div 
              key={video.id} 
              onClick={() => analyzeVideo(video)}
              className={`group relative bg-white rounded-xl border transition-all cursor-pointer overflow-hidden ${
                isSpiking 
                  ? 'border-rose-200 shadow-lg shadow-rose-100/50 hover:-translate-y-1' 
                  : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Card Header (Thumbnail) */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={video.thumbnail} 
                  alt="" 
                  className="object-cover w-full h-full opacity-95 group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Velocity Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white">
                  {isSpiking ? <TrendingUp size={12} className="text-rose-400" /> : <Activity size={12} className="text-slate-400" />}
                  <span className="text-xs font-bold tabular-nums">
                    {currentVelocity > 0 ? `+${currentVelocity}/m` : 'Stable'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
                  {video.title}
                </h4>
                
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Play size={10} /> {parseInt(video.views).toLocaleString()}</span>
                   </div>
                   <span className="text-xs font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Analyze Retention <ArrowRight size={10} />
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANALYTICS MODAL */}
      {selectedSpike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-900/10 animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                   <img src={selectedSpike.thumbnail} className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">{selectedSpike.title}</h3>
                   <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                     <Zap size={10} className="text-amber-500" /> Retention Extraction
                   </p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedSpike(null)} 
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
              {loadingAnalysis ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-slate-600 font-medium text-sm">Analyzing viewer drop-off points...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* CHART SECTION */}
                  {retentionData.length > 0 && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             <Activity size={16} className="text-rose-500" />
                             Retention Curve
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Relative Performance</span>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={retentionData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                               dataKey="seconds" 
                               tickFormatter={fmtTime} 
                               stroke="#e2e8f0" 
                               tick={{fontSize: 10, fill: '#94a3b8'}}
                               tickLine={false}
                               axisLine={false}
                               minTickGap={30}
                            />
                            <YAxis 
                               hide={false}
                               stroke="#e2e8f0"
                               tick={{fontSize: 10, fill: '#94a3b8'}}
                               tickLine={false}
                               axisLine={false}
                               tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                              labelFormatter={(label) => fmtTime(label)}
                              formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, "Retention"]}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="retention" 
                              stroke="#f43f5e" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorRetention)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* HIGHLIGHTS SECTION */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Scissors size={16} className="text-slate-900" />
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Viral Segments</h4>
                    </div>
                    
                    {highlights.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 text-sm font-medium">No significant viral peaks detected yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {highlights.map((clip, i) => (
                          <div key={i} className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center">
                            
                            {/* Time Badge */}
                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
                               <span className="text-lg font-black text-slate-900">{clip.duration}s</span>
                               <Clock size={10} className="text-slate-400" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center sm:text-left">
                              <h5 className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start gap-2">
                                 Clip #{i+1}
                                 <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] uppercase rounded-sm font-bold">High Retention</span>
                              </h5>
                              <p className="text-slate-500 text-xs mt-1 font-mono">
                                {fmtTime(clip.start)} — {fmtTime(clip.end)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 w-full sm:w-auto">
                              <a 
                                href={`https://www.youtube.com/embed/${selectedSpike.id}?start=${clip.start}&end=${clip.end}&autoplay=1`} 
                                target="_blank"
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={12} /> Preview
                              </a>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://youtu.be/${selectedSpike.id}?t=${clip.start}`);
                                }}
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
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