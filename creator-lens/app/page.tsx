"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
// 1. IMPORT ICONS
import { 
  LayoutDashboard, Activity, TrendingUp, 
  Users, Timer, Clapperboard, 
  Swords, Thermometer, ClipboardList,
  ShieldCheck, Split, Radio, Map,
  Lightbulb, Wand2, ImagePlus, Trophy // <--- Added Trophy Icon
} from "lucide-react";

// --- CORE DASHBOARD COMPONENTS ---
import AICoach from "@/components/AICoach";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CommentReplyTool from "@/components/CommentReplyTool";
import ViralSpikeManager from "@/components/ViralSpikeManager";
import CompetitorInsights from "@/components/CompetitorInsights";

// --- STRATEGY & ANALYTICS TABS ---
import ChannelHealth from "@/components/tabs/ChannelHealth";
import AudienceLoyalty from "@/components/tabs/AudienceLoyalty";
import ContentFormat from "@/components/tabs/ContentFormat";
import TopicSaturation from "@/components/tabs/TopicSaturation";
import RetentionAnalyzer from "@/components/tabs/RetentionAnalyzer";
import DecisionLog from "@/components/tabs/DecisionLog";
import GrowthForecast from "@/components/tabs/GrowthForecast";
import TitleIntelligence from "@/components/tabs/TitleIntelligence";
import MetadataGenerator from "@/components/tabs/MetadataGenerator";
import ThumbnailMaker from "@/components/tabs/ThumbnailMaker";
import TopPerformers from "@/components/tabs/TopPerformers"; // <--- Imported Component

// --- ADVANCED ALGORITHM TABS ---
import AlgorithmTrust from "@/components/tabs/AlgorithmTrust";
import CannibalizationDetector from "@/components/tabs/CannibalizationDetector";
import TrendHijack from "@/components/tabs/TrendHijack";
import ViewerJourney from "@/components/tabs/ViewerJourney";

