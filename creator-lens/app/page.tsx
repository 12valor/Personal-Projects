"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

// --- EXISTING COMPONENTS ---
import AICoach from "@/components/AICoach";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CommentReplyTool from "@/components/CommentReplyTool";
import ViralSpikeManager from "@/components/ViralSpikeManager";
import CompetitorInsights from "@/components/CompetitorInsights";

// --- NEW PREMIUM TABS ---
import ChannelHealth from "@/components/tabs/ChannelHealth";
import AudienceLoyalty from "@/components/tabs/AudienceLoyalty";
import ContentFormat from "@/components/tabs/ContentFormat";
import TopicSaturation from "@/components/tabs/TopicSaturation";
import RetentionAnalyzer from "@/components/tabs/RetentionAnalyzer";
import DecisionLog from "@/components/tabs/DecisionLog";
import GrowthForecast from "@/components/tabs/GrowthForecast";

export default function Home() {
  const { data: session } = useSession();
  
  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- DATA STATE ---
  const [channelData, setChannelData] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [viewVelocity, setViewVelocity] = useState<Record<string, number>>({});
  const [deepData, setDeepData] = useState<any>(null); // State for real Deep Analytics data
  
  // --- REFS & TIMERS ---
  const previousVideosRef = useRef<any[]>([]);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(60);
  const [selectedVideoPrompt, setSelectedVideoPrompt] = useState("");

  // --- POLLING LOGIC ---
  const fetchData = async () => {
    try {
      console.log("🔄 Polling YouTube Data..."); 
      
      // 1. Basic Stats
      const statsRes = await fetch("/api/youtube/stats");
      const statsData = await statsRes.json();
      if (!statsData.error) setChannelData(statsData);

      // 2. Videos & Velocity
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

      // 3. Deep Analytics (Real Data)
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

  // Sidebar Button Helper
  const NavBtn = ({ id, icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
        activeTab === id 
          ? "bg-black text-white shadow-md shadow-gray-200" 
          : "text-gray-600 hover:bg-gray-100 hover:text-black"
      }`}
    >
      <span className="text-lg">{icon}</span> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 sticky top-0 h-screen z-30 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">CreatorLens</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Overview</p>
          <NavBtn id="dashboard" icon="📊" label="Dashboard" />
          <NavBtn id="health" icon="❤️" label="Channel Health" />
          <NavBtn id="forecast" icon="🚀" label="Growth Forecast" />

          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-1">Deep Dive</p>
          <NavBtn id="loyalty" icon="🤝" label="Audience Loyalty" />
          <NavBtn id="retention" icon="🎣" label="30s Retention" />
          <NavBtn id="format" icon="📼" label="Format Analyzer" />

          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-1">Strategy</p>
          <NavBtn id="competitors" icon="🕵️" label="Competitors" />
          <NavBtn id="saturation" icon="🌡️" label="Topic Saturation" />
          <NavBtn id="decisions" icon="📝" label="Decision Log" />
        </nav>

        {session && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img src={session.user?.image || ""} className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</p>
                <p className="text-xs text-green-600 font-medium">● Online</p>
              </div>
            </div>
            <button onClick={() => signOut()} className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {!session ? (
           <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
              <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl mb-4">📸</div>
              <h2 className="text-3xl font-black text-gray-900">Welcome to CreatorLens</h2>
              <button onClick={() => signIn("google")} className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200">
                Sign in with Google
              </button>
           </div>
        ) : (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
               <div className="space-y-10">
                 {recentVideos.length > 0 && (
                    <ViralSpikeManager recentVideos={recentVideos} velocity={viewVelocity} />
                 )}
                 {channelData && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {['Subscriber Count', 'View Count', 'Video Count'].map((label, idx) => {
                        const keys = ['subscriberCount', 'viewCount', 'videoCount'];
                        return (
                          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                            <p className="text-3xl font-black text-gray-900">{Number(channelData.stats[keys[idx]]).toLocaleString()}</p>
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

            {/* 2. PREMIUM TABS (Using Real deepData) */}
            {activeTab === 'competitors' && <CompetitorInsights myStats={channelData?.stats} />}
            {activeTab === 'health' && <ChannelHealth stats={channelData?.stats} videos={recentVideos} />}
            {activeTab === 'loyalty' && <AudienceLoyalty data={deepData?.loyalty} />}
            {activeTab === 'format' && <ContentFormat videos={recentVideos} />}
            {activeTab === 'saturation' && <TopicSaturation traffic={deepData?.traffic} />}
            {activeTab === 'retention' && <RetentionAnalyzer data={deepData?.retention} videos={recentVideos} />}
            {activeTab === 'decisions' && <DecisionLog />}
            {activeTab === 'forecast' && <GrowthForecast stats={channelData?.stats} />}

          </div>
        )}
      </main>
    </div>
  );
}