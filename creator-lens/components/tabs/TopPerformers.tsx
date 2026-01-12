"use client";

import { useState } from "react";
import { 
  Trophy, Play, BarChart3, Search, Loader2,
  Smartphone, MonitorPlay, Zap, Lightbulb, Repeat, ShieldAlert, Target
} from "lucide-react";

export default function TopPerformers() {
  const [channelId, setChannelId] = useState("");
  const [format, setFormat] = useState<'long' | 'short'>('long'); 
  
  // DATA STATE
  const [longVideos, setLongVideos] = useState<any[]>([]);
  const [shortVideos, setShortVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // ANALYSIS STATE
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  // FETCH & SORT
  const fetchVideos = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setHasSearched(true);
    setLongVideos([]);
    setShortVideos([]);
    
    try {
      const cleanId = encodeURIComponent(id.trim());
      const res = await fetch(`/api/youtube/top-videos?channelId=${cleanId}`);
      const data = await res.json();
      
      if (!res.ok || data.error) {
        alert(data.error || "Error fetching videos");
      } else {
        setLongVideos(data.longForm || []);
        setShortVideos(data.shorts || []);
        
        // Note: We are NOT saving to localStorage anymore to prevent accidental auto-fills
        // localStorage.setItem("creatorlens_channel_id", id);
        
        // Smart Auto-Switch: If no long videos but lots of shorts, switch tab
        if (data.longForm?.length === 0 && data.shorts?.length > 0) {
           setFormat('short');
        } else if (data.shorts?.length === 0 && data.longForm?.length > 0) {
           setFormat('long');
        }
      }
    } catch (e) {
      alert("Network Error: Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  // REMOVED: The useEffect hook that auto-fetched data on mount has been deleted.

  // ANALYZE HANDLER
  const analyzeVideo = async (video: any) => {
    setAnalyzingId(video.id);
    setSelectedVideo(video);
    setAnalysisData(null); 

    try {
      const res = await fetch("/api/ai/analyze-performer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoId: video.id, 
          title: video.title, 
          stats: { views: video.views, likes: video.likes, comments: video.comments }
        }),
      });
      const data = await res.json();
      setAnalysisData(data);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const activeList = format === 'long' ? longVideos : shortVideos;

  // --- SUB-COMPONENTS ---
  const MetricCard = ({ label, value, sub }: any) => (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );

  const InsightBlock = ({ icon: Icon, title, children, colorClass }: any) => (
    <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
      <div className={`p-3 rounded-lg h-fit ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row bg-white overflow-hidden font-sans text-slate-900">
      
      {/* LEFT: LIST */}
      <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-black flex items-center gap-2 mb-4">
            <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
            Top Performers
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); fetchVideos(channelId); }} className="relative mb-4">
            <input 
              type="text" placeholder="Channel ID (UC...)" value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          </form>

          {/* FILTER TABS */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setFormat('long')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${format === 'long' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MonitorPlay size={14} /> Long Form ({longVideos.length})
            </button>
            <button 
              onClick={() => setFormat('short')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${format === 'short' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Smartphone size={14} /> Shorts ({shortVideos.length})
            </button>
          </div>
        </div>

        {/* Video List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
             <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                <Loader2 className="animate-spin mb-2" />
                <span className="text-xs font-bold">Scanning Library...</span>
             </div>
          )}
          
          {!loading && hasSearched && activeList.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                {format === 'long' ? <MonitorPlay size={20} className="opacity-50"/> : <Smartphone size={20} className="opacity-50"/>}
              </div>
              <p>No {format === 'long' ? 'Long Form' : 'Shorts'} found in top results.</p>
              <p className="opacity-70">Try switching tabs.</p>
            </div>
          )}

          {activeList.map((video, idx) => (
            <div 
              key={video.id}
              onClick={() => analyzeVideo(video)}
              className={`p-5 border-b border-slate-200 cursor-pointer transition-colors group ${
                selectedVideo?.id === video.id ? 'bg-white border-l-4 border-l-yellow-400 shadow-sm' : 'hover:bg-slate-100 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex gap-3">
                <div className="text-lg font-black text-slate-300 w-6">#{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors">
                    {video.title}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Play size={10}/> {video.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Zap size={10}/> {video.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: ANALYSIS */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white relative">
        {!selectedVideo ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center opacity-60">
            <BarChart3 size={48} className="mb-4" />
            <p className="font-bold">Select a {format === 'long' ? 'video' : 'Short'} to analyze</p>
            <p className="text-sm">We'll break down the {format === 'long' ? 'retention structure' : 'loop factor'}.</p>
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <img src={selectedVideo.thumbnail} className="w-32 rounded-lg shadow-sm border border-slate-100" />
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                    {format === 'short' ? 'Shorts Analysis' : 'Video Analysis'}
                  </div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">{selectedVideo.title}</h1>
                  <p className="text-sm text-slate-500 mt-2">Published {new Date(selectedVideo.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Views" value={selectedVideo.views.toLocaleString()} />
                <MetricCard label="Like Ratio" value={`${((selectedVideo.likes / selectedVideo.views) * 100).toFixed(1)}%`} sub="Engagement" />
                <MetricCard label="Type" value={format === 'short' ? 'Short' : 'Video'} sub="Format" />
              </div>
            </div>

            {analyzingId === selectedVideo.id && (
               <div className="py-20 flex flex-col items-center justify-center text-slate-400 animate-pulse">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-yellow-400" />
                  <p className="font-bold text-sm text-slate-600">Analyzing Script & Performance...</p>
               </div>
            )}

            {analysisData && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="h-px bg-slate-100" />
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Core Drivers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-900 text-white rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-xs font-bold text-slate-400 uppercase">Hook Strength</span>
                           <span className="text-2xl font-black text-yellow-400">{analysisData.hookAnalysis?.score || 8}/10</span>
                        </div>
                        <p className="font-medium text-lg leading-snug mb-2">{analysisData.hookAnalysis?.mechanism || "Visual Interrupt"}</p>
                        <p className="text-sm text-slate-400 opacity-90">{analysisData.hookAnalysis?.explanation}</p>
                      </div>
                      <div className="p-6 bg-white border border-slate-200 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Algorithm Signals</span>
                        <div className="space-y-3">
                           <div>
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-1 rounded">CTR / Swipes</span>
                              <p className="text-sm text-slate-600 mt-1">{analysisData.algorithmSignals?.clickThroughFactors}</p>
                           </div>
                           <div>
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-1 rounded">Interaction</span>
                              <p className="text-sm text-slate-600 mt-1">{analysisData.algorithmSignals?.engagementTriggers}</p>
                           </div>
                        </div>
                      </div>
                  </div>
                </section>
                <section>
                   <InsightBlock icon={Lightbulb} title="Retention Architecture" colorClass="bg-blue-50 text-blue-600">
                      <ul className="list-disc pl-4 space-y-1">
                        {analysisData.retentionDrivers?.map((r: string, i: number) => (
                           <li key={i}>{r}</li>
                        ))}
                      </ul>
                   </InsightBlock>
                </section>
                <section>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Playbook</h3>
                   <div className="grid gap-4">
                      <InsightBlock icon={Repeat} title="REPEAT This" colorClass="bg-emerald-50 text-emerald-600">
                         {analysisData.playbook?.repeat}
                      </InsightBlock>
                      <InsightBlock icon={ShieldAlert} title="AVOID Changing This" colorClass="bg-rose-50 text-rose-600">
                         {analysisData.playbook?.avoid}
                      </InsightBlock>
                      <InsightBlock icon={Target} title="Next Concept" colorClass="bg-purple-50 text-purple-600">
                         {analysisData.playbook?.nextTest}
                      </InsightBlock>
                   </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}