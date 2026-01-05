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
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 font-poppins">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden border-b-8 border-black dark:border-white pt-16 pb-24 md:pb-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] text-black dark:text-white">
              UNLOCK YOUR <br />
              <span className="text-ytRed drop-shadow-[10px_10px_0px_rgba(0,0,0,1)] dark:drop-shadow-[10px_10px_0px_rgba(255,255,255,0.2)]">GROWTH.</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 font-bold text-xl md:text-2xl max-w-lg leading-tight italic">
              Stop guessing. Get <span className="text-ytRed underline decoration-8 underline-offset-4">4K surgical audits</span> on your content. Stop posing, start growing.
            </p>

            <div className="flex flex-wrap gap-6">
              <button className="bg-ytRed text-white px-12 py-6 font-black uppercase tracking-widest border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                Post Your Channel
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL: TESTIMONIAL STACK (NEW) */}
          <div className="hidden lg:block relative min-h-[550px] animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Main Expert Testimonial */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white dark:bg-[#0a0a0a] border-8 border-black dark:border-white p-10 shadow-[20px_20px_0px_0px_#cc0000] z-20 animate-float">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-ytRed border-4 border-black dark:border-white flex items-center justify-center font-black text-xl text-white">JD</div>
                    <div>
                      <p className="text-sm font-black uppercase text-black dark:text-white leading-none">Jordan D.</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Verified Expert • 1.2M Subs</p>
                    </div>
                 </div>
                 <div className="flex gap-1 text-ytRed font-black">★★★★★</div>
              </div>
              <div className="p-4 bg-neutral-100 dark:bg-white/5 border-4 border-black dark:border-white italic">
                 <p className="text-sm font-black leading-tight text-black dark:text-white uppercase">
                  "Found a massive retention cliff. On <span className="text-ytRed underline">Critique</span>, we solved it in 5 minutes. +15% viewers held."
                 </p>
              </div>
            </div>

            {/* Floating Node 1 */}
            <div className="absolute -top-10 -right-8 w-72 bg-white dark:bg-black border-4 border-black dark:border-white p-6 shadow-xl z-30 animate-float-delayed">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 border border-black" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Visual Hook Audit</span>
              </div>
              <p className="text-[11px] font-black italic uppercase">"Saturation masking subject. Recalibrate focus."</p>
            </div>

            {/* Floating Node 2 */}
            <div className="absolute -bottom-12 -left-8 w-72 bg-white dark:bg-black border-4 border-black dark:border-white p-6 shadow-xl z-10 animate-float-reverse">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-ytRed border border-black" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Audio Pacing Node</span>
              </div>
              <p className="text-[11px] font-black italic uppercase">"Music peak mistimed. Delay 3.2s."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTER & FEED SECTION --- */}
      <section id="feed-section" className="bg-[#f8f9fa] dark:bg-[#050505] p-6 md:p-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h3 className="text-5xl font-black uppercase tracking-tighter italic text-black dark:text-white mb-10">
              Active Threads
            </h3>

            <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-6">
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'mixed', label: 'mixed', icon: null },
                { id: 'channel_only', label: 'channel only', icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                )},
                { id: 'video_only', label: 'video only', icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                )},
              ].map((f) => (
                <Link key={f.id} href={f.id === 'all' ? '/' : `/?filter=${f.id}`} scroll={false} className="relative group">
                  <div className={`px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2
                    ${currentFilter === f.id 
                      ? 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-black dark:text-white shadow-sm' 
                      : 'bg-gray-200/50 dark:bg-white/5 border border-transparent text-gray-500 hover:text-black dark:hover:text-white'}
                  `}>
                    {f.icon && <span className="opacity-80">{f.icon}</span>}
                    {f.label}
                  </div>
                  {currentFilter === f.id && (
                    <div className="absolute -bottom-[25px] left-2 right-2 h-[4px] bg-ytRed rounded-t-full shadow-[0_-4px_12px_rgba(204,0,0,0.4)]" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-12">
            {!channels || channels.length === 0 ? (
              <div className="col-span-full py-32 text-center text-gray-500 border-4 border-dashed border-border uppercase font-black tracking-[0.5em] italic">
                Scanning Database... No Threads Found.
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