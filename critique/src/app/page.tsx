import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ChannelAvatar } from '@/components/ChannelAvatar';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0;

export default async function Home() {
  const { data: dbChannels } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  const channels = dbChannels && dbChannels.length > 0 ? dbChannels : [
    { 
      id: 'mock1', 
      channel_name: 'Marques Brownlee', 
      goal_text: 'Reviewing tech is easy, but keeping retention high is hard.', 
      youtube_url: '#', 
      avatar_url: 'https://unavatar.io/youtube/mkbhd' 
    },
    { 
      id: 'mock2', 
      channel_name: 'MrBeast', 
      goal_text: 'Even I need feedback. Are the intros too fast?', 
      youtube_url: '#', 
      avatar_url: 'https://unavatar.io/youtube/mrbeast' 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full border-b border-border bg-background overflow-hidden">
        {/* Subtle dot pattern for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#80808033_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

        <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          
          {/* LEFT: The Pitch */}
          <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10 lg:border-r border-border/50">
            <div className="inline-block mb-6">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-ytRed border border-ytRed/30 px-3 py-1 rounded bg-ytRed/5">
                Community Beta
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic text-foreground mb-6 leading-[0.9]">
              Critique. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ytRed to-red-600">Improve.</span> <br />
              Grow.
            </h1>

            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed">
              The honest feedback loop for creators. Post your channel, get timestamped critiques, and fix your retention graph.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-ytRed text-white font-black px-10 py-4 shadow-yt-glow hover:-translate-y-1 transition-all uppercase text-sm tracking-widest">
                Start Reviewing
              </button>
              <button className="border border-border bg-background text-foreground px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-panel transition-colors">
                Browse Channels
              </button>
            </div>
          </div>

          {/* RIGHT: The "Video Player" Visual (Grounded, not abstract) */}
          <div className="bg-panel/50 relative flex items-center justify-center p-12 lg:p-0 overflow-hidden">
             {/* The "Player" Container */}
             <div className="w-full max-w-lg aspect-video bg-black rounded-lg border border-border shadow-2xl relative group overflow-hidden">
                
                {/* Simulated Video Screen */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                   <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                   </div>
                </div>

                {/* Progress Bar (The "Retention" Visual) */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                   <div className="h-full w-[65%] bg-ytRed relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-ytRed rounded-full shadow border border-white transform scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                   </div>
                </div>

                {/* The "Comment" Overlay (Simulating the App's function) */}
                <div className="absolute top-8 right-8 max-w-[200px] bg-background/90 backdrop-blur border border-border p-4 rounded shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-ytRed"></div>
                      <span className="text-[10px] font-bold text-foreground">Editor_Phil</span>
                   </div>
                   <p className="text-xs font-medium text-gray-500 leading-tight">
                     "The hook is weak here. You need to cut the first 5 seconds."
                   </p>
                </div>
             </div>
             
             {/* Background glow behind the player */}
             <div className="absolute inset-0 bg-ytRed/5 pointer-events-none"></div>
          </div>

        </div>
      </section>

      {/* --- LIVE FEED (Full Width) --- */}
      <section className="bg-background border-b border-border p-6 md:p-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex justify-between items-end mb-8 pb-4 border-b border-border">
            <div>
              <h2 className="text-xs font-black text-ytRed uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-ytRed rounded-full animate-pulse"></span>
                Live Feed
              </h2>
              <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-foreground">
                Recent Submissions
              </h3>
            </div>
            <Link href="/explore" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-ytRed transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channels.map((channel: any) => (
              <Link 
                href={`/channel/${channel.id}`} 
                key={channel.id} 
                className="block group"
              >
                <div className="h-full flex flex-col justify-between bg-panel border border-border p-5 shadow-tactile hover:-translate-y-1 hover:shadow-yt-glow hover:border-ytRed/50 transition-all cursor-pointer relative overflow-hidden rounded-sm">
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-border group-hover:border-ytRed/50 overflow-hidden bg-background relative shadow-sm">
                            <ChannelAvatar 
                              url={channel.avatar_url} 
                              name={channel.channel_name} 
                            />
                        </div>
                        <span className="px-2 py-0.5 bg-background border border-border text-[8px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-ytRed group-hover:border-ytRed/30 transition-colors">
                            Active
                        </span>
                    </div>
                  </div>

                  <h4 className="text-base font-black uppercase tracking-tight mb-2 text-foreground group-hover:text-ytRed transition-colors truncate">
                    {channel.channel_name}
                  </h4>
                  
                  <div className="relative pl-3 border-l-2 border-border group-hover:border-ytRed mb-6 transition-colors h-12 overflow-hidden">
                    <p className="text-xs font-medium text-gray-500 italic line-clamp-2">
                      "{channel.goal_text}"
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border flex justify-between items-center group-hover:border-ytRed/20">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-foreground">Critique</span>
                    <span className="text-sm text-foreground group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SIMPLE STEPS --- */}
      <section className="bg-panel border-b border-border py-12">
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Share Link", desc: "No signup walls. Just paste." },
            { step: "02", title: "Get Roasted", desc: "Timestamped feedback." },
            { step: "03", title: "Fix It", desc: "Watch your retention grow." }
          ].map((item, i) => (
            <div key={i} className="group">
              <div className="text-4xl font-black text-gray-800 group-hover:text-ytRed transition-colors mb-2 opacity-50">
                {item.step}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter mb-1 text-foreground">{item.title}</h3>
              <p className="text-xs font-medium text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}