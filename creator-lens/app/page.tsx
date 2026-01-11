"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import AICoach from "@/components/AICoach";
import AnalyticsDashboard from "@/components/AnalyticsDashboard"; // Import the new Charts
import CommentReplyTool from "@/components/CommentReplyTool";

export default function Home() {
  const { data: session } = useSession();
  
  // Data State
  const [channelData, setChannelData] = useState<any>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [viewVelocity, setViewVelocity] = useState<Record<string, number>>({});
  
  // Refs & Timers
  const previousVideosRef = useRef<any[]>([]);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(60);
  
  // AI State
  const [selectedVideoPrompt, setSelectedVideoPrompt] = useState("");

  const fetchData = async () => {
    try {
      console.log("🔄 Polling YouTube Data..."); 
      
      const statsRes = await fetch("/api/youtube/stats");
      const statsData = await statsRes.json();
      if (!statsData.error) setChannelData(statsData);

      const videosRes = await fetch("/api/youtube/videos");
      const videosData = await videosRes.json();
      
      if (videosData.videos) {
        const newVideos = videosData.videos;

        // Calculate Velocity (Real-time view changes)
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
    } catch (err) {
      console.error("Polling Error:", err);
    }
  };

  // Master Timer (Single Source of Truth)
  useEffect(() => {
    if (session) {
      fetchData(); // Initial load

      const interval = setInterval(() => {
        setTimeUntilUpdate((prevTime) => {
          if (prevTime <= 1) {
            fetchData(); // Fetch when timer hits 0
            return 60;   // Reset to 60s
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  // Helper to format dates for AI context
  const getDayAndTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}`;
  };

  const handleAnalyzeClick = (video: any) => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
    const engagementRate = ((parseInt(video.likes) + parseInt(video.comments)) / parseInt(video.views) * 100).toFixed(2);
    const viewDiff = viewVelocity[video.id] || 0;

    // 1. Compile History for Context (Pattern Recognition)
    const historySummary = recentVideos.map(v => 
      `- Uploaded ${getDayAndTime(v.publishedAt)}: ${parseInt(v.views).toLocaleString()} views`
    ).join('\n');

    // 2. The Enhanced "6-Feature" Prompt
    const prompt = `Act as an expert YouTube Analyst. Analyze this channel data to improve growth.

TARGET VIDEO METRICS:
- Title: "${video.title}"
- Published: ${getDayAndTime(video.publishedAt)}
- Total Views: ${Number(video.views).toLocaleString()}
- REAL-TIME VELOCITY: +${viewDiff} views/minute
- Likes: ${Number(video.likes).toLocaleString()} / Comments: ${Number(video.comments).toLocaleString()}
- Engagement Rate: ${engagementRate}%

CHANNEL CONTEXT (Last 5 Uploads):
${historySummary}

Provide a concise, actionable report with these 6 SECTIONS:

1. 🚀 SEO OPTIMIZATION
   - Critique the title. Provide 2 alternative "High-CTR" titles.
   - Suggest 3 specific tags/keywords I missed.

2. ⏰ OPTIMAL POSTING TIMES
   - Analyze the "Channel Context" list above. Do videos posted on specific days or times perform better?
   - Was the target video published at an optimal time? If not, suggest a better slot.

3. 🔮 PERFORMANCE PREDICTION
   - Based on the current velocity (+${viewDiff} views/min) and engagement (${engagementRate}%), forecast the total views in 7 days.
   - Is this video trending up or flattening out compared to recent uploads?

4. 📈 CONTENT IMPROVEMENT
   - Suggest one specific editing trick to increase retention for this topic.
   - Suggest a "Pinned Comment" strategy to trigger replies.

5. ❤️ SENTIMENT ANALYSIS
   - Based on the Like-to-Comment ratio, interpret the audience vibe.
   - How should I reply to comments on this specific video?

6. 💡 FUTURE CONTENT GENERATOR
   - Pitch 2 SEQUEL ideas based on this topic.
   - Include a "Hook" script for the intro of each idea.

Keep it brief. Use bullet points. Be brutal and actionable.`;
    
    setSelectedVideoPrompt(prompt);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CreatorLens</h1>
            {session && (
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-2 animate-pulse whitespace-nowrap hidden sm:flex">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                LIVE UPDATES: {timeUntilUpdate}s
              </span>
            )}
          </div>

          {!session ? (
            <button onClick={() => signIn("google")} className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Sign in with Google
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => signOut()} className="text-xs text-red-500 hover:text-red-700 font-medium">Sign Out</button>
              <img src={session.user?.image || ""} alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-100" />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* SECTION 1: Channel Overview */}
        {session && channelData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Channel Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Subscriber Count', 'View Count', 'Video Count'].map((label, idx) => {
                 const keys = ['subscriberCount', 'viewCount', 'videoCount'];
                 return (
                   <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <p className="text-gray-500 text-sm">{label}</p>
                     <p className="text-3xl font-bold text-gray-900">
                       {Number(channelData.stats[keys[idx]]).toLocaleString()}
                     </p>
                   </div>
                 )
              })}
            </div>
          </div>
        )}

        {/* SECTION 1.5: Detailed Analytics (CHARTS) */}
        {session && (
          <div className="mb-10">
             <AnalyticsDashboard />
          </div>
        )}

        {/* SECTION 2: Real-Time Video Dashboard */}
        {session && recentVideos.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              Recent Uploads <span className="text-xs font-normal text-gray-400">(Auto-refreshes every 60s)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                  
                  {/* Thumbnail */}
                  <div className="aspect-video w-full bg-gray-200 relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-3 h-12">{video.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      
                      {/* VIEWS ROW */}
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 text-sm">Views</span>
                        
                        <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                          <span className="font-bold text-gray-900">
                            {Number(video.views).toLocaleString()}
                          </span>
                          
                          {/* Green Velocity Box */}
                          {viewVelocity[video.id] > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                              +{viewVelocity[video.id]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500 px-2">
                        <span className="flex items-center gap-1">👍 {Number(video.likes).toLocaleString()}</span>
                        <span className="flex items-center gap-1">💬 {Number(video.comments).toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAnalyzeClick(video)}
                      className="mt-auto w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                    >
                      ✨ Generate Strategy Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="ai-tools-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
  {/* Left Side: The Main AI Strategist (Takes up 2/3 space) */}
  <div className="lg:col-span-2">
    <AICoach prefill={selectedVideoPrompt} />
  </div>

  {/* Right Side: The New Reply Tool (Takes up 1/3 space) */}
  <div className="lg:col-span-1">
    <CommentReplyTool />
  </div>
</div>
      </div>
    </main>
  );
}