"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, Play, BarChart3, ArrowRight, 
  Lightbulb, Zap, Repeat, ShieldAlert, Target, Loader2
} from "lucide-react";

// Mock Channel ID for demo (Replace with real dynamic ID in production)
const CHANNEL_ID = "UC_YOUR_CHANNEL_ID"; 

export default function TopPerformers() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  // 1. Fetch Top Videos on Mount
  useEffect(() => {
    async function fetchTop() {
      try {
        const res = await fetch(`/api/youtube/top-videos?channelId=${CHANNEL_ID}`);
        const data = await res.json();
        if (data.videos) setVideos(data.videos);
      } catch (e) {
        console.error("Failed to load videos", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, []);

  // 2. Handle "Deep Analysis" Click
  const analyzeVideo = async (video: any) => {
    setAnalyzingId(video.id);
    setSelectedVideo(video);
    setAnalysisData(null); // Clear previous

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

  if (loading) return <div className="h-full flex items-center justify-center text-slate-400 gap-2"><Loader2 className="animate-spin"/> Loading Performance Data...</div>;

  return (
    <div className="h-full flex flex-col md:flex-row bg-white overflow-hidden font-sans text-slate-900">
      
      {/* LEFT: LIST OF TOP PERFORMERS */}
      <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
            Top Performers
          </h2>
          <p className="text-xs text-slate-500 mt-1">Videos driving the most velocity.</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {videos.map((video, idx) => (
            <div 
              key={video.id}
              onClick={() => analyzeVideo(video)}
              className={`p-5 border-b border-slate-200 cursor-pointer transition-colors group ${
                selectedVideo?.id === video.id ? 'bg-white border-l-4 border-l-yellow-400 shadow-sm' : 'hover:bg-slate-100 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex gap-3">
                <div className="text-lg font-black text-slate-300">#{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors">
                    {video.title}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Play size={10}/> {parseInt(video.views).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Zap size={10}/> {parseInt(video.likes).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: DEEP ANALYSIS PANEL */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white relative">
        {!selectedVideo ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center opacity-60">
            <BarChart3 size={48} className="mb-4" />
            <p className="font-bold">Select a video to analyze</p>
            <p className="text-sm">We'll break down why it went viral.</p>
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
            
            {/* HEADER */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <img src={selectedVideo.thumbnail} className="w-32 rounded-lg shadow-sm border border-slate-100" />
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                    Analysis Target
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight">{selectedVideo.title}</h1>
                  <p className="text-sm text-slate-500 mt-2">Published on {new Date(selectedVideo.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* METRICS ROW */}
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Views" value={parseInt(selectedVideo.views).toLocaleString()} />
                <MetricCard label="Engagement" value={`${((parseInt(selectedVideo.likes) / parseInt(selectedVideo.views)) * 100).toFixed(1)}%`} sub="Likes/Views Ratio" />
                <MetricCard label="Est. Retention" value="High" sub="Based on engagement" />
              </div>
            </div>

            {/* AI LOADING STATE */}
            {analyzingId === selectedVideo.id && (
               <div className="py-20 flex flex-col items-center justify-center text-slate-400 animate-pulse">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin mb-4"/>
                  <p className="font-bold text-sm text-slate-600">Deconstructing Script & Pacing...</p>
                  <p className="text-xs">Reading transcript...</p>
               </div>
            )}

            {/* ANALYSIS RESULTS */}
            {analysisData && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                
                <div className="h-px bg-slate-100" />

                {/* 1. HOOK ANALYSIS */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Why they clicked & stayed</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                     <div className="p-6 bg-slate-900 text-white rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-xs font-bold text-slate-400 uppercase">Hook Score</span>
                           <span className="text-2xl font-black text-yellow-400">{analysisData.hookAnalysis.score}/10</span>
                        </div>
                        <p className="font-medium text-lg leading-snug mb-2">{analysisData.hookAnalysis.mechanism}</p>
                        <p className="text-sm text-slate-400 opacity-90">{analysisData.hookAnalysis.explanation}</p>
                     </div>
                     <div className="p-6 bg-white border border-slate-200 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Algorithm Signals</span>
                        <div className="space-y-3">
                           <div>
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-1 rounded">CTR Factor</span>
                              <p className="text-sm text-slate-600 mt-1">{analysisData.algorithmSignals.clickThroughFactors}</p>
                           </div>
                           <div>
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-1 rounded">Engagement</span>
                              <p className="text-sm text-slate-600 mt-1">{analysisData.algorithmSignals.engagementTriggers}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </section>

                {/* 2. RETENTION DRIVERS */}
                <section>
                   <InsightBlock icon={Lightbulb} title="Retention Architecture" colorClass="bg-blue-50 text-blue-600">
                      <ul className="list-disc pl-4 space-y-1">
                        {analysisData.retentionDrivers.map((r: string, i: number) => (
                           <li key={i}>{r}</li>
                        ))}
                      </ul>
                   </InsightBlock>
                </section>

                {/* 3. THE PLAYBOOK (Actionable) */}
                <section>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Playbook</h3>
                   <div className="grid gap-4">
                      <InsightBlock icon={Repeat} title="REPEAT This" colorClass="bg-emerald-50 text-emerald-600">
                         {analysisData.playbook.repeat}
                      </InsightBlock>
                      <InsightBlock icon={ShieldAlert} title="AVOID Changing This" colorClass="bg-rose-50 text-rose-600">
                         {analysisData.playbook.avoid}
                      </InsightBlock>
                      <InsightBlock icon={Target} title="Next Video to Test" colorClass="bg-purple-50 text-purple-600">
                         {analysisData.playbook.nextTest}
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