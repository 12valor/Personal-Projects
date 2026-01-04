import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ChannelAvatar } from '@/components/ChannelAvatar';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Force dynamic rendering so new submissions appear instantly
export const revalidate = 0;

export default async function Home() {
  // Fetch real channels from Supabase
  const { data: dbChannels } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback mock data if DB is empty (so the UI looks good while testing)
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
      channel_name: 'CaseyNeistat', 
      goal_text: 'My vlogs feel messy lately. Do I need more structure?', 
      youtube_url: '#', 
      avatar_url: 'https://unavatar.io/youtube/caseyneistat' 
    },
    { 
      id: 'mock3', 
      channel_name: 'MrBeast', 
      goal_text: 'Even I need feedback. Are the intros too fast?', 
      youtube_url: '#', 
      avatar_url: 'https://unavatar.io/youtube/mrbeast' 
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      
      {/* --- HERO SECTION --- */}
      <section className="grid grid-cols-12 gap-0 border-b border-border min-h-[60vh]">
        <div className="col-span-12 lg:col-span-7 p-12 lg:p-20 bg-panel border-r border-border flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-ytRed animate-pulse"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-ytRed">Beta Access</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-8 uppercase italic text-foreground">
            Fix your <br /><span className="text-ytRed">Content.</span>
          </h1>
          
          <p className="text-gray-500 text-lg lg:text-xl font-medium max-w-md mb-12 border-l-4 border-ytRed pl-6">
            Stop refreshing analytics. Get brutal, honest feedback from real creators and fix your retention graph.
          </p>

          <div className="flex gap-4">
            <button className="bg-ytRed text-white font-black px-8 py-4 shadow-yt-glow hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all uppercase text-sm tracking-widest flex items-center gap-3">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent"></div>
              Start Review
            </button>
            <button className="border-2 border-border text-foreground px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-border transition-colors">
              Explore
            </button>
          </div>
        </div>

        {/* --- 3D VISUAL --- */}
        <div className="col-span-12 lg:col-span-5 bg-background relative overflow-hidden flex items-center justify-center p-12">
          <div className="absolute top-10 right-10 w-20 h-20 border-4 border-border rounded-full opacity-50"></div>
          <div className="absolute bottom-20 left-10 w-32 h-2 bg-ytRed opacity-20"></div>

          <div className="relative w-64 h-48 bg-panel border-2 border-border rounded-2xl shadow-tactile transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
            <div className="absolute top-0 left-0 right-0 h-32 bg-border/30 rounded-t-xl flex items-center justify-center overflow-hidden">
               <div className="w-12 h-12 bg-ytRed rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
               </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
              <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-ytRed w-2/3 shadow-[0_0_10px_#FF0033]"></div>
          </div>
        </div>
      </section>

      {/* --- LIVE CHANNEL FEED --- */}
      <section className="bg-background border-b border-border p-12">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-border">
          <div>
            <h2 className="text-xs font-black text-ytRed uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-ytRed rounded-full animate-pulse"></span>
              Live Feed
            </h2>
            <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-foreground">Channels Waiting for Feedback</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel: any) => (
            // WRAPPER: Makes the entire card clickable and links to detail page
            <Link 
              href={`/channel/${channel.id}`} 
              key={channel.id} 
              className="block h-full"
            >
              <div className="group h-full flex flex-col justify-between bg-panel border border-border p-6 shadow-tactile hover:-translate-y-2 hover:shadow-yt-glow hover:border-ytRed/50 transition-all cursor-pointer relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                      
                      {/* CLIENT COMPONENT: Handles Image Loading & Fallbacks */}
                      <div className="w-10 h-10 rounded-full border border-border group-hover:border-ytRed/50 overflow-hidden bg-background relative shadow-sm">
                          <ChannelAvatar 
                            url={channel.avatar_url} 
                            name={channel.channel_name} 
                          />
                      </div>

                      <span className="px-2 py-1 bg-background border border-border text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-ytRed group-hover:border-ytRed/30 transition-colors">
                          Review
                      </span>
                  </div>
                  <span className="font-mono text-xs text-gray-400">0:00 / 10:00</span>
                </div>

                <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-foreground group-hover:text-ytRed transition-colors">
                  {channel.channel_name}
                </h4>
                
                <div className="relative pl-4 border-l-2 border-border group-hover:border-ytRed mb-8 transition-colors">
                  <p className="text-sm font-medium text-gray-500 italic line-clamp-3">
                    "{channel.goal_text}"
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center group-hover:border-ytRed/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-foreground">Critique Now</span>
                  <span className="text-lg text-foreground group-hover:translate-x-1 transition-transform">→</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border bg-panel">
        {[
          { step: "01", title: "Upload Link", desc: "Paste your URL. No signup walls." },
          { step: "02", title: "Get Roasted", desc: "Honest feedback from real creators." },
          { step: "03", title: "Go Viral", desc: "Fix the drop-offs. Improve CTR." }
        ].map((item, i) => (
          <div key={i} className={`p-16 border-b md:border-b-0 ${i !== 2 ? 'md:border-r' : ''} border-border hover:bg-background transition-colors group`}>
            <div className="w-12 h-12 mb-6 rounded-full border-2 border-border flex items-center justify-center text-lg font-black text-gray-400 group-hover:border-ytRed group-hover:text-ytRed transition-all">
              {item.step}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic text-foreground">{item.title}</h3>
            <p className="text-sm font-medium text-gray-500 group-hover:text-foreground">{item.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}