import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { SubmissionCard } from '@/components/SubmissionCard';
import { HeroActions } from '@/components/HeroActions';
import { MyThreadsSection } from '@/components/MyThreadsSection'; // <--- IMPORT THIS

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const currentFilter = (await filter) || 'all';

  // --- QUERY 1: MAIN FEED (Public) ---
  let query = supabase
    .from('submissions')
    .select(`*, profiles (full_name, avatar_url), comments (count)`)
    .or('is_hidden.eq.false,is_hidden.is.null')
    .order('created_at', { ascending: false });

  if (currentFilter === 'channel_only') {
    query = query.in('submission_type', ['channel_only', 'channel']);
  } else if (currentFilter === 'video_only') {
    query = query.in('submission_type', ['video_only', 'video']);
  } else if (currentFilter === 'mixed') {
    query = query.eq('submission_type', 'mixed');
  }

  const { data: channels } = await query;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#080808] text-slate-900 dark:text-slate-100 transition-colors duration-700 font-poppins">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 md:pt-0 pb-24 md:pb-48 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-ytRed/15 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-[520px] z-30">
            <h1 className="text-6xl md:text-[80px] font-black tracking-tighter leading-[0.85] uppercase italic mb-4 text-slate-900 dark:text-white">
              Map the exact <br />
              <span className="text-[#FF0032] drop-shadow-[0_0_35px_rgba(255,0,50,0.3)]">Exit Point.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-snug font-bold italic mb-6">
              Detect retention cliffs before they scale. Get timestamped teardowns on your hook mechanics, verbal pacing, and frame-by-frame audience fatigue.
            </p>
            <div className="mt-2">
              <HeroActions /> 
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:block relative min-h-[700px] animate-in fade-in slide-in-from-right-12 duration-1000">
             <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[440px] bg-white/40 dark:bg-white/[0.03] border border-white/40 dark:border-white/10 p-10 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl z-20 animate-float">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#FF0032] p-[3px] shadow-lg">
                       <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center font-black text-sm">JD</div>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase leading-none text-slate-900 dark:text-white">Jordan D.</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Verified Expert • 1.2M Subs</p>
                    </div>
                 </div>
                 <div className="flex gap-0.5 text-[#FF0032] text-[10px] font-black">★★★★★</div>
              </div>
              <div className="px-6 py-5 bg-white/40 dark:bg-white/5 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-inner">
                 <p className="text-[15px] font-bold leading-relaxed italic text-slate-700 dark:text-slate-200">
                  "Identified a massive cliff at 04:20. On <span className="text-[#FF0032] font-black">Critique</span>, we solved it in 5 minutes."
                 </p>
              </div>
            </div>
            {/* Floating Nodes */}
            <div className="absolute top-[5%] right-0 w-72 bg-white/30 dark:bg-white/[0.02] backdrop-blur-2xl border border-white/30 dark:border-white/10 p-6 rounded-[2.5rem] shadow-xl z-30 animate-float-delayed">
              <p className="text-[12px] font-bold italic leading-tight text-slate-600 dark:text-slate-300">"The pacing audit changed my entire workflow. Every frame matters now."</p>
            </div>
            <div className="absolute bottom-[10%] left-0 w-80 bg-white/30 dark:bg-white/[0.02] backdrop-blur-2xl border border-white/30 dark:border-white/10 p-6 rounded-[2.5rem] shadow-xl z-10 animate-float-reverse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF0032] animate-pulse shadow-[0_0_15px_#cc0000]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FF0032]">Audio Audit</span>
              </div>
              <p className="text-[12px] font-bold italic text-slate-600 dark:text-slate-300">"The verbal hook now hits 40% harder after the audit."</p>
            </div>
             <div className="absolute top-[25%] -left-12 w-64 bg-white/20 dark:bg-white/[0.01] backdrop-blur-md border border-white/20 p-5 rounded-[2rem] shadow-lg z-10 animate-float-delayed">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Visual Pacing Expert</p>
               <p className="text-[11px] font-bold italic opacity-70">"Pattern interrupt at 01:15 effectively reset viewer boredom clock."</p>
            </div>
            <div className="absolute top-[60%] -right-20 w-48 bg-white/10 dark:bg-white/[0.01] backdrop-blur-sm border border-white/10 p-4 rounded-3xl shadow-sm z-0 animate-float">
               <div className="h-1.5 w-2/3 bg-[#FF0032]/40 rounded-full mb-2" />
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">+22% Av. View Duration</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLIENT COMPONENT: MY THREADS --- */}
      {/* This will handle auth check and fetching on the client side */}
      <MyThreadsSection />

      {/* --- FEED SECTION --- */}
      <section id="feed-section" className="bg-[#fcfcfc] dark:bg-[#050505] p-6 md:p-12 min-h-screen transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h3 className="text-5xl font-black uppercase tracking-tighter italic text-black dark:text-white mb-10">Active Threads</h3>
            
            {/* Filter Bar */}
            <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="flex flex-nowrap md:flex-wrap items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-8 min-w-max md:min-w-0">
                  {[
                    { id: 'all', label: 'All', icon: null },
                    { id: 'mixed', label: 'Mixed', icon: null },
                    { id: 'channel_only', label: 'Channel Only', icon: null },
                    { id: 'video_only', label: 'Video Only', icon: null },
                  ].map((f) => (
                    <Link key={f.id} href={f.id === 'all' ? '/' : `/?filter=${f.id}`} scroll={false} className="relative group flex-shrink-0">
                      <div className={`px-7 py-3 rounded-2xl text-[14px] font-bold transition-all flex items-center gap-2.5
                        ${currentFilter === f.id 
                          ? 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-black dark:text-white shadow-md backdrop-blur-md' 
                          : 'bg-slate-100/60 dark:bg-white/5 border border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                      `}>
                        {f.label}
                      </div>
                      {currentFilter === f.id && (
                        <div className="absolute -bottom-[33px] left-3 right-3 h-[4px] bg-[#FF0032] rounded-t-full shadow-[0_-6px_15px_rgba(255,0,50,0.4)] z-10" />
                      )}
                    </Link>
                  ))}
                </div>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16">
            {channels?.map((channel: any) => (
              <SubmissionCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}