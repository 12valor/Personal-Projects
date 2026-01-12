"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { 
  LayoutDashboard, Activity, TrendingUp, 
  Users, Timer, Clapperboard, 
  Swords, Thermometer, ClipboardList,
  ShieldCheck, Split, Radio, Map,
  Lightbulb, Wand2, Trophy, 
  Sparkles, Menu, Bell, ChevronRight,
  LogOut, Command
} from "lucide-react";

import AICoach from "@/components/AICoach";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CommentReplyTool from "@/components/CommentReplyTool";
import ViralSpikeManager from "@/components/ViralSpikeManager";
import CompetitorInsights from "@/components/CompetitorInsights";

import ChannelHealth from "@/components/tabs/ChannelHealth";
import AudienceLoyalty from "@/components/tabs/AudienceLoyalty";
import ContentFormat from "@/components/tabs/ContentFormat";
import TopicSaturation from "@/components/tabs/TopicSaturation";
import RetentionAnalyzer from "@/components/tabs/RetentionAnalyzer";
import DecisionLog from "@/components/tabs/DecisionLog";
import GrowthForecast from "@/components/tabs/GrowthForecast";
import TitleIntelligence from "@/components/tabs/TitleIntelligence";
import MetadataGenerator from "@/components/tabs/MetadataGenerator";
import TopPerformers from "@/components/tabs/TopPerformers";
import IdeaGenerator from "@/components/tabs/IdeaGenerator";

import AlgorithmTrust from "@/components/tabs/AlgorithmTrust";
import CannibalizationDetector from "@/components/tabs/CannibalizationDetector";
import TrendHijack from "@/components/tabs/TrendHijack";
import ViewerJourney from "@/components/tabs/ViewerJourney";

export default function Home() {
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [viewVelocity, setViewVelocity] = useState<Record<string, number>>({});
  const [deepData, setDeepData] = useState<any>(null);
  const previousVideosRef = useRef<any[]>([]);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(60);
  const [selectedVideoPrompt, setSelectedVideoPrompt] = useState("");

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

  const NavBtn = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`group w-full text-left px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-3 relative rounded-md mx-1 my-0.5
        ${activeTab === id 
          ? "text-slate-900 bg-slate-100/80" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }`} 
    >
      {activeTab === id && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-slate-900 rounded-r-sm" />
      )}
      <Icon 
        size={16} 
        strokeWidth={2}
        className={`transition-colors duration-200 ${activeTab === id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} 
      />
      <span className="tracking-tight">{label}</span>
    </button>
  );

  return (
    // FIX: Changed "min-h-screen" to "h-screen overflow-hidden" to stop double scrollbars
    <div className="h-screen w-full overflow-hidden bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif' }}>
      
      {/* 1. SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white shadow-sm">
                <Command size={16} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">CreatorLens</h1>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Workspace</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            
            <div className="space-y-0.5">
              <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics</div>
              <NavBtn id="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavBtn id="health" icon={Activity} label="Channel Health" />
              <NavBtn id="forecast" icon={TrendingUp} label="Growth Forecast" />
            </div>

            <div className="space-y-0.5">
               <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Tools</div>
              <NavBtn id="ideas" icon={Sparkles} label="Idea Generator" />
              <NavBtn id="generator" icon={Wand2} label="Metadata Generator" />
              <NavBtn id="titles" icon={Lightbulb} label="Title Intelligence" />
            </div>

            <div className="space-y-0.5">
              <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Deep Dive</div>
              <NavBtn id="performers" icon={Trophy} label="Top Performers" />
              <NavBtn id="competitors" icon={Swords} label="Competitors" />
              <NavBtn id="loyalty" icon={Users} label="Audience Loyalty" />
              <NavBtn id="retention" icon={Timer} label="Retention Analysis" />
              <NavBtn id="format" icon={Clapperboard} label="Format Analyzer" />
            </div>

            <div className="space-y-0.5">
              <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Strategy</div>
              <NavBtn id="saturation" icon={Thermometer} label="Topic Saturation" />
              <NavBtn id="trust" icon={ShieldCheck} label="Trust Score" />
              <NavBtn id="radar" icon={Radio} label="Trend Radar" />
              <NavBtn id="decisions" icon={ClipboardList} label="Decision Log" />
            </div>
          </nav>

          {session && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <img src={session.user?.image || ""} className="w-8 h-8 rounded-md border border-slate-200" alt="User" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{session.user?.name}</p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sync Active
                  </p>
                </div>
                <button 
                  onClick={() => signOut()} 
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F8FAFC]">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
                <Menu size={20} />
             </button>
             <h2 className="text-lg font-bold text-slate-900 tracking-tight capitalize">
               {activeTab.replace(/([A-Z])/g, ' $1').trim()} 
             </h2>
           </div>
           
           <div className="flex items-center gap-4">
             {session && (
               <>
                 <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                    <Bell size={20} strokeWidth={2} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                 </button>
                 <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync:</span>
                    <span className="text-xs font-mono font-medium text-slate-700">{timeUntilUpdate}s</span>
                 </div>
               </>
             )}
           </div>
        </header>

        {/* Content Container - SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {!session ? (
             <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl shadow-slate-200 rotate-3">
                   <Command size={40} className="text-white" />
                </div>
                
                <div className="max-w-md space-y-3">
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">
                    CreatorLens
                  </h2>
                  <p className="text-slate-500 text-base font-medium leading-relaxed">
                    Data-driven operating system for high-growth channels.
                  </p>
                </div>

                <button 
                  onClick={() => signIn("google")} 
                  className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Continue with Google</span>
                  <ChevronRight size={16} />
                </button>
             </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    {recentVideos.length > 0 && (
                       <ViralSpikeManager recentVideos={recentVideos} velocity={viewVelocity} />
                    )}
                    
                    {channelData && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Subscriber Count', 'View Count', 'Video Count'].map((label, idx) => {
                          const keys = ['subscriberCount', 'viewCount', 'videoCount'];
                          const val = Number(channelData.stats[keys[idx]]);
                          const icons = [Users, Activity, Clapperboard];
                          const Icon = icons[idx];
                          
                          return (
                            <div key={label} className="group bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all duration-200">
                              <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-slate-50 rounded-md border border-slate-100 group-hover:bg-white transition-colors">
                                  <Icon size={18} className="text-slate-500" />
                                </div>
                                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide">
                                  LIVE
                                </span>
                              </div>
                              <div>
                                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                                  {val.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                       <AnalyticsDashboard />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <AICoach prefill={selectedVideoPrompt} />
                      </div>
                      <div className="lg:col-span-1">
                        <CommentReplyTool />
                      </div>
                    </div>
                  </div>
              )}

              <div className="animate-in fade-in duration-300">
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
                {activeTab === 'performers' && <TopPerformers />}
                {activeTab === 'ideas' && <IdeaGenerator />}
              </div>
            </>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}