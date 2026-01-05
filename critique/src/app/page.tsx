import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { SubmissionCard } from '@/components/SubmissionCard';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const currentFilter = filter || 'all';

  let query = supabase.from('submissions').select(`*, profiles (full_name, avatar_url), comments (count)`).or('is_hidden.eq.false,is_hidden.is.null').order('created_at', { ascending: false });
  if (currentFilter === 'channel_only') query = query.in('submission_type', ['channel_only', 'channel']);
  if (currentFilter === 'video_only') query = query.in('submission_type', ['video_only', 'video']);
  if (currentFilter === 'mixed') query = query.eq('submission_type', 'mixed');

  const { data: channels } = await query;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white transition-colors duration-500 font-poppins">
      
      {/* --- NEW DYNAMIC HERO SECTION --- */}
      <section className="relative overflow-hidden border-b border-border pt-10 pb-20 md:pb-32 transition-colors duration-500">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50 dark:opacity-100" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-ytRed/5 border border-ytRed/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ytRed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ytRed"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ytRed italic">Live Creator Intelligence</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85] text-black dark:text-white transition-colors duration-500">
              FIX YOUR <br />
              <span className="text-ytRed drop-shadow-[0_0_30px_rgba(204,0,0,0.15)] leading-none">RETENTION.</span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg max-w-lg leading-relaxed italic transition-colors duration-500">
              Stop guessing why viewers click away. Get your content <span className="text-black dark:text-white underline decoration-ytRed decoration-4 underline-offset-8">teared down</span> by high-level creators and editors.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-ytRed text-white px-10 py-5 font-black uppercase tracking-widest border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(204,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Post Channel
              </button>
              <button className="border-4 border-black dark:border-white text-black dark:text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                Browse Feed
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL: DYNAMIC AUDIT FEED MOCKUP */}
          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative bg-white dark:bg-[#0a0a0a] border-4 border-black dark:border-white p-6 rounded-sm shadow-2xl transition-colors duration-500">
              {/* Mock Video UI */}
              <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 border border-border mb-6 flex items-center justify-center relative overflow-hidden group">
                 <div className="w-16 h-16 rounded-full bg-ytRed flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
                 </div>
                 {/* Mock Retention Line */}
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-ytRed shadow-[0_0_15px_rgba(204,0,0,0.5)]" />
              </div>

              {/* Mock Comments Feed */}
              <div className="space-y-4">
                <div className="flex gap-3 items-start opacity-100">
                  <div className="w-8 h-8 rounded-full bg-ytRed/20 border border-ytRed/40 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-2 w-24 bg-ytRed/20 rounded-full" />
                    <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-3 items-start opacity-50">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    <div className="h-3 w-3/4 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Status Badge Overlay */}
              <div className="absolute -top-6 -right-6 bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-black uppercase italic tracking-tighter border-4 border-ytRed -rotate-12 shadow-2xl">
                Audit In Progress
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ytRed to-transparent shadow-[0_0_10px_#cc0000]" />
      </section>

      {/* --- FILTER & FEED SECTION --- */}
      <section className="bg-white dark:bg-[#000000] p-6 md:p-12 min-h-screen transition-colors duration-500">
        <div className="max-w-[1920px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-border gap-6">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-ytRed uppercase tracking-[0.5em] flex items-center gap-3">
                <span className="w-2 h-2 bg-ytRed rounded-full animate-pulse shadow-[0_0_10px_#cc0000]"></span>
                Intelligence Hub
              </h2>
              <h3 className="text-4xl font-black uppercase tracking-tighter italic text-black dark:text-white transition-colors duration-500">Active Teardowns</h3>
            </div>

            <div className="flex items-center overflow-hidden border border-border bg-foreground/[0.03] dark:bg-white/[0.03] rounded-sm">
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'mixed', label: 'Combo', icon: '📺+🎬' },
                { id: 'channel_only', label: 'Channel', icon: '📺' },
                { id: 'video_only', label: 'Video', icon: '🎬' },
              ].map((f) => (
                <Link 
                  key={f.id} 
                  href={f.id === 'all' ? '/' : `/?filter=${f.id}`}
                  scroll={false} 
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-r last:border-r-0 border-border
                    ${currentFilter === f.id 
                      ? 'bg-ytRed text-white' 
                      : 'text-gray-500 hover:text-foreground hover:bg-foreground/[0.05]'}
                  `}
                >
                  {f.icon && <span className="text-xs grayscale brightness-125">{f.icon}</span>}
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {!channels || channels.length === 0 ? (
              <div className="col-span-full py-32 text-center text-gray-500 border-4 border-dashed border-border uppercase font-black tracking-[0.5em] italic">
                Scanning Database... No Results Found.
              </div>
            ) : (
              channels.map((channel: any) => (
                <SubmissionCard key={channel.id} channel={channel} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}