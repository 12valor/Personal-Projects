import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { HeroActions } from '@/components/HeroActions';
import { MyThreadsSection } from '@/components/MyThreadsSection';
import { HeroTestimonials } from '@/components/HeroTestimonials';
import { FeedGrid } from '@/components/FeedGrid';

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
      {/* UPDATED PADDING:
          - pt-32 (128px) on Mobile: Standard spacing.
          - lg:pt-36 (144px) on Desktop: Tighter top gap as requested.
          - pb-24 / md:pb-48: Bottom spacing remains spacious.
      */}
      <section className="relative pt-32 lg:pt-36 pb-24 md:pb-48 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-ytRed/15 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-[520px] mx-auto lg:mx-0 z-30">
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
          <HeroTestimonials />

        </div>
      </section>

      {/* --- CLIENT COMPONENT: MY THREADS --- */}
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
          
          <FeedGrid channels={channels || []} />

        </div>
      </section>
    </div>
  );
}