export default function Home() {
  const { data: session } = useSession();
  
  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- DATA STATE ---
  const [channelData, setChannelData] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [viewVelocity, setViewVelocity] = useState<Record<string, number>>({});
  const [deepData, setDeepData] = useState<any>(null);
  
  // --- UTILS ---
  const previousVideosRef = useRef<any[]>([]);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(60);
  const [selectedVideoPrompt, setSelectedVideoPrompt] = useState("");

  // --- DATA FETCHING ENGINE ---
  const fetchData = async () => {
    try {
      console.log("🔄 Syncing CreatorLens Data..."); 
      
      const statsRes = await fetch("/api/youtube/stats");
      const statsData = await statsRes.json();
      if (!statsData.error) setChannelData(statsData);

      const videosRes = await fetch("/api/youtube/videos");
      const videosData = await videosRes.json();
      
      if (videosData.videos) {
        const newVideos = videosData.videos;
        if (previousVideosRef.current.length > 0) {
          const velocityUpdates: Record<string, number> = {};
          newVideos.forEach((newVid: any) => {
            const oldVid = previousVideosRef.current.find((v) => v.id === newVid.id);
            if (oldVid) {
              const diff = parseInt(newVid.views) - parseInt(oldVid.views);
              velocityUpdates[newVid.id] = diff > 0 ? diff : 0;
            }
          });
          setViewVelocity(velocityUpdates);
        }
        previousVideosRef.current = newVideos;
        setRecentVideos(newVideos);
      }

      const deepRes = await fetch("/api/youtube/deep-analytics");
      const deepJson = await deepRes.json();
      if (!deepJson.error) setDeepData(deepJson);

    } catch (err) {
      console.error("Polling Error:", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
      const interval = setInterval(() => {
        setTimeUntilUpdate((prevTime) => {
          if (prevTime <= 1) {
            fetchData();
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // --- UI COMPONENTS ---
  
  // Sidebar Button
  const NavBtn = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 mb-1 ${
        activeTab === id 
          ? "bg-slate-900 text-white shadow-md" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon size={18} className={activeTab === id ? "opacity-100" : "opacity-70"} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* 1. SOLID SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 sticky top-0 h-screen z-30 flex flex-col overflow-y-auto shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
        
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">CreatorLens</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overview</div>
          <NavBtn id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavBtn id="health" icon={Activity} label="Channel Health" />
          <NavBtn id="forecast" icon={TrendingUp} label="Growth Forecast" />
          <NavBtn id="generator" icon={Wand2} label="Metadata Generator" />

          <div className="px-4 pb-2 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deep Dive</div>
          <NavBtn id="performers" icon={Trophy} label="Top Performers" /> {/* <--- Added Tab */}
          <NavBtn id="loyalty" icon={Users} label="Audience Loyalty" />
          <NavBtn id="retention" icon={Timer} label="30s Retention" />
          <NavBtn id="format" icon={Clapperboard} label="Format Analyzer" />

          <div className="px-4 pb-2 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategy</div>
          <NavBtn id="competitors" icon={Swords} label="Competitors" />
          <NavBtn id="saturation" icon={Thermometer} label="Topic Saturation" />
          <NavBtn id="decisions" icon={ClipboardList} label="Decision Log" />
          <NavBtn id="titles" icon={Lightbulb} label="Title Intelligence" />

          <div className="px-4 pb-2 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advanced</div>
          <NavBtn id="trust" icon={ShieldCheck} label="Trust Score" />
          <NavBtn id="cannibal" icon={Split} label="Cannibalization" />
          <NavBtn id="radar" icon={Radio} label="Trend Radar" />
          <NavBtn id="journey" icon={Map} label="Viewer Journey" />
        </nav>

        {/* User Profile */}
        {session && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-3 px-1">
              <img src={session.user?.image || ""} className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{session.user?.name}</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">● Live Syncing</p>
              </div>
            </div>
            <button onClick={() => signOut()} className="w-full py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-500 hover:bg-white hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
           <h2 className="text-xl font-semibold text-slate-800 capitalize">
             {activeTab.replace(/([A-Z])/g, ' $1').trim()} 
           </h2>
           
           {session && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums">Next update in {timeUntilUpdate}s</span>
             </div>
           )}
        </header>

        {/* Content Container */}
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
          
          {!session ? (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-4">
                  <LayoutDashboard size={48} />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome to CreatorLens</h2>
                <p className="text-slate-500 max-w-md text-lg">The premium operating system for modern creators.</p>
                <button onClick={() => signIn("google")} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Sign in with Google
                </button>
             </div>
          ) : (
            <>
              {/* === TAB 1: DASHBOARD === */}
              {activeTab === 'dashboard' && (
                  <div className="space-y-8">
                    {recentVideos.length > 0 && (
                       <ViralSpikeManager recentVideos={recentVideos} velocity={viewVelocity} />
                    )}
                    
                    {channelData && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Subscriber Count', 'View Count', 'Video Count'].map((label, idx) => {
                          const keys = ['subscriberCount', 'viewCount', 'videoCount'];
                          const val = Number(channelData.stats[keys[idx]]);
                          return (
                            <div key={label} className="bg-white p-6 rounded-xl shadow-panel border border-slate-100 flex flex-col justify-center h-32 hover:border-slate-300 transition-colors group">
                              <div className="flex justify-between items-start">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                                <span className="text-slate-200 group-hover:text-slate-400 transition-colors">
                                  <TrendingUp size={16} />
                                </span>
                              </div>
                              <p className="text-3xl font-semibold text-slate-900 tracking-tight tabular-nums">
                                {val.toLocaleString()}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    <AnalyticsDashboard />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2"><AICoach prefill={selectedVideoPrompt} /></div>
                      <div className="lg:col-span-1"><CommentReplyTool /></div>
                    </div>
                  </div>
              )}

              {/* === OTHER TABS === */}
              {activeTab === 'competitors' && <CompetitorInsights myStats={channelData?.stats} />}
              {activeTab === 'health' && <ChannelHealth stats={channelData?.stats} videos={recentVideos} />}
              {activeTab === 'forecast' && <GrowthForecast stats={channelData?.stats} />}
              {activeTab === 'loyalty' && <AudienceLoyalty data={deepData?.loyalty} />}
              {activeTab === 'retention' && <RetentionAnalyzer data={deepData?.retention} videos={recentVideos} />}
              {activeTab === 'format' && <ContentFormat videos={recentVideos} />}
              {activeTab === 'saturation' && <TopicSaturation traffic={deepData?.traffic} />}
              {activeTab === 'decisions' && <DecisionLog />}
              {activeTab === 'trust' && <AlgorithmTrust videos={recentVideos} />}
              {activeTab === 'cannibal' && <CannibalizationDetector videos={recentVideos} />}
              {activeTab === 'radar' && <TrendHijack searchTerms={deepData?.searchTerms} />}
              {activeTab === 'journey' && <ViewerJourney relatedVideos={deepData?.relatedVideos} loyalty={deepData?.loyalty} />}
              {activeTab === 'titles' && <TitleIntelligence />}
              {activeTab === 'generator' && <MetadataGenerator />}
              {activeTab === 'performers' && <TopPerformers />} {/* <--- Render Component */}
            </>
          )}

        </div>
      </main>
    </div>
  );
}