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
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden border-b border-border pt-10 pb-20 md:pb-32 transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50 dark:opacity-100" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 md:space-y-10">
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-ytRed/5 border border-ytRed/20 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ytRed italic">Community Intelligence Feed</span>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-5xl">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.85] text-black dark:text-white transition-colors duration-500">
                FIX YOUR <br />
                <span className="text-ytRed drop-shadow-[0_0_30px_rgba(204,0,0,0.15)] leading-none">RETENTION.</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm md:text-xl uppercase tracking-tight max-w-2xl mx-auto leading-tight italic transition-colors duration-500">
                Get your thumbnails, hooks, and pacing <span className="text-black dark:text-white underline decoration-ytRed decoration-4 underline-offset-8">shredded</span> by veteran creators.
              </p>
            </div>

            {/* START AUDIT BAR */}
            <div className="w-full max-w-3xl mt-6 md:mt-8">
              <div className="flex flex-col md:flex-row gap-0 shadow-[0_20px_80px_-15px_rgba(204,0,0,0.25)] transition-all">
                <div className="relative flex-1 group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-ytRed font-black animate-pulse">▶</div>
                  <input 
                    type="text" 
                    placeholder="PASTE CHANNEL OR VIDEO URL" 
                    className="w-full pl-12 pr-6 py-6 bg-white dark:bg-[#050505] border-y-4 border-l-4 border-black dark:border-white text-black dark:text-white font-black uppercase tracking-widest focus:outline-none placeholder:text-gray-700 transition-colors duration-300"
                  />
                </div>
                <button className="bg-ytRed text-white px-10 py-6 font-black uppercase tracking-[0.2em] border-4 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                  START AUDIT
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ytRed to-transparent shadow-[0_0_10px_#cc0000]" />
      </section>

      {/* --- FEED SECTION --- */}
      <section className="bg-white dark:bg-[#000000] p-6 md:p-12 min-h-screen transition-colors duration-500 font-poppins">
        <div className="max-w-[1920px] mx-auto">
          
          {/* --- CLEAN FILTER HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-border gap-6">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-ytRed uppercase tracking-[0.5em] flex items-center gap-3">
                <span className="w-2 h-2 bg-ytRed rounded-full animate-pulse shadow-[0_0_10px_#cc0000]"></span>
                Live Intelligence Feed
              </h2>
              <h3 className="text-4xl font-black uppercase tracking-tighter italic text-black dark:text-white transition-colors duration-500">Active Teardowns</h3>
            </div>

            {/* REDESIGNED FILTER BAR (CLEANER/HAMBURGER STYLE) */}
            <div className="flex items-center overflow-hidden border border-border bg-foreground/[0.03] dark:bg-white/[0.03] rounded-sm">
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'mixed', label: 'Combo', icon: '📺+🎬' },
                { id: 'channel_only', label: 'Channel', icon: '📺' },
                { id: 'video_only', label: 'Video', icon: '🎬' },
              ].map((f, index) => (
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
                System Scan: 0 Submissions Found
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